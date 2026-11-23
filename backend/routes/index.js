/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 模块：路由聚合入口（所有业务子路由统一在此挂载，全部位于 /api 前缀下）
 */
const express = require('express');
const Guoyanb_router = express.Router();

// 健康检查接口
Guoyanb_router.get('/health', (Guoyanb_req, Guoyanb_res) => {
  Guoyanb_res.json({
    code: 0,
    msg: '服务运行中',
    data: { time: new Date().toISOString() }
  });
});

// 数据库连接测试路由：/api/db/...
Guoyanb_router.use('/db', require('./Guoyanb_dbRoute'));

// 科技新闻路由：/api/news/...
Guoyanb_router.use('/news', require('./Guoyanb_newsRoute'));

// 图文路由：/api/gallery/...
Guoyanb_router.use('/gallery', require('./Guoyanb_galleryRoute'));

module.exports = Guoyanb_router;
