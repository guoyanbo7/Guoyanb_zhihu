/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 模块：后端主入口（Express）
 * 职责：中间件配置、全跨域、/api 路由、静态托管 frontend、端口 8201
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const Guoyanb_app = express();
const Guoyanb_PORT = process.env.PORT || 8201;

// 支持所有跨域访问
Guoyanb_app.use(cors());

// 解析请求体
Guoyanb_app.use(express.json());
Guoyanb_app.use(express.urlencoded({ extended: true }));

// 所有接口统一以 /api/ 为前缀
Guoyanb_app.use('/api', require('./routes'));

// 以 express.static 托管 frontend/ 目录
Guoyanb_app.use(express.static(path.join(__dirname, '..', 'frontend')));

// API 404 兜底
Guoyanb_app.use('/api', (Guoyanb_req, Guoyanb_res) => {
  Guoyanb_res.status(404).json({ code: 404, msg: '接口不存在', data: {} });
});

// 全局错误处理中间件
Guoyanb_app.use((Guoyanb_err, Guoyanb_req, Guoyanb_res, Guoyanb_next) => {
  console.error('[服务器错误]', Guoyanb_err);
  Guoyanb_res.status(500).json({
    code: 500,
    msg: Guoyanb_err.message || '服务器内部错误',
    data: {}
  });
});

Guoyanb_app.listen(Guoyanb_PORT, () => {
  console.log('==================================================');
  console.log(`后端服务已启动: http://localhost:${Guoyanb_PORT}`);
  console.log(`前端首页:       http://localhost:${Guoyanb_PORT}/index.html`);
  console.log(`接口前缀:       http://localhost:${Guoyanb_PORT}/api`);
  console.log('==================================================');
});
