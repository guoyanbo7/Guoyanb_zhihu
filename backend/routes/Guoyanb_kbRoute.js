/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 路由：知识库 RAG（MVC 之 Route，上传 / 管理 / 问答）
 */
const express = require('express');
const multer = require('multer');
const path = require('path');
const Guoyanb_kbController = require('../controllers/Guoyanb_kbController');
const { Guoyanb_SUPPORTED_EXT } = require('../models/Guoyanb_kbParser');

const Guoyanb_router = express.Router();

// multer 磁盘存储：保存到 backend/uploads，文件名唯一并保留原扩展名
const Guoyanb_storage = multer.diskStorage({
  destination: (Guoyanb_req, Guoyanb_file, Guoyanb_cb) => {
    Guoyanb_cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (Guoyanb_req, Guoyanb_file, Guoyanb_cb) => {
    const Guoyanb_ext = path.extname(Guoyanb_file.originalname).toLowerCase();
    const Guoyanb_unique = Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    Guoyanb_cb(null, 'up_' + Guoyanb_unique + Guoyanb_ext);
  }
});

// 文件类型白名单校验
function Guoyanb_fileFilter(Guoyanb_req, Guoyanb_file, Guoyanb_cb) {
  const Guoyanb_ext = path.extname(Guoyanb_file.originalname).toLowerCase();
  if (Guoyanb_SUPPORTED_EXT.includes(Guoyanb_ext)) {
    return Guoyanb_cb(null, true);
  }
  Guoyanb_cb(new Error('仅支持 ' + Guoyanb_SUPPORTED_EXT.join('、') + ' 格式'));
}

const Guoyanb_upload = multer({
  storage: Guoyanb_storage,
  fileFilter: Guoyanb_fileFilter,
  defParamCharset: 'utf8',
  limits: { fileSize: 20 * 1024 * 1024 }
});

// 包装上传中间件，把 multer 错误转成统一 JSON 响应
function Guoyanb_uploadMiddleware(Guoyanb_req, Guoyanb_res, Guoyanb_next) {
  Guoyanb_upload.single('Guoyanb_file')(Guoyanb_req, Guoyanb_res, (Guoyanb_err) => {
    if (Guoyanb_err) {
      return Guoyanb_res.json({ code: 4006, msg: '上传失败：' + Guoyanb_err.message, data: {} });
    }
    Guoyanb_next();
  });
}

// 上传并构建：POST /api/kb/upload（form-data 字段名 Guoyanb_file）
Guoyanb_router.post('/upload', Guoyanb_uploadMiddleware, Guoyanb_kbController.Guoyanb_upload);

// 文件列表：GET /api/kb/files
Guoyanb_router.get('/files', Guoyanb_kbController.Guoyanb_list);

// 文件详情：GET /api/kb/files/:id
Guoyanb_router.get('/files/:id', Guoyanb_kbController.Guoyanb_detail);

// 删除文件：DELETE /api/kb/files/:id
Guoyanb_router.delete('/files/:id', Guoyanb_kbController.Guoyanb_remove);

// 知识库问答：POST /api/kb/ask
Guoyanb_router.post('/ask', Guoyanb_kbController.Guoyanb_ask);

module.exports = Guoyanb_router;
