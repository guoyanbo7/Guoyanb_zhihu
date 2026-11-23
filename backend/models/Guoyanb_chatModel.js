/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 模型：AI 聊天（MVC 之 Model，封装硅基流动 SiliconFlow 接口调用）
 * 说明：使用 Node 内置全局 fetch，不引入第三方依赖；密钥仅从环境变量读取
 */

// 硅基流动配置（全部来自 backend/.env）
const Guoyanb_apiKey = process.env.SILICONFLOW_API_KEY;
const Guoyanb_baseUrl = process.env.SILICONFLOW_BASE_URL;
const Guoyanb_model = process.env.SILICONFLOW_MODEL;

/**
 * 调用硅基流动 chat/completions
 * @param {Array} Guoyanb_messages 消息数组 [{role, content}, ...]
 * @returns {Promise<Object>} 大模型完整响应（OpenAI 兼容格式）
 */
async function Guoyanb_chat(Guoyanb_messages) {
  const Guoyanb_requestUrl = Guoyanb_baseUrl + '/chat/completions';

  // 发送给大模型的请求体
  const Guoyanb_payload = {
    model: Guoyanb_model,
    messages: Guoyanb_messages
  };

  console.log('[硅基流动] 发送给大模型的数据 ->', JSON.stringify(Guoyanb_payload, null, 2));

  const Guoyanb_resp = await fetch(Guoyanb_requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + Guoyanb_apiKey
    },
    body: JSON.stringify(Guoyanb_payload)
  });

  // 读取响应文本，便于在错误时输出原始信息
  const Guoyanb_text = await Guoyanb_resp.text();
  let Guoyanb_data;
  try {
    Guoyanb_data = JSON.parse(Guoyanb_text);
  } catch (Guoyanb_parseErr) {
    throw new Error('大模型返回了无法解析的内容：' + Guoyanb_text);
  }

  if (!Guoyanb_resp.ok) {
    const Guoyanb_errMsg = (Guoyanb_data && Guoyanb_data.error && Guoyanb_data.error.message)
      ? Guoyanb_data.error.message
      : Guoyanb_text;
    throw new Error('硅基流动接口错误（' + Guoyanb_resp.status + '）：' + Guoyanb_errMsg);
  }

  console.log('[硅基流动] 从大模型接收到的数据 ->', JSON.stringify(Guoyanb_data, null, 2));
  return Guoyanb_data;
}

module.exports = {
  Guoyanb_chat
};
