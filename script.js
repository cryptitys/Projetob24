// script.js - comportamentos: tema, menu mobile, injeção de projetos, formulário, preview e checkout

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

document.addEventListener('DOMContentLoaded', async () => {
  const root = document.documentElement;
  const year = $('#year');
  if(year) year.textContent = new Date().getFullYear();

  // Tema (localStorage + preferências do sistema)
  const saved = localStorage.getItem('site-theme');
  if(saved) root.setAttribute('data-theme', saved);
  else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) root.setAttribute('data-theme','light');
  else root.setAttribute('data-theme','dark');

  $('#theme-toggle').addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('site-theme', next);
  });

  // Mobile menu
  const menuBtn = $('#menu-btn');
  const mobileMenu = $('#mobile-menu');
  menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('active'));
  $$('.mobile-link').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('active')));

  // Carregar projetos do JSON
  let projects = [];
  try {
    const res = await fetch('projects.json');
    projects = await res.json();
  } catch (err) {
    console.warn('Não foi possível ler projects.json — usando demos internos.');
    projects = [
      {id:1,title:'Template E-commerce',desc:'Loja rápida com checkout integrado.',img:'https://placehold.co/800x500?text=E-commerce',price:99,tags:['Next.js','Tailwind']},
      {id:2,title:'Landing Empresa',desc:'Landing com conversão otimizada.',img:'https://placehold.co/800x500?text=Landing',price:79,tags:['HTML','CSS','JS']},
      {id:3,title:'Dashboard Admin',desc:'Painel com gráficos e tabelas dinâmicas.',img:'https://placehold.co/800x500?text=Dashboard',price:149,tags:['React','D3']},
      {id:4,title:'Portfólio Fotografia',desc:'Galeria com lightbox e filtros.',img:'https://placehold.co/800x500?text=Fotografia',price:59,tags:['Gallery']},
      {id:5,title:'Blog Moderno',desc:'Sistema de posts com leitura limpa.',img:'https://placehold.co/800x500?text=Blog',price:49,tags:['Gatsby','MDX']},
      {id:6,title:'App Fitness',desc:'App com histórico e integração de APIs.',img:'https://placehold.co/800x500?text=Fitness',price:129,tags:['Flutter']}
    ];
  }

  const grid = $('#projects-grid');
  let visible = 3;

  function renderProjects(){
    grid.innerHTML = '';
    projects.slice(0,visible).forEach(p => {
      const card = document.createElement('article');
      card.className = 'project-card';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.title}" />
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
        <div class="project-actions">
          <button class="btn btn-outline" data-id="${p.id}">Preview</button>
          <button class="btn btn-primary" data-buy="${p.id}">Comprar — R$${p.price}</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  renderProjects();

  $('#load-more').addEventListener('click', () => {
    visible = Math.min(projects.length, visible + 3);
    renderProjects();
    if(visible >= projects.length) $('#load-more').style.display = 'none';
  });

  // Delegation para preview e compra
  grid.addEventListener('click', e => {
    const previewBtn = e.target.closest('[data-id]');
    const buyBtn = e.target.closest('[data-buy]');
    if(previewBtn){
      const id = +previewBtn.getAttribute('data-id');
      openPreview(id);
    }
    if(buyBtn){
      const id = +buyBtn.getAttribute('data-buy');
      openCheckout(id);
    }
  });

  function openPreview(id){
    const p = projects.find(x=>x.id===id);
    if(!p) return alert('Projeto não encontrado');
    const w = window.open('', '_blank', 'width=1000,height=700');
    w.document.write(`<!doctype html><html><head><title>${p.title}</title><meta name=viewport content='width=device-width,initial-scale=1'><style>body{font-family:Inter,Arial;padding:20px;background:#f3f4f6}img{max-width:100%}</style></head><body><h1>${p.title}</h1><img src="${p.img}" alt="${p.title}"><p>${p.desc}</p><p><strong>Preço: R$${p.price}</strong></p></body></html>`);
  }

  function openCheckout(id){
    const p = projects.find(x=>x.id===id);
    if(!p) return;
    // Checkout mínimo (substitua por PayPal/PayPal Buttons, PagSeguro, MercadoPago, ou sua rota de pagamento)
    const ok = confirm(`Comprar "${p.title}" por R$${p.price}? Clique OK para ir ao checkout.`);
    if(ok){
      // exemplo: redirecionar para um link de pagamento; se quiser posso gerar botão PayPal/PayPal.Me
      window.location.href = `https://your-payment-link.example/checkout?product=${encodeURIComponent(p.title)}&price=${p.price}`;
    }
  }

  // Formulário
  $('#contact-form').addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    // aqui você pode enviar para sua API. Exemplo: fetch('/api/contact', {method:'POST',body:JSON.stringify(data)})
    console.log('Contato enviado', data);
    alert('Mensagem enviada — vou responder por e-mail!');
    e.target.reset();
  });

  $('#clear-form').addEventListener('click', () => $('#contact-form').reset());

});
