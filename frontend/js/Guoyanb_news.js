/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 文件：科技新闻列表页脚本（fetch 获取数据并渲染，输出到控制台）
 */
(function () {
  const Guoyanb_box = document.getElementById('Guoyanb_news_box');
  const Guoyanb_api_url = 'http://localhost:8201/api/news';

  // 时间格式化为 yyyy-mm-dd hh:mm
  function Guoyanb_formatTime(Guoyanb_value) {
    if (!Guoyanb_value) return '';
    const d = new Date(Guoyanb_value);
    if (isNaN(d.getTime())) return Guoyanb_value;
    const pad = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
      ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function Guoyanb_escapeHtml(Guoyanb_str) {
    return String(Guoyanb_str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  async function Guoyanb_load() {
    console.log('[请求] GET', Guoyanb_api_url);
    try {
      const Guoyanb_resp = await fetch(Guoyanb_api_url);
      const Guoyanb_json = await Guoyanb_resp.json();
      console.log('[响应]', Guoyanb_json);

      if (Guoyanb_json.code !== 0) {
        console.error('[业务失败]', Guoyanb_json.msg);
        Guoyanb_box.innerHTML = '<div class="Guoyanb_status Guoyanb_error">❌ ' +
          Guoyanb_escapeHtml(Guoyanb_json.msg) + '</div>';
        return;
      }

      const Guoyanb_list = Guoyanb_json.data.list;
      let html = '<div class="Guoyanb_card_list">';
      Guoyanb_list.forEach(function (item) {
        html += '<article class="Guoyanb_data_card">' +
          '<h3>' + Guoyanb_escapeHtml(item.Guoyanb_title) + '</h3>' +
          '<div class="Guoyanb_card_meta">' +
            '<span class="Guoyanb_tag">来源：' + Guoyanb_escapeHtml(item.Guoyanb_source) + '</span>' +
            '<span>🕒 ' + Guoyanb_formatTime(item.Guoyanb_publish_time) + '</span>' +
          '</div>' +
          '<p>' + Guoyanb_escapeHtml(item.Guoyanb_summary) + '</p>' +
          '<div class="Guoyanb_card_footer">' +
            '<span class="Guoyanb_views">👁 浏览 ' + Number(item.Guoyanb_view_count).toLocaleString() + '</span>' +
            '<a class="Guoyanb_origin_link" href="' + Guoyanb_escapeHtml(item.Guoyanb_url) +
              '" target="_blank" rel="noopener">阅读原文 →</a>' +
          '</div>' +
        '</article>';
      });
      html += '</div>';
      Guoyanb_box.innerHTML = html;
      console.log('[渲染完成] 共 ' + Guoyanb_list.length + ' 条新闻');
    } catch (Guoyanb_err) {
      console.error('[网络/服务器错误]', Guoyanb_err);
      Guoyanb_box.innerHTML = '<div class="Guoyanb_status Guoyanb_error">❌ 无法获取数据：' +
        Guoyanb_escapeHtml(Guoyanb_err.message) + '</div>';
    }
  }

  Guoyanb_load();
})();
