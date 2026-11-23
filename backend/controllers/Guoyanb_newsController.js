/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 控制器：科技新闻（MVC 之 Controller）
 */
const Guoyanb_newsModel = require('../models/Guoyanb_newsModel');
const { Guoyanb_success, Guoyanb_fail } = require('../config/response');

// 新闻列表
async function Guoyanb_list(Guoyanb_req, Guoyanb_res) {
  try {
    const Guoyanb_rows = await Guoyanb_newsModel.Guoyanb_findAll();
    console.log('[新闻列表] 查询成功，条数:', Guoyanb_rows.length);
    return Guoyanb_success(Guoyanb_res, '新闻列表获取成功', {
      total: Guoyanb_rows.length,
      list: Guoyanb_rows
    });
  } catch (Guoyanb_err) {
    console.error('[新闻列表] 查询失败 ->', Guoyanb_err.message);
    return Guoyanb_fail(Guoyanb_res, '新闻列表获取失败：' + Guoyanb_err.message, 2001);
  }
}

// 单条新闻详情
async function Guoyanb_detail(Guoyanb_req, Guoyanb_res) {
  const Guoyanb_id = Guoyanb_req.params.id;
  try {
    const Guoyanb_row = await Guoyanb_newsModel.Guoyanb_findById(Guoyanb_id);
    if (!Guoyanb_row) {
      return Guoyanb_fail(Guoyanb_res, '新闻不存在', 2002);
    }
    console.log('[新闻详情] id=', Guoyanb_id);
    return Guoyanb_success(Guoyanb_res, '新闻详情获取成功', Guoyanb_row);
  } catch (Guoyanb_err) {
    console.error('[新闻详情] 查询失败 ->', Guoyanb_err.message);
    return Guoyanb_fail(Guoyanb_res, '新闻详情获取失败：' + Guoyanb_err.message, 2001);
  }
}

module.exports = {
  Guoyanb_list,
  Guoyanb_detail
};
