/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 路由：图文（MVC 之 Route）
 */
const express = require('express');
const Guoyanb_router = express.Router();
const Guoyanb_galleryController = require('../controllers/Guoyanb_galleryController');

// 图文列表
Guoyanb_router.get('/', Guoyanb_galleryController.Guoyanb_list);

// 单条图文详情
Guoyanb_router.get('/:id', Guoyanb_galleryController.Guoyanb_detail);

module.exports = Guoyanb_router;
