/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 模块：统一 JSON 响应工具
 * 成功：{ code: 0, msg, data }；失败：code 非 0
 */
function Guoyanb_success(Guoyanb_res, Guoyanb_msg, Guoyanb_data) {
  return Guoyanb_res.json({
    code: 0,
    msg: Guoyanb_msg || '成功',
    data: Guoyanb_data === undefined ? {} : Guoyanb_data
  });
}

function Guoyanb_fail(Guoyanb_res, Guoyanb_msg, Guoyanb_code) {
  return Guoyanb_res.json({
    code: Guoyanb_code || 1,
    msg: Guoyanb_msg || '失败',
    data: {}
  });
}

module.exports = {
  Guoyanb_success,
  Guoyanb_fail
};
