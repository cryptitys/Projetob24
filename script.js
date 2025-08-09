// Theme toggle + persist
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const menuBtn = document.getElementById('menu-btn');
const nav = document.querySelector('.nav');
const yearEl = document.getElementById('year');

function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

const saved = localStorage.getItem('vtrs_theme');
if(saved) applyTheme(saved);
else {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', ()=>{
  const cur = document.documentElement.getAttribute('data-theme') || 'light';
  const next = cur === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('vtrs_theme', next);
});

// Mobile menu
menuBtn.addEventListener('click', ()=>{ nav.classList.toggle('open'); });

// Projects filtering
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('#projects-grid .card');
filters.forEach(f=> f.addEventListener('click', ()=>{
  filters.forEach(x=>x.classList.remove('active'));
  f.classList.add('active');
  const cat = f.dataset.filter;
  cards.forEach(card=>{
    if(cat === '*' || card.dataset.category === cat) card.style.display = '';
    else card.style.display = 'none';
  });
}));

// Modal preview
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalIframe = document.getElementById('modal-iframe');
const modalClose = document.getElementById('modal-close');
const modalBuy = document.getElementById('modal-buy');
const modalCode = document.getElementById('modal-code');

document.addEventListener('click', (e)=>{
  const btn = e.target.closest('[data-action]');
  if(!btn) return;
  const action = btn.dataset.action;
  if(action === 'preview'){
    const src = btn.dataset.src;
    const title = btn.dataset.title;
    modalTitle.textContent = title;
    modalIframe.src = src;
    modal.setAttribute('aria-hidden','false');
    modalBuy.dataset.id = btn.dataset.id || '';
    modalCode.href = src;
  }
  if(action === 'buy'){
    const id = btn.dataset.id || 'produto';
    alert('Comprar: ' + id + ' — excecutar fluxo de pagamento aqui.');
  }
});

modalClose.addEventListener('click', ()=> closeModal());
modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
function closeModal(){ modal.setAttribute('aria-hidden','true'); modalIframe.src = 'about:blank'; }

// Contact form (exemplo) — substituir integração real quando necessário
const form = document.getElementById('contact-form');
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = new FormData(form);
  const payload = Object.fromEntries(data.entries());
  // Exemplo: salvar em backend ou enviar por email
  console.log('Contato enviado', payload);
  alert('Mensagem enviada! Em breve eu respondo.');
  form.reset();
});

// small utils
yearEl.textContent = new Date().getFullYear();

// Accessibility: close modal with ESC
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

// Lazy image loading fallback
if('loading' in HTMLImageElement.prototype){
  document.querySelectorAll('img[loading="lazy"]').forEach(img => img.src = img.dataset.src || img.src);
}

// Simple animation on scroll (lightweight)
const reveal = ()=>{
  document.querySelectorAll('.card, .service-card, .hero-left').forEach(el=>{
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight - 60) el.style.transform = 'translateY(0)';
    else el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 600ms cubic-bezier(.22,.9,.28,1)';
  });
};
window.addEventListener('scroll', reveal); window.addEventListener('load', reveal);
