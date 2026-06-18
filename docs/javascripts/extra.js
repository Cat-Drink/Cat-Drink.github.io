/* ==========================================
   Zensical-CatDrink-Blog 自定义脚本
   功能：为博客添加交互特效和增强功能
   ========================================== */

/**
 * MkDocs 即时导航兼容处理
 * 首次加载页面时强制刷新一次，确保所有脚本正确加载
 */
document$.subscribe(function() {
  console.log('Zensical-CatDrink-Blog loaded');
  
  // 使用 sessionStorage 标记是否已刷新过，避免无限刷新
  if (!sessionStorage.getItem('refreshed')) {
    sessionStorage.setItem('refreshed', 'true');
    location.reload(true);
  }
});

/**
 * 标签页切换趣味标题效果
 * 当用户离开页面时显示搞笑标题，返回时恢复原标题
 */
var OriginTitle = document.title; // 保存原始标题
var titleTime; // 计时器句柄
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        // 页面隐藏时，修改标题为"崩溃"提示
        document.title = '╭(°A°`)╮ 页面崩溃啦 ~';
        clearTimeout(titleTime);
    } else {
        // 页面显示时，先显示"恢复"提示，2秒后恢复原标题
        document.title = '(ฅ>ω<*ฅ) 噫又好啦 ~' + OriginTitle;
        titleTime = setTimeout(function () {
            document.title = OriginTitle;
        }, 2000);
    }
});

/**
 * 鼠标点击爱心漂浮效果
 * 用户点击页面时，在点击位置生成一个随机颜色的爱心，向上漂浮后消失
 */
document.addEventListener('click', function(e) {
  // 可选颜色数组，随机选择
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  // 创建爱心元素
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
  
  // 1秒动画结束后移除元素
  setTimeout(() => {
    heart.remove();
  }, 1000);
});

/**
 * 注入爱心漂浮动画的CSS样式
 */
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

/**
 * 鼠标跟随光尾效果（粒子轨迹）
 * 使用 Canvas 绘制跟随鼠标移动的渐变光点轨迹
 * 采用立即执行函数表达式(IIFE)封装，避免污染全局作用域
 */
(function() {
  // 创建全屏Canvas画布
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
  
  // 存储所有轨迹点的数组，每个点包含坐标和生命值
  let trailPoints = [];
  
  /**
   * 调整画布尺寸为窗口大小
   */
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  // 初始化尺寸，监听窗口大小变化
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  /**
   * 添加新的轨迹点
   * @param {number} x - 鼠标X坐标
   * @param {number} y - 鼠标Y坐标
   */
  function addPoint(x, y) {
    // 限制最大点数，避免性能问题，超过100个点后移除最早的点
    if (trailPoints.length > 100) {
      trailPoints.shift();
    }
    // life: 1.0 表示完全不透明，逐渐衰减到0后移除
    trailPoints.push({ x, y, life: 1.0 });
  }
  
  /**
   * 更新所有轨迹点的生命值（衰减）
   * 生命值<=0的点将被移除
   */
  function updateTrail() {
    for (let i = trailPoints.length - 1; i >= 0; i--) {
      trailPoints[i].life -= 0.02; // 衰减速度，值越大消失越快
      if (trailPoints[i].life <= 0) {
        trailPoints.splice(i, 1);
      }
    }
  }
  
  /**
   * 在画布上绘制所有轨迹点
   * 使用径向渐变实现光晕效果
   */
  function drawTrail() {
    // 清空整个画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 从旧到新依次绘制，保证叠加效果自然
    for (let i = 0; i < trailPoints.length; i++) {
      const p = trailPoints[i];
      // 透明度和大小都随生命值线性变化
      const opacity = p.life;
      const radius = 8 * p.life;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      
      // 创建径向渐变，中心不透明，边缘透明，实现光晕效果
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
      gradient.addColorStop(0, `rgba(102, 126, 234, ${opacity})`);
      gradient.addColorStop(0.5, `rgba(102, 126, 234, ${opacity * 0.5})`);
      gradient.addColorStop(1, `rgba(102, 126, 234, 0)`);
      ctx.fillStyle = gradient;
      
      ctx.fill();
    }
  }
  
  /**
   * 动画循环，使用 requestAnimationFrame 保证流畅
   */
  function animate() {
    updateTrail();
    drawTrail();
    requestAnimationFrame(animate);
  }
  
  // 启动动画
  animate();
  
  /**
   * 监听鼠标移动事件，添加轨迹点
   * 点与点之间距离太近时不添加，避免点过于密集影响性能
   */
  let lastX = 0, lastY = 0; // 上一个点的坐标
  document.addEventListener('mousemove', e => {
    const x = e.clientX;
    const y = e.clientY;
    
    // 计算与上一个点的距离
    const distance = Math.hypot(x - lastX, y - lastY);
    // 只有距离大于阈值才添加新点
    if (distance > 5) {
      addPoint(x, y);
      lastX = x;
      lastY = y;
    }
  });
})();

/* ==========================================
   可滑动卡片列表 — 拖拽滚动
   功能：为横向卡片列表提供拖拽滚动支持
   算法：基于 pointer 事件，通过移动距离 + 按压时长判定是点击还是拖拽
   ========================================== */
document$.subscribe(function() {
  document.querySelectorAll('.web-scroll').forEach(function(container) {
    // 防止 MkDocs 即时导航重复绑定事件
    if (container.dataset.scrollInit) return;
    container.dataset.scrollInit = 'true';

    // 拖拽状态变量
    var isDown = false;         // 是否正在按住拖拽
    var startX = 0;             // 按下时的鼠标X坐标
    var scrollStart = 0;        // 按下时容器的滚动位置
    var startTime = 0;          // 按下时的时间戳
    var tapTarget = null;       // 被点击的目标元素

    // 判定阈值配置
    var MOVE_THRESHOLD = 10;    // 移动超过 10px 判定为拖拽
    var TIME_THRESHOLD = 300;   // 按压超过 300ms 判定为长按（不触发点击）

    /**
     * 指针按下事件：开始拖拽
     */
    container.addEventListener('pointerdown', function(e) {
      if (e.button !== 0) return; // 只响应鼠标左键
      isDown = true;
      startX = e.pageX;
      scrollStart = container.scrollLeft;
      startTime = Date.now();

      // 查找被点击的卡片元素，用于后续点击判定
      var card = e.target.closest('.web-card');
      tapTarget = card ? (card.querySelector('a') || card.querySelector('button') || card) : null;

      // 拖拽时改变鼠标样式，关闭平滑滚动
      container.style.cursor = 'grabbing';
      container.style.scrollBehavior = 'auto';
      // 捕获指针，保证即使鼠标移出元素也能继续接收事件
      container.setPointerCapture(e.pointerId);
    });

    /**
     * 指针移动事件：更新滚动位置
     */
    container.addEventListener('pointermove', function(e) {
      if (!isDown) return;
      // 根据鼠标移动距离计算新的滚动位置
      container.scrollLeft = scrollStart - (e.pageX - startX);
    });

    /**
     * 指针抬起事件：结束拖拽，判定是否触发点击
     */
    container.addEventListener('pointerup', function(e) {
      if (!isDown) return;
      // 计算移动距离和按压时长
      var dx = Math.abs(e.pageX - startX);
      var dt = Date.now() - startTime;

      // 如果移动距离小且按压时间短，判定为点击，打开详情弹窗
      if (dx < MOVE_THRESHOLD && dt < TIME_THRESHOLD && tapTarget) {
        e.preventDefault();
        showCardModal(tapTarget);
      }

      // 重置状态，恢复默认样式
      isDown = false;
      tapTarget = null;
      container.style.cursor = '';
      container.style.scrollBehavior = 'smooth';
    });

    /**
     * 指针离开容器：结束拖拽
     */
    container.addEventListener('pointerleave', function() {
      if (!isDown) return;
      isDown = false;
      tapTarget = null;
      container.style.cursor = '';
      container.style.scrollBehavior = 'smooth';
    });

    /**
     * 指针取消：处理非正常结束情况
     */
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
   卡片点击弹窗模块
   功能：点击卡片后弹出弹窗，旋转放大展示卡片详情
   ========================================== */

/**
 * 显示卡片详情弹窗
 * @param {HTMLElement} card - 被点击的卡片元素
 */
function showCardModal(card) {
  // 从卡片元素中提取数据
  var icon = card.querySelector('.web-card-icon');
  var title = card.querySelector('.web-card-title');
  var tag = card.querySelector('.web-card-tag');
  var iconText = icon ? icon.textContent.trim() : '';
  var titleText = title ? title.textContent.trim() : '';
  var tagText = tag ? tag.textContent.trim() : '';
  var linkUrl = card.href || '';

  // 如果页面上已有弹窗，先移除
  var existing = document.querySelector('.web-card-modal-overlay');
  if (existing) existing.remove();

  // 创建遮罩层
  var overlay = document.createElement('div');
  overlay.className = 'web-card-modal-overlay';

  // 创建弹窗内容容器
  var modal = document.createElement('div');
  modal.className = 'web-card-modal-content';

  // 构建弹窗HTML结构
  modal.innerHTML =
    '<div class="web-card-modal-icon">' + iconText + '</div>' +
    '<div class="web-card-modal-title">' + escapeHtml(titleText) + '</div>' +
    '<div class="web-card-modal-tag">' + escapeHtml(tagText) + '</div>' +
    '<button class="web-card-modal-close" aria-label="关闭">✕</button>' +
    '<a class="web-card-modal-link" href="' + encodeURI(linkUrl) + '" target="_blank" rel="noopener">网站直达 →</a>';

  // 添加到页面
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // 使用 requestAnimationFrame 确保DOM添加完成后再添加类，触发动画
  requestAnimationFrame(function() {
    overlay.classList.add('web-card-modal-visible');
  });

  // 绑定关闭事件：点击关闭按钮
  modal.querySelector('.web-card-modal-close').addEventListener('click', function() {
    closeCardModal(overlay);
  });
  // 绑定关闭事件：点击遮罩层背景关闭
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      closeCardModal(overlay);
    }
  });

  /**
   * ESC 键盘快捷键关闭弹窗
   */
  function escHandler(e) {
    if (e.key === 'Escape') {
      closeCardModal(overlay);
      document.removeEventListener('keydown', escHandler);
    }
  }
  document.addEventListener('keydown', escHandler);
}

/**
 * 关闭卡片弹窗
 * @param {HTMLElement} overlay - 弹窗遮罩层元素
 */
function closeCardModal(overlay) {
  // 移除可见类，添加关闭类，触发关闭动画
  overlay.classList.remove('web-card-modal-visible');
  overlay.classList.add('web-card-modal-closing');
  // 等待CSS动画完成（300ms）后移除DOM元素
  setTimeout(function() {
    overlay.remove();
  }, 300);
}

/**
 * HTML转义函数，防止XSS攻击
 * @param {string} str - 需要转义的字符串
 * @returns {string} 转义后的安全字符串
 */
function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

