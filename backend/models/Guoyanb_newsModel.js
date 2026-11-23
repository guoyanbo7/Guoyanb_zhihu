/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 模型：科技新闻（MVC 之 Model）
 */
const { Guoyanb_pool } = require('../config/db');

// 获取全部新闻（按发布时间倒序）
async function Guoyanb_findAll() {
  const [Guoyanb_rows] = await Guoyanb_pool.query(
    'SELECT * FROM Guoyanb_news ORDER BY Guoyanb_publish_time DESC, Guoyanb_id DESC'
  );
  return Guoyanb_rows;
}

// 根据主键获取单条新闻
async function Guoyanb_findById(Guoyanb_id) {
  const [Guoyanb_rows] = await Guoyanb_pool.query(
    'SELECT * FROM Guoyanb_news WHERE Guoyanb_id = ?',
    [Guoyanb_id]
  );
  return Guoyanb_rows[0] || null;
}

module.exports = {
  Guoyanb_findAll,
  Guoyanb_findById
};
