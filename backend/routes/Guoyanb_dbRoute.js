/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 路由：数据库连接测试（MVC 之 Route）
 */
const express = require('express');
const Guoyanb_router = express.Router();
const Guoyanb_dbController = require('../controllers/Guoyanb_dbController');

// 测试数据库连接
Guoyanb_router.post('/test', Guoyanb_dbController.Guoyanb_test);

module.exports = Guoyanb_router;
