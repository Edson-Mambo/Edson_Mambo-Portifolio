const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Premium motion layer: reveal content as it enters the viewport.
const style = document.createElement('style');
style.textContent = `
  .reveal{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.7,.2,1);transition-delay:var(--delay,0ms)}
  .reveal.visible{opacity:1;transform:none}
  .hero .eyebrow,.hero h1,.hero p,.hero .buttons,.hero .hero-stats{opacity:0;transform:translateY(18px);animation:heroIn .8s cubic-bezier(.2,.7,.2,1) forwards}
  .hero h1{animation-delay:.08s}.hero p{animation-delay:.18s}.hero .buttons{animation-delay:.28s}.hero .hero-stats{animation-delay:.38s}
  .feature,.skill-card,.project,.service-grid article{position:relative;overflow:hidden}
  .feature:after,.skill-card:after,.project:after,.service-grid article:after{content:'';position:absolute;inset:0;background:linear-gradient(115deg,transparent 35%,rgba(214,173,85,.07),transparent 65%);transform:translateX(-120%);transition:transform .8s ease;pointer-events:none}
  .feature:hover:after,.skill-card:hover:after,.project:hover:after,.service-grid article:hover:after{transform:translateX(120%)}
  .back-top{position:fixed;right:24px;bottom:24px;width:44px;height:44px;border:1px solid #d6ad55;border-radius:50%;background:rgba(5,5,5,.88);color:#d6ad55;display:grid;place-items:center;font-weight:900;opacity:0;visibility:hidden;transform:translateY(10px);transition:.3s;z-index:30;cursor:pointer}
  .back-top.show{opacity:1;visibility:visible;transform:none}.back-top:hover{color:#050505;background:#d6ad55}
  .links a.active{position:relative}.links a.active:after{content:'';position:absolute;left:0;right:0;bottom:-9px;height:2px;background:#c62828;border-radius:4px}
  @keyframes heroIn{to{opacity:1;transform:none}}
  @media(prefers-reduced-motion:reduce){.reveal,.hero .eyebrow,.hero h1,.hero p,.hero .buttons,.hero .hero-stats{opacity:1;transform:none;animation:none}.feature:after,.skill-card:after,.project:after,.service-grid article:after{display:none}}
`;
document.head.appendChild(style);

const revealItems = document.querySelectorAll('section .wrap > *:not(.section-kicker), .feature, .skill-card, .project, .role, .education article, .client-list > div, .service-grid article, .contact-card');
revealItems.forEach((item, index) => {
  item.classList.add('reveal');
  item.style.setProperty('--delay', `${Math.min((index % 7) * 65, 390)}ms`);
});

if (reduceMotion) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -35px 0px' });
  revealItems.forEach((item) => observer.observe(item));
}

// Highlight the section currently being viewed.
const navLinks = [...document.querySelectorAll('.links a[href^="#"]')];
const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { threshold: 0, rootMargin: '-25% 0px -65% 0px' });
sections.forEach((section) => sectionObserver.observe(section));

// Small floating back-to-top control for long mobile/desktop journeys.
const backTop = document.createElement('button');
backTop.className = 'back-top';
backTop.type = 'button';
backTop.setAttribute('aria-label', 'Voltar ao topo');
backTop.innerHTML = '↑';
document.body.appendChild(backTop);
window.addEventListener('scroll', () => backTop.classList.toggle('show', window.scrollY > 650), { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

// Keep the footer year current without manual edits.
const year = document.querySelector('footer span:first-child');
if (year) year.textContent = `© ${new Date().getFullYear()} Edson Salomão Mambo`;
