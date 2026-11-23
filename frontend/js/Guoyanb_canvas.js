/*
 * 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
 * 文件：全屏 canvas 粒子网络背景动画（原生 JavaScript，无第三方库）
 * 特性：粒子漂浮、邻近连线、鼠标交互连线，自适应窗口与设备像素比
 */
(function () {
  const Guoyanb_canvas = document.getElementById('Guoyanb_bg_canvas');
  if (!Guoyanb_canvas) return;
  const Guoyanb_ctx = Guoyanb_canvas.getContext('2d');

  let Guoyanb_width = 0;
  let Guoyanb_height = 0;
  let Guoyanb_particles = [];
  const Guoyanb_mouse = { x: null, y: null, radius: 150 };
  const Guoyanb_link_distance = 130;

  // 根据屏幕面积决定粒子数量
  function Guoyanb_getCount() {
    const Guoyanb_area = Guoyanb_width * Guoyanb_height;
    return Math.min(110, Math.floor(Guoyanb_area / 14000));
  }

  function Guoyanb_resize() {
    const Guoyanb_dpr = window.devicePixelRatio || 1;
    Guoyanb_width = window.innerWidth;
    Guoyanb_height = window.innerHeight;
    Guoyanb_canvas.width = Guoyanb_width * Guoyanb_dpr;
    Guoyanb_canvas.height = Guoyanb_height * Guoyanb_dpr;
    Guoyanb_canvas.style.width = Guoyanb_width + 'px';
    Guoyanb_canvas.style.height = Guoyanb_height + 'px';
    Guoyanb_ctx.setTransform(Guoyanb_dpr, 0, 0, Guoyanb_dpr, 0, 0);
    Guoyanb_initParticles();
  }

  function Guoyanb_initParticles() {
    const Guoyanb_count = Guoyanb_getCount();
    Guoyanb_particles = [];
    for (let i = 0; i < Guoyanb_count; i++) {
      Guoyanb_particles.push({
        x: Math.random() * Guoyanb_width,
        y: Math.random() * Guoyanb_height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        r: Math.random() * 1.8 + 0.8
      });
    }
  }

  function Guoyanb_draw() {
    Guoyanb_ctx.clearRect(0, 0, Guoyanb_width, Guoyanb_height);

    // 更新并绘制粒子
    for (let i = 0; i < Guoyanb_particles.length; i++) {
      const p = Guoyanb_particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > Guoyanb_width) p.vx = -p.vx;
      if (p.y < 0 || p.y > Guoyanb_height) p.vy = -p.vy;

      Guoyanb_ctx.beginPath();
      Guoyanb_ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      Guoyanb_ctx.fillStyle = 'rgba(78, 151, 255, 0.85)';
      Guoyanb_ctx.fill();

      // 粒子之间连线
      for (let j = i + 1; j < Guoyanb_particles.length; j++) {
        const q = Guoyanb_particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < Guoyanb_link_distance) {
          Guoyanb_ctx.beginPath();
          Guoyanb_ctx.moveTo(p.x, p.y);
          Guoyanb_ctx.lineTo(q.x, q.y);
          Guoyanb_ctx.strokeStyle = 'rgba(54, 214, 255, ' + (1 - dist / Guoyanb_link_distance) * 0.35 + ')';
          Guoyanb_ctx.lineWidth = 1;
          Guoyanb_ctx.stroke();
        }
      }

      // 鼠标连线
      if (Guoyanb_mouse.x !== null) {
        const mdx = p.x - Guoyanb_mouse.x;
        const mdy = p.y - Guoyanb_mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < Guoyanb_mouse.radius) {
          Guoyanb_ctx.beginPath();
          Guoyanb_ctx.moveTo(p.x, p.y);
          Guoyanb_ctx.lineTo(Guoyanb_mouse.x, Guoyanb_mouse.y);
          Guoyanb_ctx.strokeStyle = 'rgba(78, 151, 255, ' + (1 - mdist / Guoyanb_mouse.radius) * 0.55 + ')';
          Guoyanb_ctx.lineWidth = 1;
          Guoyanb_ctx.stroke();
        }
      }
    }

    requestAnimationFrame(Guoyanb_draw);
  }

  window.addEventListener('mousemove', function (Guoyanb_e) {
    Guoyanb_mouse.x = Guoyanb_e.clientX;
    Guoyanb_mouse.y = Guoyanb_e.clientY;
  });

  window.addEventListener('mouseout', function () {
    Guoyanb_mouse.x = null;
    Guoyanb_mouse.y = null;
  });

  window.addEventListener('resize', Guoyanb_resize);

  Guoyanb_resize();
  Guoyanb_draw();
})();
