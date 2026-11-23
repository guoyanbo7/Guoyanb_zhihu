/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 模型：知识库 RAG（MVC 之 Model）
 * 职责：文本清洗与分块、硅基流动 embedding、本地向量存储、余弦相似度检索、知识库问答
 */
const fs = require('fs');
const path = require('path');
const { Guoyanb_parseFile } = require('./Guoyanb_kbParser');
const Guoyanb_chatModel = require('./Guoyanb_chatModel');
const { Guoyanb_pool } = require('../config/db');

// ===== 配置（全部来自 backend/.env）=====
const Guoyanb_apiKey = process.env.SILICONFLOW_API_KEY;
const Guoyanb_baseUrl = process.env.SILICONFLOW_BASE_URL;
const Guoyanb_embedModel = process.env.SILICONFLOW_EMBED_MODEL || 'BAAI/bge-m3';

// ===== 本地存储路径 =====
const Guoyanb_UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const Guoyanb_DATA_DIR = path.join(__dirname, '..', 'kb_data');
const Guoyanb_INDEX_FILE = path.join(Guoyanb_DATA_DIR, 'Guoyanb_kb_index.json');

// 分块参数（按字符）
const Guoyanb_CHUNK_SIZE = 500;
const Guoyanb_CHUNK_OVERLAP = 80;
// 每批 embedding 的最大文本数
const Guoyanb_EMBED_BATCH = 16;

/**
 * 确保运行目录存在
 */
function Guoyanb_ensureDirs() {
  fs.mkdirSync(Guoyanb_UPLOAD_DIR, { recursive: true });
  fs.mkdirSync(Guoyanb_DATA_DIR, { recursive: true });
}

/**
 * 文本清洗：统一换行、压缩空白、去除零宽字符与多余空行
 */
function Guoyanb_cleanText(Guoyanb_text) {
  return (Guoyanb_text || '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\t\f\v]/g, ' ')
    .replace(/[ \u00a0]+/g, ' ')
    .replace(/[\u200b\ufeff]/g, '')
    .split('\n')
    .map(Guoyanb_line => Guoyanb_line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * 文本分块：固定长度窗口 + 重叠，窗口边界尽量在标点处断开
 * @returns {Array<string>}
 */
function Guoyanb_splitText(Guoyanb_text, Guoyanb_chunkSize = Guoyanb_CHUNK_SIZE, Guoyanb_overlap = Guoyanb_CHUNK_OVERLAP) {
  const Guoyanb_clean = Guoyanb_cleanText(Guoyanb_text);
  if (!Guoyanb_clean) return [];

  const Guoyanb_chunks = [];
  let Guoyanb_start = 0;

  while (Guoyanb_start < Guoyanb_clean.length) {
    let Guoyanb_end = Math.min(Guoyanb_start + Guoyanb_chunkSize, Guoyanb_clean.length);

    if (Guoyanb_end < Guoyanb_clean.length) {
      const Guoyanb_segment = Guoyanb_clean.slice(Guoyanb_start, Guoyanb_end);
      const Guoyanb_cut = Math.max(
        Guoyanb_segment.lastIndexOf('。'),
        Guoyanb_segment.lastIndexOf('\n'),
        Guoyanb_segment.lastIndexOf('；'),
        Guoyanb_segment.lastIndexOf('！'),
        Guoyanb_segment.lastIndexOf('？')
      );
      if (Guoyanb_cut > Guoyanb_chunkSize * 0.5) {
        Guoyanb_end = Guoyanb_start + Guoyanb_cut + 1;
      }
    }

    const Guoyanb_piece = Guoyanb_clean.slice(Guoyanb_start, Guoyanb_end).trim();
    if (Guoyanb_piece) Guoyanb_chunks.push(Guoyanb_piece);

    if (Guoyanb_end >= Guoyanb_clean.length) break;

    const Guoyanb_nextStart = Guoyanb_end - Guoyanb_overlap;
    Guoyanb_start = Guoyanb_nextStart > Guoyanb_start ? Guoyanb_nextStart : Guoyanb_end;
  }

  return Guoyanb_chunks;
}

/**
 * 调用硅基流动 embeddings，批量获取向量
 * @param {Array<string>} Guoyanb_texts 文本数组
 * @returns {Promise<Array<Array<number>>>} 与输入顺序一致的向量数组
 */
async function Guoyanb_embed(Guoyanb_texts) {
  if (!Array.isArray(Guoyanb_texts) || Guoyanb_texts.length === 0) return [];

  const Guoyanb_allVectors = [];

  for (let Guoyanb_i = 0; Guoyanb_i < Guoyanb_texts.length; Guoyanb_i += Guoyanb_EMBED_BATCH) {
    const Guoyanb_batch = Guoyanb_texts.slice(Guoyanb_i, Guoyanb_i + Guoyanb_EMBED_BATCH);
    const Guoyanb_payload = { model: Guoyanb_embedModel, input: Guoyanb_batch };

    console.log('[知识库·向量化] 发送给大模型的数据 ->', JSON.stringify(Guoyanb_payload, null, 2));

    const Guoyanb_resp = await fetch(Guoyanb_baseUrl + '/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Guoyanb_apiKey
      },
      body: JSON.stringify(Guoyanb_payload)
    });

    const Guoyanb_text = await Guoyanb_resp.text();
    let Guoyanb_data;
    try {
      Guoyanb_data = JSON.parse(Guoyanb_text);
    } catch (Guoyanb_parseErr) {
      throw new Error('向量接口返回了无法解析的内容：' + Guoyanb_text);
    }

    if (!Guoyanb_resp.ok) {
      const Guoyanb_errMsg = (Guoyanb_data.error && Guoyanb_data.error.message) || Guoyanb_text;
      throw new Error('向量接口错误（' + Guoyanb_resp.status + '）：' + Guoyanb_errMsg);
    }

    console.log('[知识库·向量化] 从大模型接收到的数据 ->', JSON.stringify({
      model: Guoyanb_data.model,
      vector_count: (Guoyanb_data.data || []).length,
      dimension: Guoyanb_data.data && Guoyanb_data.data[0] ? Guoyanb_data.data[0].embedding.length : 0,
      usage: Guoyanb_data.usage
    }, null, 2));

    const Guoyanb_sorted = (Guoyanb_data.data || []).slice().sort((a, b) => a.index - b.index);
    Guoyanb_allVectors.push(...Guoyanb_sorted.map(Guoyanb_item => Guoyanb_item.embedding));
  }

  return Guoyanb_allVectors;
}

/**
 * 读取知识库索引（不存在则返回空结构）
 */
function Guoyanb_readIndex() {
  Guoyanb_ensureDirs();
  if (!fs.existsSync(Guoyanb_INDEX_FILE)) return { files: [] };
  try {
    return JSON.parse(fs.readFileSync(Guoyanb_INDEX_FILE, 'utf-8'));
  } catch (Guoyanb_err) {
    return { files: [] };
  }
}

/**
 * 写入知识库索引
 */
function Guoyanb_writeIndex(Guoyanb_index) {
  Guoyanb_ensureDirs();
  fs.writeFileSync(Guoyanb_INDEX_FILE, JSON.stringify(Guoyanb_index, null, 2), 'utf-8');
}

/**
 * 把文档元数据登记到 MySQL 文档表（容错，不影响文件主流程）
 */
async function Guoyanb_insertDoc(Guoyanb_meta) {
  try {
    await Guoyanb_pool.query(
      'INSERT INTO Guoyanb_kb_docs ' +
      '(Guoyanb_doc_uid, Guoyanb_doc_name, Guoyanb_doc_ext, Guoyanb_doc_size, ' +
      'Guoyanb_chunk_count, Guoyanb_char_count, Guoyanb_doc_status, Guoyanb_upload_time, Guoyanb_remark) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        Guoyanb_meta.id, Guoyanb_meta.originalName, Guoyanb_meta.ext, Guoyanb_meta.size,
        Guoyanb_meta.chunkCount, Guoyanb_meta.charCount, 'active',
        new Date(Guoyanb_meta.uploadTime), '页面上传自动登记'
      ]
    );
    console.log('[知识库] 文档元数据已同步到 MySQL 表 Guoyanb_kb_docs');
  } catch (Guoyanb_dbErr) {
    console.error('[知识库] 文档表写入失败（不影响文件存储）->', Guoyanb_dbErr.message);
  }
}

/**
 * 从 MySQL 文档表删除对应记录（容错）
 */
async function Guoyanb_deleteDoc(Guoyanb_id) {
  try {
    await Guoyanb_pool.query('DELETE FROM Guoyanb_kb_docs WHERE Guoyanb_doc_uid = ?', [Guoyanb_id]);
    console.log('[知识库] 文档元数据已从 MySQL 表删除');
  } catch (Guoyanb_dbErr) {
    console.error('[知识库] 文档表删除失败（不影响文件删除）->', Guoyanb_dbErr.message);
  }
}

/**
 * 生成知识库文件 ID
 */
function Guoyanb_genId() {
  return 'kb_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

/**
 * 入库完整流程：解析 → 清洗 → 分块 → 向量化 → 落盘
 * @param {string} Guoyanb_originalName 原始文件名
 * @param {string} Guoyanb_storedPath 已保存到 uploads 的文件路径
 * @param {number} Guoyanb_size 文件大小（字节）
 * @returns {Promise<Object>} 文档元数据
 */
async function Guoyanb_ingest(Guoyanb_originalName, Guoyanb_storedPath, Guoyanb_size) {
  const Guoyanb_ext = path.extname(Guoyanb_originalName).toLowerCase();

  // 1. 解析为纯文本
  const Guoyanb_rawText = await Guoyanb_parseFile(Guoyanb_storedPath);

  // 2. 清洗 + 分块
  const Guoyanb_clean = Guoyanb_cleanText(Guoyanb_rawText);
  const Guoyanb_chunks = Guoyanb_splitText(Guoyanb_clean);

  if (Guoyanb_chunks.length === 0) {
    throw new Error('文件内容为空，无法构建知识库');
  }

  // 3. 向量化
  const Guoyanb_vectors = await Guoyanb_embed(Guoyanb_chunks);

  // 4. 生成 ID 并写文档数据文件
  const Guoyanb_id = Guoyanb_genId();
  const Guoyanb_docData = {
    id: Guoyanb_id,
    chunks: Guoyanb_chunks.map((Guoyanb_text, Guoyanb_idx) => ({
      index: Guoyanb_idx,
      text: Guoyanb_text,
      embedding: Guoyanb_vectors[Guoyanb_idx]
    }))
  };
  fs.writeFileSync(
    path.join(Guoyanb_DATA_DIR, Guoyanb_id + '.json'),
    JSON.stringify(Guoyanb_docData),
    'utf-8'
  );

  // 5. 更新索引
  const Guoyanb_index = Guoyanb_readIndex();
  const Guoyanb_meta = {
    id: Guoyanb_id,
    originalName: Guoyanb_originalName,
    storedName: path.basename(Guoyanb_storedPath),
    ext: Guoyanb_ext,
    size: Guoyanb_size,
    charCount: Guoyanb_clean.length,
    chunkCount: Guoyanb_chunks.length,
    uploadTime: new Date().toISOString()
  };
  Guoyanb_index.files.push(Guoyanb_meta);
  Guoyanb_writeIndex(Guoyanb_index);

  // 同步登记到 MySQL 文档表
  await Guoyanb_insertDoc(Guoyanb_meta);

  return Guoyanb_meta;
}

/**
 * 知识库文件列表
 */
function Guoyanb_list() {
  return Guoyanb_readIndex().files;
}

/**
 * 单个知识库文件详情（含分块文本，不含向量）
 */
function Guoyanb_detail(Guoyanb_id) {
  const Guoyanb_index = Guoyanb_readIndex();
  const Guoyanb_meta = Guoyanb_index.files.find(Guoyanb_f => Guoyanb_f.id === Guoyanb_id);
  if (!Guoyanb_meta) return null;

  const Guoyanb_dataPath = path.join(Guoyanb_DATA_DIR, Guoyanb_id + '.json');
  let Guoyanb_chunks = [];
  if (fs.existsSync(Guoyanb_dataPath)) {
    const Guoyanb_doc = JSON.parse(fs.readFileSync(Guoyanb_dataPath, 'utf-8'));
    Guoyanb_chunks = Guoyanb_doc.chunks.map(Guoyanb_c => ({ index: Guoyanb_c.index, text: Guoyanb_c.text }));
  }

  return { meta: Guoyanb_meta, chunks: Guoyanb_chunks };
}

/**
 * 删除知识库文件（索引 + 数据文件 + 原始上传文件）
 */
async function Guoyanb_remove(Guoyanb_id) {
  const Guoyanb_index = Guoyanb_readIndex();
  const Guoyanb_idx = Guoyanb_index.files.findIndex(Guoyanb_f => Guoyanb_f.id === Guoyanb_id);
  if (Guoyanb_idx === -1) return false;

  const Guoyanb_meta = Guoyanb_index.files[Guoyanb_idx];

  // 删除向量数据文件
  const Guoyanb_dataPath = path.join(Guoyanb_DATA_DIR, Guoyanb_id + '.json');
  if (fs.existsSync(Guoyanb_dataPath)) fs.unlinkSync(Guoyanb_dataPath);

  // 删除原始上传文件
  const Guoyanb_uploadPath = path.join(Guoyanb_UPLOAD_DIR, Guoyanb_meta.storedName);
  if (fs.existsSync(Guoyanb_uploadPath)) fs.unlinkSync(Guoyanb_uploadPath);

  Guoyanb_index.files.splice(Guoyanb_idx, 1);
  Guoyanb_writeIndex(Guoyanb_index);

  // 同步从 MySQL 文档表删除
  await Guoyanb_deleteDoc(Guoyanb_id);

  return true;
}

/**
 * 余弦相似度
 */
function Guoyanb_cosine(Guoyanb_a, Guoyanb_b) {
  let Guoyanb_dot = 0;
  let Guoyanb_na = 0;
  let Guoyanb_nb = 0;
  for (let Guoyanb_i = 0; Guoyanb_i < Guoyanb_a.length; Guoyanb_i++) {
    Guoyanb_dot += Guoyanb_a[Guoyanb_i] * Guoyanb_b[Guoyanb_i];
    Guoyanb_na += Guoyanb_a[Guoyanb_i] * Guoyanb_a[Guoyanb_i];
    Guoyanb_nb += Guoyanb_b[Guoyanb_i] * Guoyanb_b[Guoyanb_i];
  }
  return Guoyanb_dot / (Math.sqrt(Guoyanb_na) * Math.sqrt(Guoyanb_nb) + 1e-8);
}

/**
 * 向量检索：在全部知识库中召回与问题最相关的 topK 片段
 * @returns {Promise<Array<Object>>} [{fileId, fileName, chunkIndex, text, score}]
 */
async function Guoyanb_retrieve(Guoyanb_question, Guoyanb_topK) {
  const Guoyanb_index = Guoyanb_readIndex();
  if (Guoyanb_index.files.length === 0) return [];

  const [Guoyanb_qVec] = await Guoyanb_embed([Guoyanb_question]);

  const Guoyanb_candidates = [];
  for (const Guoyanb_meta of Guoyanb_index.files) {
    const Guoyanb_dataPath = path.join(Guoyanb_DATA_DIR, Guoyanb_meta.id + '.json');
    if (!fs.existsSync(Guoyanb_dataPath)) continue;

    const Guoyanb_doc = JSON.parse(fs.readFileSync(Guoyanb_dataPath, 'utf-8'));
    for (const Guoyanb_chunk of Guoyanb_doc.chunks) {
      Guoyanb_candidates.push({
        fileId: Guoyanb_meta.id,
        fileName: Guoyanb_meta.originalName,
        chunkIndex: Guoyanb_chunk.index,
        text: Guoyanb_chunk.text,
        score: Guoyanb_cosine(Guoyanb_qVec, Guoyanb_chunk.embedding)
      });
    }
  }

  return Guoyanb_candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, Guoyanb_topK);
}

/**
 * 知识库问答：检索相关片段 → 拼接上下文 → 调用大模型
 * @param {string} Guoyanb_question 用户问题
 * @param {number} Guoyanb_topK 召回片段数
 * @returns {Promise<Object>} {answer, refs, model, usage}
 */
async function Guoyanb_ask(Guoyanb_question, Guoyanb_topK = 4) {
  const Guoyanb_refs = await Guoyanb_retrieve(Guoyanb_question, Guoyanb_topK);

  const Guoyanb_context = Guoyanb_refs.length
    ? Guoyanb_refs.map((Guoyanb_r, Guoyanb_i) =>
        '【参考资料' + (Guoyanb_i + 1) + '】（来源文件：' + Guoyanb_r.fileName + '）\n' + Guoyanb_r.text
      ).join('\n\n')
    : '（知识库中暂无可参考的资料）';

  const Guoyanb_messages = [
    {
      role: 'system',
      content: '你是基于专属知识库的问答助手。请严格根据用户提供的参考资料回答问题，回答要准确、简洁、有条理；若参考资料中没有相关信息，请直接说明"根据现有知识库资料，我无法回答该问题"，不要编造资料以外的内容。'
    },
    {
      role: 'user',
      content: '参考资料：\n' + Guoyanb_context + '\n\n用户问题：' + Guoyanb_question
    }
  ];

  console.log('[知识库·问答] 发送给大模型的数据 ->', JSON.stringify(Guoyanb_messages, null, 2));

  const Guoyanb_result = await Guoyanb_chatModel.Guoyanb_chat(Guoyanb_messages);
  const Guoyanb_choice = Guoyanb_result.choices && Guoyanb_result.choices[0];

  console.log('[知识库·问答] 从大模型接收到的数据 ->', JSON.stringify({
    model: Guoyanb_result.model,
    answer: Guoyanb_choice ? Guoyanb_choice.message.content : '',
    usage: Guoyanb_result.usage
  }, null, 2));

  return {
    model: Guoyanb_result.model,
    answer: Guoyanb_choice ? Guoyanb_choice.message.content : '',
    usage: Guoyanb_result.usage || {},
    refs: Guoyanb_refs.map(Guoyanb_r => ({
      fileName: Guoyanb_r.fileName,
      chunkIndex: Guoyanb_r.chunkIndex,
      score: Number(Guoyanb_r.score.toFixed(4)),
      text: Guoyanb_r.text
    }))
  };
}

module.exports = {
  Guoyanb_ingest,
  Guoyanb_list,
  Guoyanb_detail,
  Guoyanb_remove,
  Guoyanb_retrieve,
  Guoyanb_ask,
  Guoyanb_splitText,
  Guoyanb_cleanText
};
