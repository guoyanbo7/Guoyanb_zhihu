/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 模型：知识库文件解析（MVC 之 Model 的子模块）
 * 支持：.txt / .pdf / .doc / .docx / .ppt / .pptx，统一输出纯文本
 */
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const WordExtractor = require('word-extractor');
const officeParser = require('officeparser');
const { PDFParse } = require('pdf-parse');

// 上传白名单（扩展名，小写）
const Guoyanb_SUPPORTED_EXT = ['.txt', '.pdf', '.doc', '.docx', '.ppt', '.pptx'];

/**
 * 解析 TXT 纯文本
 */
function Guoyanb_parseTxt(Guoyanb_filePath) {
  return fs.readFileSync(Guoyanb_filePath, 'utf-8');
}

/**
 * 解析 PDF（pdf-parse 2.x：PDFParse 类）
 */
async function Guoyanb_parsePdf(Guoyanb_filePath) {
  const Guoyanb_parser = new PDFParse({ data: fs.readFileSync(Guoyanb_filePath) });
  try {
    const Guoyanb_result = await Guoyanb_parser.getText();
    return Guoyanb_result.text || '';
  } finally {
    await Guoyanb_parser.destroy();
  }
}

/**
 * 解析 DOCX（mammoth 提取纯文本）
 */
async function Guoyanb_parseDocx(Guoyanb_filePath) {
  const Guoyanb_result = await mammoth.extractRawText({ path: Guoyanb_filePath });
  return Guoyanb_result.value || '';
}

/**
 * 解析老版 DOC（word-extractor）
 */
async function Guoyanb_parseDoc(Guoyanb_filePath) {
  const Guoyanb_extractor = new WordExtractor();
  const Guoyanb_doc = await Guoyanb_extractor.extract(Guoyanb_filePath);
  return Guoyanb_doc.getBody() || '';
}

/**
 * 解析 PPT/PPTX（officeparser 4，仅支持 OOXML 的 .pptx）
 */
async function Guoyanb_parsePpt(Guoyanb_filePath, Guoyanb_ext) {
  if (Guoyanb_ext === '.ppt') {
    throw new Error('老版 .ppt 格式暂不支持解析，请用 PowerPoint 另存为 .pptx 后重新上传');
  }
  const Guoyanb_text = await officeParser.parseOfficeAsync(Guoyanb_filePath);
  return Guoyanb_text || '';
}

/**
 * 统一入口：按扩展名解析文件为纯文本
 * @param {string} Guoyanb_filePath 文件绝对路径
 * @returns {Promise<string>} 纯文本内容
 */
async function Guoyanb_parseFile(Guoyanb_filePath) {
  const Guoyanb_ext = path.extname(Guoyanb_filePath).toLowerCase();

  if (!Guoyanb_SUPPORTED_EXT.includes(Guoyanb_ext)) {
    throw new Error('不支持的文件类型：' + Guoyanb_ext);
  }

  switch (Guoyanb_ext) {
    case '.txt':
      return Guoyanb_parseTxt(Guoyanb_filePath);
    case '.pdf':
      return await Guoyanb_parsePdf(Guoyanb_filePath);
    case '.docx':
      return await Guoyanb_parseDocx(Guoyanb_filePath);
    case '.doc':
      return await Guoyanb_parseDoc(Guoyanb_filePath);
    case '.pptx':
    case '.ppt':
      return await Guoyanb_parsePpt(Guoyanb_filePath, Guoyanb_ext);
    default:
      throw new Error('不支持的文件类型：' + Guoyanb_ext);
  }
}

module.exports = {
  Guoyanb_SUPPORTED_EXT,
  Guoyanb_parseFile
};
