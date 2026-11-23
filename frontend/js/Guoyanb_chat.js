/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 文件：AI 聊天页脚本（多轮对话，fetch 调用后端 /api/chat，收发数据输出到控制台）
 */
(function () {
  const Guoyanb_window = document.getElementById('Guoyanb_chat_window');
  const Guoyanb_input = document.getElementById('Guoyanb_chat_input');
  const Guoyanb_sendBtn = document.getElementById('Guoyanb_send_btn');
  const Guoyanb_api_url = 'http://localhost:8201/api/chat';

  // 对话历史（含系统角色设定），每次请求整体发送以支持多轮上下文
  const Guoyanb_messages = [
    { role: 'system', content: '你是一个有用、友好的中文助手，请简洁清晰地回答问题。' }
  ];

  // HTML 转义，防止用户输入或模型输出中的标签被当作 HTML 解析
  function Guoyanb_escapeHtml(Guoyanb_str) {
    return String(Guoyanb_str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // 滚动到消息窗口底部
  function Guoyanb_scrollBottom() {
    Guoyanb_window.scrollTop = Guoyanb_window.scrollHeight;
  }

  /**
   * 向窗口追加一条消息
   * @param {string} Guoyanb_role user / ai / error
   * @param {string} Guoyanb_text 文本内容
   * @returns {HTMLElement} 气泡元素
   */
  function Guoyanb_appendMessage(Guoyanb_role, Guoyanb_text) {
    const Guoyanb_msg = document.createElement('div');
    if (Guoyanb_role === 'user') {
      Guoyanb_msg.className = 'Guoyanb_msg Guoyanb_msg_user';
    } else if (Guoyanb_role === 'error') {
      Guoyanb_msg.className = 'Guoyanb_msg Guoyanb_msg_ai Guoyanb_msg_error';
    } else {
      Guoyanb_msg.className = 'Guoyanb_msg Guoyanb_msg_ai';
    }

    const Guoyanb_avatar = document.createElement('div');
    Guoyanb_avatar.className = 'Guoyanb_msg_avatar';
    Guoyanb_avatar.textContent = Guoyanb_role === 'user' ? '我' : (Guoyanb_role === 'error' ? '!' : 'AI');

    const Guoyanb_bubble = document.createElement('div');
    Guoyanb_bubble.className = 'Guoyanb_msg_bubble';
    Guoyanb_bubble.textContent = Guoyanb_text;

    Guoyanb_msg.appendChild(Guoyanb_avatar);
    Guoyanb_msg.appendChild(Guoyanb_bubble);
    Guoyanb_window.appendChild(Guoyanb_msg);
    Guoyanb_scrollBottom();
    return Guoyanb_bubble;
  }

  // 显示“AI 正在输入”的加载动画，返回该元素以便移除
  function Guoyanb_showTyping() {
    const Guoyanb_msg = document.createElement('div');
    Guoyanb_msg.className = 'Guoyanb_msg Guoyanb_msg_ai';
    Guoyanb_msg.id = 'Guoyanb_typing_row';
    Guoyanb_msg.innerHTML =
      '<div class="Guoyanb_msg_avatar">AI</div>' +
      '<div class="Guoyanb_msg_bubble"><div class="Guoyanb_typing"><span></span><span></span><span></span></div></div>';
    Guoyanb_window.appendChild(Guoyanb_msg);
    Guoyanb_scrollBottom();
  }

  function Guoyanb_removeTyping() {
    const Guoyanb_row = document.getElementById('Guoyanb_typing_row');
    if (Guoyanb_row) Guoyanb_row.remove();
  }

  // 发送消息主流程
  async function Guoyanb_send() {
    const Guoyanb_text = Guoyanb_input.value.trim();
    if (!Guoyanb_text) return;

    // 渲染用户消息并写入历史
    Guoyanb_appendMessage('user', Guoyanb_text);
    Guoyanb_messages.push({ role: 'user', content: Guoyanb_text });
    Guoyanb_input.value = '';
    Guoyanb_input.style.height = 'auto';

    // 禁用按钮，显示加载
    Guoyanb_sendBtn.disabled = true;
    Guoyanb_showTyping();

    // 发送给后端（即转发给大模型）的数据
    const Guoyanb_requestBody = { messages: Guoyanb_messages };
    console.log('[发送给大模型的数据]', Guoyanb_requestBody);

    try {
      const Guoyanb_resp = await fetch(Guoyanb_api_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Guoyanb_requestBody)
      });
      const Guoyanb_json = await Guoyanb_resp.json();
      console.log('[从大模型接收到的数据]', Guoyanb_json);

      Guoyanb_removeTyping();

      if (Guoyanb_json.code !== 0) {
        console.error('[业务失败]', Guoyanb_json.msg);
        Guoyanb_appendMessage('error', '出错了：' + Guoyanb_json.msg);
        return;
      }

      const Guoyanb_reply = Guoyanb_json.data.content || '';
      Guoyanb_appendMessage('ai', Guoyanb_reply);
      // 把 AI 回复写入历史，保持多轮上下文
      Guoyanb_messages.push({ role: 'assistant', content: Guoyanb_reply });
      console.log('[本轮对话完成] 当前历史条数:', Guoyanb_messages.length);
    } catch (Guoyanb_err) {
      Guoyanb_removeTyping();
      console.error('[网络/服务器错误]', Guoyanb_err);
      Guoyanb_appendMessage('error', '无法连接服务器：' + Guoyanb_err.message + '（请确认后端 8201 已启动）');
    } finally {
      Guoyanb_sendBtn.disabled = false;
      Guoyanb_input.focus();
    }
  }

  // 点击发送按钮
  Guoyanb_sendBtn.addEventListener('click', Guoyanb_send);

  // 键盘：Enter 发送，Shift+Enter 换行
  Guoyanb_input.addEventListener('keydown', function (Guoyanb_e) {
    if (Guoyanb_e.key === 'Enter' && !Guoyanb_e.shiftKey) {
      Guoyanb_e.preventDefault();
      Guoyanb_send();
    }
  });

  // textarea 随内容自动增高
  Guoyanb_input.addEventListener('input', function () {
    Guoyanb_input.style.height = 'auto';
    Guoyanb_input.style.height = Math.min(Guoyanb_input.scrollHeight, 120) + 'px';
  });

  Guoyanb_input.focus();
})();
