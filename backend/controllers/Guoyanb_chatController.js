/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 控制器：AI 聊天（MVC 之 Controller，硅基流动）
 */
const Guoyanb_chatModel = require('../models/Guoyanb_chatModel');
const { Guoyanb_success, Guoyanb_fail } = require('../config/response');

// 发送消息并获取大模型回复
async function Guoyanb_send(Guoyanb_req, Guoyanb_res) {
  const Guoyanb_messages = Guoyanb_req.body.messages;

  // 参数校验：messages 必须是非空数组
  if (!Array.isArray(Guoyanb_messages) || Guoyanb_messages.length === 0) {
    return Guoyanb_fail(Guoyanb_res, '参数 messages 必须为非空数组', 3001);
  }

  try {
    const Guoyanb_result = await Guoyanb_chatModel.Guoyanb_chat(Guoyanb_messages);
    const Guoyanb_choice = Guoyanb_result.choices && Guoyanb_result.choices[0];

    console.log('[AI 聊天] 本轮回复成功，模型:', Guoyanb_result.model);

    return Guoyanb_success(Guoyanb_res, 'AI 回复成功', {
      model: Guoyanb_result.model,
      message: Guoyanb_choice ? Guoyanb_choice.message : null,
      content: Guoyanb_choice ? Guoyanb_choice.message.content : '',
      usage: Guoyanb_result.usage || {},
      raw: Guoyanb_result
    });
  } catch (Guoyanb_err) {
    console.error('[AI 聊天] 调用失败 ->', Guoyanb_err.message);
    return Guoyanb_fail(Guoyanb_res, 'AI 回复失败：' + Guoyanb_err.message, 3002);
  }
}

module.exports = {
  Guoyanb_send
};
