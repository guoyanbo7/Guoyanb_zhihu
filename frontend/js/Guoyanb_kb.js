/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 文件：知识库 RAG 页脚本（文件上传、知识库管理、基于知识库的问答，收发数据输出到控制台）
 */
(function () {
  // ===== 元素 =====
  const Guoyanb_dropZone = document.getElementById('Guoyanb_drop_zone');
  const Guoyanb_fileInput = document.getElementById('Guoyanb_file_input');
  const Guoyanb_uploadStatus = document.getElementById('Guoyanb_upload_status');
  const Guoyanb_fileList = document.getElementById('Guoyanb_file_list');
  const Guoyanb_fileCount = document.getElementById('Guoyanb_file_count');
  const Guoyanb_window = document.getElementById('Guoyanb_kb_window');
  const Guoyanb_input = document.getElementById('Guoyanb_kb_input');
  const Guoyanb_sendBtn = document.getElementById('Guoyanb_kb_send');

  // ===== 接口地址 =====
  const Guoyanb_API = 'http://localhost:8201/api/kb';

  // 分块展开状态与详情缓存
  const Guoyanb_expanded = {};
  const Guoyanb_detailCache = {};

  // 各类型文件图标
  const Guoyanb_ICON_MAP = {
    '.txt': '📄', '.pdf': '📕', '.doc': '📘', '.docx': '📘', '.ppt': '📙', '.pptx': '📙'
  };

  // HTML 转义，防 XSS
  function Guoyanb_escapeHtml(Guoyanb_str) {
    return String(Guoyanb_str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // 文件大小格式化
  function Guoyanb_formatSize(Guoyanb_bytes) {
    if (Guoyanb_bytes < 1024) return Guoyanb_bytes + ' B';
    if (Guoyanb_bytes < 1048576) return (Guoyanb_bytes / 1024).toFixed(1) + ' KB';
    return (Guoyanb_bytes / 1048576).toFixed(2) + ' MB';
  }

  // 时间格式化
  function Guoyanb_formatTime(Guoyanb_iso) {
    const Guoyanb_d = new Date(Guoyanb_iso);
    return Guoyanb_d.toLocaleString('zh-CN', { hour12: false });
  }

  function Guoyanb_scrollBottom() {
    Guoyanb_window.scrollTop = Guoyanb_window.scrollHeight;
  }

  // 上传状态提示
  function Guoyanb_setStatus(Guoyanb_type, Guoyanb_text) {
    Guoyanb_upload_status.hidden = false;
    Guoyanb_upload_status.className = 'Guoyanb_upload_status Guoyanb_status_' + Guoyanb_type;
    Guoyanb_upload_status.textContent = Guoyanb_text;
  }

  // ============================================================
  // 一、文件上传
  // ============================================================
  Guoyanb_dropZone.addEventListener('click', function () {
    Guoyanb_fileInput.click();
  });

  ['dragenter', 'dragover'].forEach(function (Guoyanb_evt) {
    Guoyanb_dropZone.addEventListener(Guoyanb_evt, function (Guoyanb_e) {
      Guoyanb_e.preventDefault();
      Guoyanb_dropZone.classList.add('Guoyanb_drag_over');
    });
  });
  ['dragleave', 'drop'].forEach(function (Guoyanb_evt) {
    Guoyanb_dropZone.addEventListener(Guoyanb_evt, function (Guoyanb_e) {
      Guoyanb_e.preventDefault();
      Guoyanb_dropZone.classList.remove('Guoyanb_drag_over');
    });
  });

  Guoyanb_dropZone.addEventListener('drop', function (Guoyanb_e) {
    const Guoyanb_files = Guoyanb_e.dataTransfer.files;
    if (Guoyanb_files && Guoyanb_files.length) Guoyanb_doUpload(Guoyanb_files[0]);
  });

  Guoyanb_fileInput.addEventListener('change', function () {
    if (Guoyanb_fileInput.files && Guoyanb_fileInput.files.length) {
      Guoyanb_doUpload(Guoyanb_fileInput.files[0]);
    }
  });

  async function Guoyanb_doUpload(Guoyanb_file) {
    const Guoyanb_formData = new FormData();
    Guoyanb_formData.append('Guoyanb_file', Guoyanb_file);

    Guoyanb_setStatus('loading', '正在上传并构建知识库：' + Guoyanb_file.name + ' …（解析、向量化需要几秒）');
    console.log('[上传] 发送给后端的文件 ->', Guoyanb_file);

    try {
      const Guoyanb_resp = await fetch(Guoyanb_API + '/upload', {
        method: 'POST',
        body: Guoyanb_formData
      });
      const Guoyanb_json = await Guoyanb_resp.json();
      console.log('[上传] 从后端接收到的数据 ->', Guoyanb_json);

      if (Guoyanb_json.code !== 0) {
        Guoyanb_setStatus('fail', '上传失败：' + Guoyanb_json.msg);
        return;
      }

      Guoyanb_setStatus('ok', '知识库构建成功：' + Guoyanb_json.data.originalName + '，共 ' + Guoyanb_json.data.chunkCount + ' 个分块');
      Guoyanb_fileInput.value = '';
      await Guoyanb_loadFiles();
    } catch (Guoyanb_err) {
      console.error('[上传] 网络错误 ->', Guoyanb_err);
      Guoyanb_setStatus('fail', '无法连接服务器：' + Guoyanb_err.message + '（请确认后端 8201 已启动）');
    }
  }

  // ============================================================
  // 二、知识库管理
  // ============================================================
  async function Guoyanb_loadFiles() {
    try {
      const Guoyanb_resp = await fetch(Guoyanb_API + '/files');
      const Guoyanb_json = await Guoyanb_resp.json();
      console.log('[知识库管理] 文件列表数据 ->', Guoyanb_json);

      if (Guoyanb_json.code !== 0) {
        console.error('[知识库管理] 列表获取失败', Guoyanb_json.msg);
        return;
      }
      Guoyanb_renderFiles(Guoyanb_json.data.list);
    } catch (Guoyanb_err) {
      console.error('[知识库管理] 加载失败 ->', Guoyanb_err);
    }
  }

  function Guoyanb_renderFiles(Guoyanb_files) {
    Guoyanb_fileCount.textContent = Guoyanb_files.length;
    Guoyanb_fileList.innerHTML = '';

    if (!Guoyanb_files.length) {
      const Guoyanb_empty = document.createElement('p');
      Guoyanb_empty.className = 'Guoyanb_empty_hint';
      Guoyanb_empty.textContent = '暂无知识库文件，请先在上方上传';
      Guoyanb_fileList.appendChild(Guoyanb_empty);
      return;
    }

    Guoyanb_files.forEach(function (Guoyanb_f) {
      // 文件项
      const Guoyanb_item = document.createElement('div');
      Guoyanb_item.className = 'Guoyanb_file_item';

      const Guoyanb_icon = document.createElement('div');
      Guoyanb_icon.className = 'Guoyanb_file_icon';
      Guoyanb_icon.textContent = Guoyanb_ICON_MAP[Guoyanb_f.ext] || '📄';

      const Guoyanb_meta = document.createElement('div');
      Guoyanb_meta.className = 'Guoyanb_file_meta';
      const Guoyanb_name = document.createElement('div');
      Guoyanb_name.className = 'Guoyanb_file_name';
      Guoyanb_name.textContent = Guoyanb_f.originalName;
      const Guoyanb_info = document.createElement('div');
      Guoyanb_info.className = 'Guoyanb_file_info';
      Guoyanb_info.textContent =
        Guoyanb_formatSize(Guoyanb_f.size) + ' · ' + Guoyanb_f.chunkCount + ' 个分块 · ' +
        Guoyanb_f.charCount + ' 字 · 上传于 ' + Guoyanb_formatTime(Guoyanb_f.uploadTime);
      Guoyanb_meta.appendChild(Guoyanb_name);
      Guoyanb_meta.appendChild(Guoyanb_info);

      const Guoyanb_actions = document.createElement('div');
      Guoyanb_actions.className = 'Guoyanb_file_actions';
      const Guoyanb_viewBtn = document.createElement('button');
      Guoyanb_viewBtn.className = 'Guoyanb_action_btn';
      Guoyanb_viewBtn.textContent = Guoyanb_expanded[Guoyanb_f.id] ? '收起分块' : '查看分块';
      Guoyanb_viewBtn.addEventListener('click', function () {
        Guoyanb_expanded[Guoyanb_f.id] = !Guoyanb_expanded[Guoyanb_f.id];
        if (Guoyanb_expanded[Guoyanb_f.id]) Guoyanb_loadDetail(Guoyanb_f.id);
        else Guoyanb_loadFiles();
      });

      const Guoyanb_delBtn = document.createElement('button');
      Guoyanb_delBtn.className = 'Guoyanb_action_btn Guoyanb_delete_btn';
      Guoyanb_delBtn.textContent = '删除';
      Guoyanb_delBtn.addEventListener('click', function () {
        Guoyanb_doDelete(Guoyanb_f.id, Guoyanb_f.originalName);
      });

      Guoyanb_actions.appendChild(Guoyanb_viewBtn);
      Guoyanb_actions.appendChild(Guoyanb_delBtn);

      Guoyanb_item.appendChild(Guoyanb_icon);
      Guoyanb_item.appendChild(Guoyanb_meta);
      Guoyanb_item.appendChild(Guoyanb_actions);
      Guoyanb_fileList.appendChild(Guoyanb_item);

      // 展开的分块面板
      if (Guoyanb_expanded[Guoyanb_f.id] && Guoyanb_detailCache[Guoyanb_f.id]) {
        Guoyanb_fileList.appendChild(Guoyanb_buildChunksPanel(Guoyanb_detailCache[Guoyanb_f.id]));
      }
    });
  }

  async function Guoyanb_loadDetail(Guoyanb_id) {
    if (Guoyanb_detailCache[Guoyanb_id]) {
      Guoyanb_loadFiles();
      return;
    }
    try {
      const Guoyanb_resp = await fetch(Guoyanb_API + '/files/' + Guoyanb_id);
      const Guoyanb_json = await Guoyanb_resp.json();
      console.log('[知识库管理] 分块详情数据 ->', Guoyanb_json);
      if (Guoyanb_json.code === 0) {
        Guoyanb_detailCache[Guoyanb_id] = Guoyanb_json.data;
      }
    } catch (Guoyanb_err) {
      console.error('[知识库管理] 详情加载失败 ->', Guoyanb_err);
    }
    Guoyanb_loadFiles();
  }

  function Guoyanb_buildChunksPanel(Guoyanb_data) {
    const Guoyanb_panel = document.createElement('div');
    Guoyanb_panel.className = 'Guoyanb_chunks';
    const Guoyanb_title = document.createElement('div');
    Guoyanb_title.className = 'Guoyanb_chunks_title';
    Guoyanb_title.textContent = '《' + Guoyanb_data.meta.originalName + '》的 ' + Guoyanb_data.chunks.length + ' 个分块';
    Guoyanb_panel.appendChild(Guoyanb_title);

    Guoyanb_data.chunks.forEach(function (Guoyanb_c) {
      const Guoyanb_item = document.createElement('div');
      Guoyanb_item.className = 'Guoyanb_chunk_item';
      Guoyanb_item.textContent = '#' + Guoyanb_c.index + '  ' + Guoyanb_c.text;
      Guoyanb_panel.appendChild(Guoyanb_item);
    });
    return Guoyanb_panel;
  }

  async function Guoyanb_doDelete(Guoyanb_id, Guoyanb_name) {
    if (!window.confirm('确定删除知识库文件「' + Guoyanb_name + '」吗？相关分块与向量将一并删除。')) return;

    try {
      const Guoyanb_resp = await fetch(Guoyanb_API + '/files/' + Guoyanb_id, { method: 'DELETE' });
      const Guoyanb_json = await Guoyanb_resp.json();
      console.log('[知识库管理] 删除返回数据 ->', Guoyanb_json);
      if (Guoyanb_json.code === 0) {
        delete Guoyanb_detailCache[Guoyanb_id];
        delete Guoyanb_expanded[Guoyanb_id];
        await Guoyanb_loadFiles();
      } else {
        window.alert('删除失败：' + Guoyanb_json.msg);
      }
    } catch (Guoyanb_err) {
      console.error('[知识库管理] 删除失败 ->', Guoyanb_err);
      window.alert('删除失败：' + Guoyanb_err.message);
    }
  }

  // ============================================================
  // 三、基于知识库的问答
  // ============================================================
  function Guoyanb_appendUser(Guoyanb_text) {
    const Guoyanb_msg = document.createElement('div');
    Guoyanb_msg.className = 'Guoyanb_msg Guoyanb_msg_user';
    Guoyanb_msg.innerHTML =
      '<div class="Guoyanb_msg_avatar">我</div><div class="Guoyanb_msg_bubble"></div>';
    Guoyanb_msg.querySelector('.Guoyanb_msg_bubble').textContent = Guoyanb_text;
    Guoyanb_window.appendChild(Guoyanb_msg);
    Guoyanb_scrollBottom();
  }

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

  function Guoyanb_appendAnswer(Guoyanb_data) {
    const Guoyanb_msg = document.createElement('div');
    Guoyanb_msg.className = 'Guoyanb_msg Guoyanb_msg_ai';

    const Guoyanb_avatar = document.createElement('div');
    Guoyanb_avatar.className = 'Guoyanb_msg_avatar';
    Guoyanb_avatar.textContent = 'AI';

    const Guoyanb_bubble = document.createElement('div');
    Guoyanb_bubble.className = 'Guoyanb_msg_bubble';
    const Guoyanb_answer = document.createElement('div');
    Guoyanb_answer.textContent = Guoyanb_data.answer;
    Guoyanb_bubble.appendChild(Guoyanb_answer);

    // 引用来源
    if (Guoyanb_data.refs && Guoyanb_data.refs.length) {
      const Guoyanb_refs = document.createElement('div');
      Guoyanb_refs.className = 'Guoyanb_refs';
      const Guoyanb_refsTitle = document.createElement('div');
      Guoyanb_refsTitle.className = 'Guoyanb_refs_title';
      Guoyanb_refsTitle.textContent = '引用来源（' + Guoyanb_data.refs.length + ' 条）';
      Guoyanb_refs.appendChild(Guoyanb_refsTitle);

      Guoyanb_data.refs.forEach(function (Guoyanb_r) {
        const Guoyanb_tag = document.createElement('span');
        Guoyanb_tag.className = 'Guoyanb_ref_tag';
        Guoyanb_tag.textContent = Guoyanb_r.fileName + ' #' + Guoyanb_r.chunkIndex + ' · 相关度 ' + Guoyanb_r.score;
        Guoyanb_refs.appendChild(Guoyanb_tag);
      });
      Guoyanb_bubble.appendChild(Guoyanb_refs);
    }

    Guoyanb_msg.appendChild(Guoyanb_avatar);
    Guoyanb_msg.appendChild(Guoyanb_bubble);
    Guoyanb_window.appendChild(Guoyanb_msg);
    Guoyanb_scrollBottom();
  }

  function Guoyanb_appendError(Guoyanb_text) {
    const Guoyanb_msg = document.createElement('div');
    Guoyanb_msg.className = 'Guoyanb_msg Guoyanb_msg_ai Guoyanb_msg_error';
    Guoyanb_msg.innerHTML =
      '<div class="Guoyanb_msg_avatar">!</div><div class="Guoyanb_msg_bubble"></div>';
    Guoyanb_msg.querySelector('.Guoyanb_msg_bubble').textContent = Guoyanb_text;
    Guoyanb_window.appendChild(Guoyanb_msg);
    Guoyanb_scrollBottom();
  }

  async function Guoyanb_ask() {
    const Guoyanb_question = Guoyanb_input.value.trim();
    if (!Guoyanb_question) return;

    Guoyanb_appendUser(Guoyanb_question);
    Guoyanb_input.value = '';
    Guoyanb_input.style.height = 'auto';
    Guoyanb_sendBtn.disabled = true;
    Guoyanb_showTyping();

    const Guoyanb_requestBody = { question: Guoyanb_question, topK: 4 };
    console.log('[发送给大模型的数据]', Guoyanb_requestBody);

    try {
      const Guoyanb_resp = await fetch(Guoyanb_API + '/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Guoyanb_requestBody)
      });
      const Guoyanb_json = await Guoyanb_resp.json();
      console.log('[从大模型接收到的数据]', Guoyanb_json);

      Guoyanb_removeTyping();
      if (Guoyanb_json.code !== 0) {
        console.error('[问答失败]', Guoyanb_json.msg);
        Guoyanb_appendError('出错了：' + Guoyanb_json.msg);
        return;
      }
      Guoyanb_appendAnswer(Guoyanb_json.data);
    } catch (Guoyanb_err) {
      Guoyanb_removeTyping();
      console.error('[网络/服务器错误]', Guoyanb_err);
      Guoyanb_appendError('无法连接服务器：' + Guoyanb_err.message + '（请确认后端 8201 已启动）');
    } finally {
      Guoyanb_sendBtn.disabled = false;
      Guoyanb_input.focus();
    }
  }

  Guoyanb_sendBtn.addEventListener('click', Guoyanb_ask);
  Guoyanb_input.addEventListener('keydown', function (Guoyanb_e) {
    if (Guoyanb_e.key === 'Enter' && !Guoyanb_e.shiftKey) {
      Guoyanb_e.preventDefault();
      Guoyanb_ask();
    }
  });
  Guoyanb_input.addEventListener('input', function () {
    Guoyanb_input.style.height = 'auto';
    Guoyanb_input.style.height = Math.min(Guoyanb_input.scrollHeight, 120) + 'px';
  });

  // 初始化：加载已有文件
  Guoyanb_loadFiles();
  Guoyanb_input.focus();
})();
