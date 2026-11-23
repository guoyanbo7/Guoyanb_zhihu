/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 文件：数据库连接测试页脚本（原生 fetch，结果输出到控制台与页面）
 */
(function () {
  const Guoyanb_form = document.getElementById('Guoyanb_db_form');
  const Guoyanb_result = document.getElementById('Guoyanb_result');
  const Guoyanb_api_url = 'http://localhost:8201/api/db/test';

  function Guoyanb_showResult(Guoyanb_ok, Guoyanb_msg, Guoyanb_detail) {
    Guoyanb_result.className = 'Guoyanb_result Guoyanb_show ' +
      (Guoyanb_ok ? 'Guoyanb_ok' : 'Guoyanb_err');
    let html = Guoyanb_msg;
    if (Guoyanb_detail) {
      html += '<pre>' + Guoyanb_detail + '</pre>';
    }
    Guoyanb_result.innerHTML = html;
  }

  Guoyanb_form.addEventListener('submit', async function (Guoyanb_e) {
    Guoyanb_e.preventDefault();

    const Guoyanb_payload = {
      user: document.getElementById('Guoyanb_user').value.trim(),
      password: document.getElementById('Guoyanb_password').value,
      host: document.getElementById('Guoyanb_host').value.trim() || 'localhost'
    };

    console.log('[请求] POST', Guoyanb_api_url, Guoyanb_payload);

    try {
      const Guoyanb_resp = await fetch(Guoyanb_api_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Guoyanb_payload)
      });
      const Guoyanb_json = await Guoyanb_resp.json();
      console.log('[响应]', Guoyanb_json);

      if (Guoyanb_json.code === 0) {
        const d = Guoyanb_json.data;
        Guoyanb_showResult(
          true,
          '✅ ' + Guoyanb_json.msg,
          JSON.stringify(d, null, 2)
        );
      } else {
        Guoyanb_showResult(false, '❌ ' + Guoyanb_json.msg);
        console.error('[业务失败]', Guoyanb_json.msg);
      }
    } catch (Guoyanb_err) {
      console.error('[网络/服务器错误]', Guoyanb_err);
      Guoyanb_showResult(false, '❌ 无法连接后端服务：' + Guoyanb_err.message);
    }
  });
})();
