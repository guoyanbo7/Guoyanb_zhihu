/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 模块：数据库连接配置（mysql2/promise）
 * 职责：创建默认连接池；提供动态用户名/密码的连接测试能力
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

// 默认连接池：凭据全部来自 .env，代码中不硬编码
const Guoyanb_pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

/**
 * 动态测试数据库连接（供 database.html 输入任意用户名/密码）
 * @param {Object} Guoyanb_config { user, password, host?, port? }
 * @returns {Promise<Object>} 版本、当前用户、时间
 */
async function Guoyanb_testConnection(Guoyanb_config) {
  const Guoyanb_conn = await mysql.createConnection({
    host: Guoyanb_config.host || process.env.DB_HOST,
    user: Guoyanb_config.user,
    password: Guoyanb_config.password,
    port: Guoyanb_config.port || process.env.DB_PORT || 3306,
    connectTimeout: 5000
  });
  const [Guoyanb_rows] = await Guoyanb_conn.query(
    'SELECT VERSION() AS version, CURRENT_USER() AS user, NOW() AS time'
  );
  await Guoyanb_conn.end();
  return Guoyanb_rows[0];
}

module.exports = {
  Guoyanb_pool,
  Guoyanb_testConnection
};
