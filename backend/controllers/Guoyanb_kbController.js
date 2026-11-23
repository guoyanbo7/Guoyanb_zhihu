/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 控制器：知识库 RAG（MVC 之 Controller，上传 / 管理 / 问答）
 */
const fs = require('fs');
const Guoyanb_kbModel = require('../models/Guoyanb_kbModel');
const { Guoyanb_success, Guoyanb_fail } = require('../config/response');

/**
 * 上传并构建知识库（multer 已把文件保存到 uploads，req.file 可用）
 */
async function Guoyanb_upload(Guoyanb_req, Guoyanb_res) {
  if (!Guoyanb_req.file) {
    return Guoyanb_fail(Guoyanb_res, '未检测到上传文件，请选择支持的文件', 4001);
  }

  try {
    const Guoyanb_meta = await Guoyanb_kbModel.Guoyanb_ingest(
      Guoyanb_req.file.originalname,
      Guoyanb_req.file.path,
      Guoyanb_req.file.size
    );
    console.log('[知识库] 文件构建成功:', Guoyanb_meta.originalName, '分块数:', Guoyanb_meta.chunkCount);
    return Guoyanb_success(Guoyanb_res, '知识库文件上传并构建成功', Guoyanb_meta);
  } catch (Guoyanb_err) {
    console.error('[知识库] 构建失败 ->', Guoyanb_err.message);
    // 构建失败时清理已保存的原始文件
    if (Guoyanb_req.file && fs.existsSync(Guoyanb_req.file.path)) {
      try { fs.unlinkSync(Guoyanb_req.file.path); } catch (Guoyanb_cleanErr) {}
    }
    return Guoyanb_fail(Guoyanb_res, '知识库构建失败：' + Guoyanb_err.message, 4002);
  }
}

/**
 * 知识库文件列表
 */
function Guoyanb_list(Guoyanb_req, Guoyanb_res) {
  const Guoyanb_files = Guoyanb_kbModel.Guoyanb_list();
  return Guoyanb_success(Guoyanb_res, '知识库列表获取成功', {
    total: Guoyanb_files.length,
    list: Guoyanb_files
  });
}

/**
 * 知识库文件详情（含分块文本）
 */
function Guoyanb_detail(Guoyanb_req, Guoyanb_res) {
  const Guoyanb_result = Guoyanb_kbModel.Guoyanb_detail(Guoyanb_req.params.id);
  if (!Guoyanb_result) {
    return Guoyanb_fail(Guoyanb_res, '知识库文件不存在', 4005);
  }
  return Guoyanb_success(Guoyanb_res, '知识库详情获取成功', Guoyanb_result);
}

/**
 * 删除知识库文件
 */
async function Guoyanb_remove(Guoyanb_req, Guoyanb_res) {
  const Guoyanb_ok = await Guoyanb_kbModel.Guoyanb_remove(Guoyanb_req.params.id);
  if (!Guoyanb_ok) {
    return Guoyanb_fail(Guoyanb_res, '知识库文件不存在，删除失败', 4005);
  }
  return Guoyanb_success(Guoyanb_res, '知识库文件已删除', { id: Guoyanb_req.params.id });
}

/**
 * 基于知识库的问答
 */
async function Guoyanb_ask(Guoyanb_req, Guoyanb_res) {
  const Guoyanb_question = Guoyanb_req.body.question;
  let Guoyanb_topK = parseInt(Guoyanb_req.body.topK, 10);

  if (!Guoyanb_question || !String(Guoyanb_question).trim()) {
    return Guoyanb_fail(Guoyanb_res, '问题不能为空', 4003);
  }
  if (!Number.isFinite(Guoyanb_topK) || Guoyanb_topK < 1 || Guoyanb_topK > 10) {
    Guoyanb_topK = 4;
  }

  try {
    const Guoyanb_result = await Guoyanb_kbModel.Guoyanb_ask(String(Guoyanb_question).trim(), Guoyanb_topK);
    return Guoyanb_success(Guoyanb_res, '知识库问答成功', Guoyanb_result);
  } catch (Guoyanb_err) {
    console.error('[知识库] 问答失败 ->', Guoyanb_err.message);
    return Guoyanb_fail(Guoyanb_res, '知识库问答失败：' + Guoyanb_err.message, 4004);
  }
}

module.exports = {
  Guoyanb_upload,
  Guoyanb_list,
  Guoyanb_detail,
  Guoyanb_remove,
  Guoyanb_ask
};
