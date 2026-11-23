/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 控制器：数据库连接测试（MVC 之 Controller）
 */
const Guoyanb_dbModel = require('../models/Guoyanb_dbModel');
const { Guoyanb_success, Guoyanb_fail } = require('../config/response');

// 测试连接
async function Guoyanb_test(Guoyanb_req, Guoyanb_res) {
  const { user, password, host } = Guoyanb_req.body || {};

  if (!user || password === undefined) {
    console.error('[连接测试] 参数缺失：需要用户名和密码');
    return Guoyanb_fail(Guoyanb_res, '请输入用户名和密码', 400);
  }

  try {
    const Guoyanb_info = await Guoyanb_dbModel.Guoyanb_checkConnection(user, password, host);
    console.log('[连接测试] 成功 ->', Guoyanb_info);
    return Guoyanb_success(Guoyanb_res, '数据库连接成功', Guoyanb_info);
  } catch (Guoyanb_err) {
    console.error('[连接测试] 失败 ->', Guoyanb_err.message);
    return Guoyanb_fail(Guoyanb_res, '数据库连接失败：' + Guoyanb_err.message, 1001);
  }
}

module.exports = {
  Guoyanb_test
};
