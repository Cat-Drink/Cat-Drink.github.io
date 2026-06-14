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
   参考 uiu/sliding-square-list.tsx 的 pointer 事件实现
   ========================================== */
document$.subscribe(function() {
  document.querySelectorAll('.web-scroll').forEach(function(container) {
    // 防止 MkDocs 即时导航时重复绑定
    if (container.dataset.scrollInit) return;
    container.dataset.scrollInit = 'true';

    var isDown = false;
    var startX = 0;
    var scrollStart = 0;
    var moved = false;
    var clickedCard = null;  // 记录 pointerdown 时命中的卡片

    container.addEventListener('pointerdown', function(e) {
      if (e.button !== 0) return; // 只响应左键
      isDown = true;
      moved = false;
      startX = e.pageX;
      scrollStart = container.scrollLeft;
      // 找出 pointerdown 时位于指针下方的 .web-card
      clickedCard = e.target.closest('.web-card');
      container.style.cursor = 'grabbing';
      container.style.scrollBehavior = 'auto'; // 拖拽时关闭平滑滚动
      container.setPointerCapture(e.pointerId);
    });

    container.addEventListener('pointermove', function(e) {
      if (!isDown) return;
      var dx = e.pageX - startX;
      if (Math.abs(dx) > 8) moved = true;
      container.scrollLeft = scrollStart - dx;
    });

    var release = function() {
      if (!isDown) return;
      isDown = false;
      container.style.cursor = '';
      container.style.scrollBehavior = 'smooth';

      // 未拖拽且有命中卡片 → 弹出放大弹窗
      if (!moved && clickedCard) {
        showCardZoom(clickedCard);
        clickedCard = null;
      }
    };

    container.addEventListener('pointerup', release);
    container.addEventListener('pointerleave', release);
    container.addEventListener('pointercancel', release);

    // 拖拽过 → 阻止链接跳转；未拖拽 → 放大弹窗已由 pointerup 触发，同样阻止跳转
    container.querySelectorAll('.web-card').forEach(function(card) {
      card.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (moved) {
          e.stopImmediatePropagation();
        }
      }, true);
    });
  });
});

/* ==========================================
   卡片放大弹窗
   ========================================== */
function showCardZoom(card) {
  // 获取卡片信息
  var icon  = card.querySelector('.web-card-icon');
  var title = card.querySelector('.web-card-title');
  var tag   = card.querySelector('.web-card-tag');
  var href  = card.getAttribute('href');

  // 创建遮罩层
  var overlay = document.createElement('div');
  overlay.className = 'web-card-overlay';

  // 创建放大卡片
  var zoomed = document.createElement('div');
  zoomed.className = 'web-card-zoomed';

  var iconEl = document.createElement('span');
  iconEl.className = 'web-card-icon';
  iconEl.textContent = icon ? icon.textContent : '';

  var titleEl = document.createElement('span');
  titleEl.className = 'web-card-title';
  titleEl.textContent = title ? title.textContent : '';

  var tagEl = document.createElement('span');
  tagEl.className = 'web-card-tag';
  tagEl.textContent = tag ? tag.textContent : '';

  var visitBtn = document.createElement('a');
  visitBtn.className = 'web-card-visit-btn';
  visitBtn.textContent = '访问网站';
  visitBtn.href = href;
  visitBtn.target = '_blank';
  visitBtn.rel = 'noopener';
  visitBtn.addEventListener('click', function(e) {
    e.stopPropagation();
  });

  var closeHint = document.createElement('div');
  closeHint.className = 'web-card-close-hint';
  closeHint.textContent = '点击空白处或按 ESC 关闭';

  zoomed.appendChild(iconEl);
  zoomed.appendChild(titleEl);
  zoomed.appendChild(tagEl);
  zoomed.appendChild(visitBtn);
  zoomed.appendChild(closeHint);

  overlay.appendChild(zoomed);
  document.body.appendChild(overlay);

  // 关闭函数
  function close() {
    overlay.removeEventListener('click', onOverlayClick);
    document.removeEventListener('keydown', onKeyDown);
    overlay.remove();
  }

  function onOverlayClick(e) {
    if (e.target === overlay) close();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') close();
  }

  overlay.addEventListener('click', onOverlayClick);
  document.addEventListener('keydown', onKeyDown);
}

