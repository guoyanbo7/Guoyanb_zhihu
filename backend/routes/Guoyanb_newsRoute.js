/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 路由：科技新闻（MVC 之 Route）
 */
const express = require('express');
const Guoyanb_router = express.Router();
const Guoyanb_newsController = require('../controllers/Guoyanb_newsController');

// 新闻列表
Guoyanb_router.get('/', Guoyanb_newsController.Guoyanb_list);

// 单条新闻详情
Guoyanb_router.get('/:id', Guoyanb_newsController.Guoyanb_detail);

module.exports = Guoyanb_router;
