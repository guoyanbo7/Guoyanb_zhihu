<!--
  姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
-->

# 知乎制作和模仿

- **学号**：24002060710
- **姓名**：郭彦伯
- **项目类别**：模仿
- **项目简介**：基于原生 HTML/CSS/JavaScript 与 Node.js + Express + MySQL 的全栈项目，实现数据库连接测试、科技新闻列表、图文列表等功能。

## 技术栈

| 层级 | 技术 |
|---|---|
| 前端 | 原生 HTML、CSS、JavaScript（无第三方库、框架、CDN） |
| 后端 | Node.js + Express，RESTful + MVC，端口 8201 |
| 数据库 | MySQL 8.0 |
| 跨域 | 后端允许所有跨域访问 |

## 目录结构

```
郭彦伯 全栈开发/
├── frontend/              # 前端
│   ├── css/               # 样式文件
│   ├── js/                # 脚本文件
│   ├── fonts/             # iconfont 图标字体（如有）
│   ├── images/            # 图片资源
│   └── index.html         # 项目首页
├── backend/               # 后端
│   ├── config/            # 数据库连接与统一响应
│   ├── controllers/       # 控制器（MVC）
│   ├── models/            # 模型（MVC）
│   ├── routes/            # 路由（MVC）
│   ├── .env               # 数据库凭据（不提交）
│   └── app.js             # 后端入口
├── AGENTS.md              # 项目开发规则
├── readme.md              # 项目说明
└── start.bat              # 一键启动后端
```

## 快速开始

1. 进入 `backend/`，安装依赖：`cnpm install`（失败则用 `npm install`）
2. 在根目录双击 `start.bat`，或在 `backend/` 执行 `npm start`
3. 浏览器访问：<http://localhost:8201/index.html>

## 页面清单

| 页面 | 说明 |
|---|---|
| index.html | 首页（canvas 动画 + 导航） |
| database.html | 数据库连接测试 |
| news.html | 科技新闻列表 |
| gallery.html | 图文列表 |
