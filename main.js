/* ── Inventário TI v2.0 — Showcase ─────────────────────────────
   GSAP 3 + ScrollTrigger + highlight.js
   Sem dependências de build — roda direto no navegador.

   IMPORTANTE: todos os tweens usam gsap.fromTo() com opacity:1
   explícito no "to", porque o CSS inicia os elementos em opacity:0
   e gsap.from() leria esse 0 como valor-alvo — ficando invisível.
   ─────────────────────────────────────────────────────────── */

gsap.registerPlugin(ScrollTrigger);

/* ── 1. Highlight.js ─────────────────────────────────────────── */
document.querySelectorAll('pre code').forEach(b => hljs.highlightElement(b));

/* ── 2. Tema claro / escuro ──────────────────────────────────── */
const themeBtn   = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme-inventario') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeBtn.addEventListener('click', () => {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = dark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  themeBtn.textContent = dark ? '🌙' : '☀️';
  localStorage.setItem('theme-inventario', next);
});

/* ── 3. Navbar: fundo ao rolar ───────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ── 4. Partículas flutuantes (estilo verde-TI) ──────────────── */
(function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 12; i++) {
    const p    = document.createElement('div');
    const size = Math.random() * 3 + 2;
    p.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      border-radius:50%;
      background:rgba(45,122,80,${Math.random() * 0.1 + 0.03});
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      pointer-events:none;
      will-change:transform;
    `;
    container.appendChild(p);
    gsap.to(p, {
      y: `${(Math.random() - 0.5) * 70}px`,
      x: `${(Math.random() - 0.5) * 45}px`,
      duration: Math.random() * 6 + 5,
      repeat: -1, yoyo: true,
      ease: 'sine.inOut',
      delay: Math.random() * 3,
    });
  }
})();

/* ── 5. Hero — timeline de entrada ──────────────────────────── */
/*  .hero-title NÃO tem opacity:0 no CSS, então fromTo funciona.
    Os demais elementos têm opacity:0 no CSS — usamos fromTo com
    to:{opacity:1} para forçar o estado final correto.            */
const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
tl
  .fromTo('#heroBadge',
    { opacity: 0, y: -14 },
    { opacity: 1, y: 0, duration: 0.45 })
  .fromTo('.hero-title',
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: 0.55 }, '-=0.20')
  .fromTo('#heroSub',
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.45 }, '-=0.25')
  .fromTo('#heroTags .tag',
    { opacity: 0, scale: 0.7 },
    { opacity: 1, scale: 1, stagger: 0.06, duration: 0.35, ease: 'back.out(1.6)' }, '-=0.20')
  .fromTo('#heroCtas > *',
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, stagger: 0.08, duration: 0.38 }, '-=0.15')
  .fromTo('#heroMockup',
    { opacity: 0, x: 36 },
    { opacity: 1, x: 0, duration: 0.7 }, '-=0.40');

/* Flutuação suave do mockup */
tl.call(() => {
  gsap.to('#heroMockup', {
    y: -8, duration: 4,
    repeat: -1, yoyo: true, ease: 'sine.inOut',
  });
});

/* ── 6. Counters da stats bar ────────────────────────────────── */
let countersDone = false;
function animateCounters() {
  if (countersDone) return;
  countersDone = true;
  document.querySelectorAll('.count').forEach(el => {
    const target = parseInt(el.dataset.to, 10);
    const obj    = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 1.8, ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.round(obj.val); },
    });
  });
}
ScrollTrigger.create({
  trigger: '.stats-bar',
  start: 'top 88%',
  once: true,
  onEnter: animateCounters,
});

/* ── 7. Reveal genérico via ScrollTrigger ────────────────────── */
/*  Todos usam fromTo() para garantir opacity:1 no estado final   */
function reveal(selector, fromVars, toExtra) {
  document.querySelectorAll(selector).forEach(el => {
    const delay = el.dataset.d ? parseFloat(el.dataset.d) : 0;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.fromTo(el, fromVars, {
          opacity: 1, y: 0, x: 0, scale: 1,
          ...toExtra,
          delay,
          duration: 0.65,
          ease: 'power3.out',
        });
      },
    });
  });
}

reveal('.reveal',       { opacity: 0, y: 28 });
reveal('.reveal-left',  { opacity: 0, x: -44 });
reveal('.reveal-right', { opacity: 0, x: 44 });
reveal('.reveal-card',  { opacity: 0, y: 34, scale: 0.96 });

/* ── 8. Hover nos feat-cards ─────────────────────────────────── */
document.querySelectorAll('.feat-card').forEach(card => {
  const icon = card.querySelector('.feat-icon-wrap');
  card.addEventListener('mouseenter', () =>
    gsap.to(icon, { scale: 1.18, rotation: 6, duration: 0.22, ease: 'back.out(2)' }));
  card.addEventListener('mouseleave', () =>
    gsap.to(icon, { scale: 1, rotation: 0, duration: 0.22, ease: 'power2.out' }));
});

/* ── 9. Hover nos flow-steps ─────────────────────────────────── */
document.querySelectorAll('.flow-step').forEach(step => {
  const num = step.querySelector('.flow-num');
  step.addEventListener('mouseenter', () =>
    gsap.to(num, { scale: 1.22, duration: 0.2, ease: 'back.out(2)' }));
  step.addEventListener('mouseleave', () =>
    gsap.to(num, { scale: 1, duration: 0.2, ease: 'power2.out' }));
});

/* ── 10. Tabs de código ──────────────────────────────────────── */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById('panel-' + tab.dataset.tab);
    if (!panel) return;
    panel.classList.add('active');
    panel.querySelectorAll('pre code:not(.hljs)').forEach(b => hljs.highlightElement(b));
    gsap.fromTo(panel,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' });
  });
});

/* ── 11. Arquitetura — animação das layers ───────────────────── */
ScrollTrigger.create({
  trigger: '.arch',
  start: 'top 82%',
  once: true,
  onEnter: () => {
    gsap.fromTo('.arch-layer',
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, stagger: 0.18, duration: 0.6, ease: 'power3.out' });
    gsap.fromTo('.arch-connector',
      { opacity: 0 },
      { opacity: 1, stagger: 0.15, duration: 0.4, delay: 0.3, ease: 'power2.out' });
    document.querySelectorAll('.arch-layer').forEach((layer, i) => {
      gsap.fromTo(layer.querySelectorAll('.arch-box'),
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, stagger: 0.07, duration: 0.40, ease: 'back.out(1.4)', delay: 0.28 + i * 0.18 });
    });
  },
});

/* ── 12. Stack gsap-row: glow de destaque ────────────────────── */
const gsapRow = document.querySelector('.gsap-row');
if (gsapRow) {
  ScrollTrigger.create({
    trigger: gsapRow,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.fromTo(gsapRow,
        { boxShadow: '0 0 0px rgba(45,122,80,0)' },
        { boxShadow: '0 0 28px rgba(45,122,80,0.2)', duration: 0.9,
          ease: 'power2.out', yoyo: true, repeat: 1 });
    },
  });
}

/* ── 13. Pulse no notif-dot do mockup ────────────────────────── */
gsap.to('.notif-dot', {
  scale: 1.6, opacity: 0.4,
  repeat: -1, yoyo: true,
  duration: 1.2, ease: 'sine.inOut',
});

/* ── 14. Scroll-to-top ───────────────────────────────────────── */
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── 15. Smooth nav links ────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── 16. Destaque da nav-link ativa ──────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    if (sec.getBoundingClientRect().top <= 100) current = sec.id;
  });
  navLinks.forEach(a => {
    const active = a.getAttribute('href') === '#' + current;
    a.style.color      = active ? 'var(--accent-text)' : '';
    a.style.background = active ? 'var(--accent-glow)' : '';
    a.style.fontWeight = active ? '700' : '';
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });
