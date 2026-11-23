/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 模型：数据库连接测试（MVC 之 Model）
 */
const { Guoyanb_testConnection } = require('../config/db');

/**
 * 测试数据库连接
 * @param {string} Guoyanb_user 用户名
 * @param {string} Guoyanb_password 密码
 * @param {string} Guoyanb_host 主机（可选）
 * @returns {Promise<Object>} 版本、用户、时间
 */
async function Guoyanb_checkConnection(Guoyanb_user, Guoyanb_password, Guoyanb_host) {
  return await Guoyanb_testConnection({
    user: Guoyanb_user,
    password: Guoyanb_password,
    host: Guoyanb_host
  });
}

module.exports = {
  Guoyanb_checkConnection
};
