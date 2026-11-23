/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 路由：AI 聊天（MVC 之 Route，硅基流动）
 */
const express = require('express');
const Guoyanb_router = express.Router();
const Guoyanb_chatController = require('../controllers/Guoyanb_chatController');

// 发送消息：POST /api/chat
Guoyanb_router.post('/', Guoyanb_chatController.Guoyanb_send);

module.exports = Guoyanb_router;
