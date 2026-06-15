/* ==========================================
   Zensical-CatDrink-Blog 自定义脚本
   ========================================== */

// 即时导航兼容
document$.subscribe(function() {
  console.log('Zensical-CatDrink-Blog loaded');
  
  if (!sessionStorage.getItem('refreshed')) {
  sessionStorage.setItem('refreshed', 'true');
  location.reload(true);
}
});

// 搞笑标题功能
var OriginTitle = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        document.title = '╭(°A°`)╮ 页面崩溃啦 ~';
        clearTimeout(titleTime);
    }
    else {
        document.title = '(ฅ>ω<*ฅ) 噫又好啦 ~' + OriginTitle;
        titleTime = setTimeout(function () {
            document.title = OriginTitle;
        }, 2000);
    }
});

// 鼠标点击效果 - 本地实现
document.addEventListener('click', function(e) {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  const heart = document.createElement('div');
  heart.innerHTML = '💖';
  heart.style.cssText = `
    position: fixed;
    left: ${e.clientX}px;
    top: ${e.clientY}px;
    pointer-events: none;
    z-index: 9999;
    font-size: 20px;
    color: ${randomColor};
    animation: heart-float 1s ease-out forwards;
  `;
  
  document.body.appendChild(heart);
  
  setTimeout(() => {
    heart.remove();
  }, 1000);
});

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
  @keyframes heart-float {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -150%) scale(0);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// 独立鼠标波纹效果实现
// 独立鼠标光尾效果实现
(function() {
  // 创建画布
  const canvas = document.createElement('canvas');
  canvas.id = 'mouse-trail-canvas';
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9998;
  `;
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  
  // 存储轨迹点的数组
  let trailPoints = [];
  
  // 设置画布大小
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // 添加轨迹点
  function addPoint(x, y) {
    // 可以限制点数，避免过多（比如最多保留100个点）
    if (trailPoints.length > 100) {
      trailPoints.shift(); // 移除最早的点
    }
    trailPoints.push({ x, y, life: 1.0 }); // life 初始为1，逐渐减小
  }
  
  // 更新轨迹点（降低生命值）
  function updateTrail() {
    for (let i = trailPoints.length - 1; i >= 0; i--) {
      trailPoints[i].life -= 0.02; // 衰减速度，可调整
      if (trailPoints[i].life <= 0) {
        trailPoints.splice(i, 1);
      }
    }
  }
  
  // 绘制光尾
  function drawTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 从旧到新绘制，使光点重叠自然
    for (let i = 0; i < trailPoints.length; i++) {
      const p = trailPoints[i];
      // 根据生命值设置透明度和大小
      const opacity = p.life;
      const radius = 8 * p.life; // 光点大小随生命值减小，可调整乘数
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      
      // 光点颜色（这里使用亮蓝色，可自定义）
      ctx.fillStyle = `rgba(102, 126, 234, ${opacity})`;
      
      // 绘制光晕效果（用径向渐变增加柔和感）
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
      gradient.addColorStop(0, `rgba(102, 126, 234, ${opacity})`);
      gradient.addColorStop(0.5, `rgba(102, 126, 234, ${opacity * 0.5})`);
      gradient.addColorStop(1, `rgba(102, 126, 234, 0)`);
      ctx.fillStyle = gradient;
      
      ctx.fill();
    }
  }
  
  // 动画循环
  function animate() {
    updateTrail();
    drawTrail();
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // 鼠标移动事件
  let lastX = 0, lastY = 0;
  document.addEventListener('mousemove', e => {
    const x = e.clientX;
    const y = e.clientY;
    
    // 可选：限制添加频率，避免点过于密集
    // 如果距离上一个点太近，则不添加（平滑轨迹）
    const distance = Math.hypot(x - lastX, y - lastY);
    if (distance > 5) { // 可调整阈值
      addPoint(x, y);
      lastX = x;
      lastY = y;
    } else {
      // 即使不移动，也可以偶尔添加点，但这里不添加
    }
  });
})();

/* ==========================================
   可滑动卡片列表 — 拖拽滚动
   基于 pointer 事件，通过移动距离 + 按压时长判定点击/拖拽
   ========================================== */
document$.subscribe(function() {
  document.querySelectorAll('.web-scroll').forEach(function(container) {
    // 防止 MkDocs 即时导航时重复绑定
    if (container.dataset.scrollInit) return;
    container.dataset.scrollInit = 'true';

    var isDown = false;
    var startX = 0;
    var scrollStart = 0;
    var startTime = 0;
    var tapTarget = null;

    var MOVE_THRESHOLD = 10;  // 移动超过 10px 判定为拖拽
    var TIME_THRESHOLD = 300; // 按压超过 300ms 判定为长按（不触发点击）

    container.addEventListener('pointerdown', function(e) {
      if (e.button !== 0) return; // 只响应左键
      isDown = true;
      startX = e.pageX;
      scrollStart = container.scrollLeft;
      startTime = Date.now();

      // 找到按下位置的 .web-card 中的可点击元素
      var card = e.target.closest('.web-card');
      tapTarget = card ? (card.querySelector('a') || card.querySelector('button') || card) : null;

      container.style.cursor = 'grabbing';
      container.style.scrollBehavior = 'auto'; // 拖拽时关闭平滑滚动
      container.setPointerCapture(e.pointerId);
    });

    container.addEventListener('pointermove', function(e) {
      if (!isDown) return;
      container.scrollLeft = scrollStart - (e.pageX - startX);
    });

    container.addEventListener('pointerup', function(e) {
      if (!isDown) return;
      var dx = Math.abs(e.pageX - startX);
      var dt = Date.now() - startTime;

      // 短按 + 无明显移动 → 视为点击
      if (dx < MOVE_THRESHOLD && dt < TIME_THRESHOLD && tapTarget) {
        e.preventDefault();
        showCardModal(tapTarget);
      }

      isDown = false;
      tapTarget = null;
      container.style.cursor = '';
      container.style.scrollBehavior = 'smooth';
    });

    container.addEventListener('pointerleave', function() {
      if (!isDown) return;
      isDown = false;
      tapTarget = null;
      container.style.cursor = '';
      container.style.scrollBehavior = 'smooth';
    });

    container.addEventListener('pointercancel', function() {
      if (!isDown) return;
      isDown = false;
      tapTarget = null;
      container.style.cursor = '';
      container.style.scrollBehavior = 'smooth';
    });
  });
});

/* ==========================================
   卡片点击弹窗 — 旋转放大展示详情
   ========================================== */
function showCardModal(card) {
  // 提取卡片数据
  var icon = card.querySelector('.web-card-icon');
  var title = card.querySelector('.web-card-title');
  var tag = card.querySelector('.web-card-tag');
  var iconText = icon ? icon.textContent.trim() : '';
  var titleText = title ? title.textContent.trim() : '';
  var tagText = tag ? tag.textContent.trim() : '';
  var linkUrl = card.href || '';

  // 如果已有弹窗则移除
  var existing = document.querySelector('.web-card-modal-overlay');
  if (existing) existing.remove();

  // 创建遮罩层
  var overlay = document.createElement('div');
  overlay.className = 'web-card-modal-overlay';

  // 创建弹窗内容
  var modal = document.createElement('div');
  modal.className = 'web-card-modal-content';

  modal.innerHTML =
    '<div class="web-card-modal-icon">' + iconText + '</div>' +
    '<div class="web-card-modal-title">' + escapeHtml(titleText) + '</div>' +
    '<div class="web-card-modal-tag">' + escapeHtml(tagText) + '</div>' +
    '<button class="web-card-modal-close" aria-label="关闭">✕</button>' +
    '<a class="web-card-modal-link" href="' + encodeURI(linkUrl) + '" target="_blank" rel="noopener">网站直达 →</a>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // 动画结束后再显示关闭按钮和链接淡入
  requestAnimationFrame(function() {
    overlay.classList.add('web-card-modal-visible');
  });

  // 点击遮罩层/关闭按钮关闭
  modal.querySelector('.web-card-modal-close').addEventListener('click', function() {
    closeCardModal(overlay);
  });
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      closeCardModal(overlay);
    }
  });

  // ESC 键关闭
  function escHandler(e) {
    if (e.key === 'Escape') {
      closeCardModal(overlay);
      document.removeEventListener('keydown', escHandler);
    }
  }
  document.addEventListener('keydown', escHandler);
}

function closeCardModal(overlay) {
  overlay.classList.remove('web-card-modal-visible');
  overlay.classList.add('web-card-modal-closing');
  setTimeout(function() {
    overlay.remove();
  }, 300); // 与 CSS 过渡时间匹配
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

