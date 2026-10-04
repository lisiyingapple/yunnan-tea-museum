/* 云南省茶博官网 · 交互层 v2
   帷幕入场 / 双语切换 / 滚动渐显 / 数字滚动 / 宣言逐字 /
   导航状态与高亮 / 首屏与风土视差 / 移动端菜单 */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 帷幕入场：字体就绪即揭开（最长等 1.2s） ---------- */
  var curtain = document.getElementById('curtain');
  var hero = document.getElementById('hero');

  function liftCurtain() {
    if (hero) hero.classList.add('is-ready');
    if (curtain) {
      curtain.classList.add('is-done');
      window.setTimeout(function () { curtain.remove(); }, 900);
    }
  }

  if (reduce || !curtain) {
    if (curtain) curtain.remove();
    if (hero) hero.classList.add('is-ready');
  } else {
    var lifted = false;
    function liftOnce() { if (!lifted) { lifted = true; liftCurtain(); } }
    window.setTimeout(liftOnce, 1200);                 /* 兜底 */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(liftOnce);
    } else {
      window.addEventListener('load', liftOnce);
    }
  }

  /* ---------- 双语切换 ---------- */
  var langBtns = document.querySelectorAll('.lang__btn');
  var pill = document.querySelector('.nav .lang__pill');

  function movePill() {
    if (!pill) return;
    var active = document.querySelector('.nav .lang__btn.is-active');
    if (active) {
      pill.style.width = active.offsetWidth + 'px';
      pill.style.transform = 'translateX(' + (active.offsetLeft - 3) + 'px)';
    }
  }

  function setLang(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang === 'en' ? 'en' : 'zh');
    langBtns.forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-set') === lang);
    });
    try { localStorage.setItem('ytcm-lang', lang); } catch (e) {}
    movePill();
  }

  langBtns.forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-set')); });
  });
  try {
    var saved = localStorage.getItem('ytcm-lang');
    if (saved && saved !== 'zh') setLang(saved);
  } catch (e) {}
  window.addEventListener('load', movePill);
  window.addEventListener('resize', movePill);
  movePill();

  /* ---------- 移动端菜单 ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    if (burger) {
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('is-locked');
  }
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('is-locked', open);
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ---------- 滚动渐显 ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 宣言逐字浮现 ---------- */
  function splitChars(el) {
    var text = el.textContent;
    el.textContent = '';
    Array.prototype.forEach.call(text, function (ch) {
      var s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch;
      el.appendChild(s);
    });
  }
  var statementZh = document.getElementById('statementText');
  var statementEn = document.getElementById('statementTextEn');
  [statementZh, statementEn].forEach(function (el) {
    if (!el) return;
    splitChars(el);
    if (reduce) { el.classList.add('is-in'); return; }
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        el.classList.add('is-in');
        var chars = el.querySelectorAll('.ch');
        chars.forEach(function (c, i) {
          c.style.transitionDelay = (i * 38) + 'ms';
        });
        sio.disconnect();
      });
    }, { threshold: 0.4 });
    sio.observe(el);
  });

  /* ---------- 数字滚动 ---------- */
  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var range = el.getAttribute('data-range');
    var start = null, DUR = 1900;
    if (range) {
      /* 1600–2400：滚动前半段数字，后半段保持不变 */
      var end = parseInt(range, 10);
      el.textContent = '0–' + end;
      function stepRange(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / DUR, 1);
        el.textContent = Math.round(easeOutExpo(p) * target) + '–' + end;
        if (p < 1) requestAnimationFrame(stepRange);
      }
      requestAnimationFrame(stepRange);
      window.setTimeout(function () { el.textContent = target + '–' + end; }, DUR + 400);
      return;
    }
    var grouped = el.hasAttribute('data-group');
    var suffix = el.getAttribute('data-suffix') || '';
    function fmt(n) { return (grouped ? n.toLocaleString('en-US') : String(n)) + suffix; }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / DUR, 1);
      el.textContent = fmt(Math.round(easeOutExpo(p) * target));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    /* 兜底：极少数环境 rAF 被暂停时，超时后直接落到最终值 */
    window.setTimeout(function () { el.textContent = fmt(target); }, DUR + 400);
  }
  var counters = document.querySelectorAll('.stat__num[data-count]');
  if (!reduce && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          animateCount(en.target);
          cio.unobserve(en.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- 导航滚动态 + 当前章节高亮 ---------- */
  var nav = document.getElementById('nav');
  var spyLinks = document.querySelectorAll('.nav__links a[data-spy]');
  var sections = [];
  spyLinks.forEach(function (a) {
    var sec = document.getElementById(a.getAttribute('data-spy'));
    if (sec) sections.push({ id: a.getAttribute('data-spy'), el: sec, link: a });
  });

  /* ---------- 视差 ---------- */
  var heroBg = document.getElementById('heroBg');
  var terroirBg = document.getElementById('terroirBg');
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle('is-scrolled', y > 24);

    if (!reduce) {
      if (heroBg && y < window.innerHeight * 1.3) {
        heroBg.style.transform = 'translate3d(0,' + (y * 0.24) + 'px,0)';
      }
      if (terroirBg) {
        var rect = terroirBg.parentElement.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          var progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          var shift = (progress - 0.5) * rect.height * 0.18;
          terroirBg.style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0)';
        }
      }
    }

    /* 当前章节 */
    var current = null;
    sections.forEach(function (s) {
      var r = s.el.getBoundingClientRect();
      if (r.top <= window.innerHeight * 0.42 && r.bottom > window.innerHeight * 0.42) {
        current = s.id;
      }
    });
    spyLinks.forEach(function (a) {
      a.classList.toggle('is-current', a.getAttribute('data-spy') === current);
    });

    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
