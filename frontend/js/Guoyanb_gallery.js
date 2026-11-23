/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 文件：图文列表页脚本（fetch 获取数据并渲染图片网格，输出到控制台）
 */
(function () {
  const Guoyanb_box = document.getElementById('Guoyanb_gallery_box');
  const Guoyanb_api_url = 'http://localhost:8201/api/gallery';

  // 图片加载失败时的占位图（内联 SVG，无需外部资源）
  const Guoyanb_placeholder =
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300">' +
      '<rect width="100%" height="100%" fill="#1a2540"/>' +
      '<text x="50%" y="50%" fill="#7f93b8" font-size="20" text-anchor="middle" ' +
      'font-family="sans-serif" dominant-baseline="middle">图片暂不可用</text></svg>'
    );

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
      let html = '<div class="Guoyanb_gallery_grid">';
      Guoyanb_list.forEach(function (item) {
        html += '<article class="Guoyanb_gallery_item">' +
          '<div class="Guoyanb_item_imgwrap">' +
            '<span class="Guoyanb_item_category">' + Guoyanb_escapeHtml(item.Guoyanb_category) + '</span>' +
            '<img src="' + Guoyanb_escapeHtml(item.Guoyanb_image_url) +
              '" alt="' + Guoyanb_escapeHtml(item.Guoyanb_title) + '" ' +
              'onerror="this.onerror=null;this.src=\'' + Guoyanb_placeholder + '\'"/>' +
          '</div>' +
          '<div class="Guoyanb_item_body">' +
            '<h3>' + Guoyanb_escapeHtml(item.Guoyanb_title) + '</h3>' +
            '<p>' + Guoyanb_escapeHtml(item.Guoyanb_description) + '</p>' +
            '<div class="Guoyanb_item_footer">' +
              '<span>✍ ' + Guoyanb_escapeHtml(item.Guoyanb_author) + '</span>' +
              '<span class="Guoyanb_like">❤ ' +
                Number(item.Guoyanb_like_count).toLocaleString() + '</span>' +
            '</div>' +
          '</div>' +
        '</article>';
      });
      html += '</div>';
      Guoyanb_box.innerHTML = html;
      console.log('[渲染完成] 共 ' + Guoyanb_list.length + ' 条图文');
    } catch (Guoyanb_err) {
      console.error('[网络/服务器错误]', Guoyanb_err);
      Guoyanb_box.innerHTML = '<div class="Guoyanb_status Guoyanb_error">❌ 无法获取数据：' +
        Guoyanb_escapeHtml(Guoyanb_err.message) + '</div>';
    }
  }

  Guoyanb_load();
})();
