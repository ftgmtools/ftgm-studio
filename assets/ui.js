// Shared UI helpers: toasts, modals, spinner, confirm
(function(){
  const w = window;

  // Toast
  let wrap;
  function ensureWrap(){
    if(!wrap){ wrap = document.createElement('div'); wrap.className='toast-wrap'; document.body.appendChild(wrap);}
    return wrap;
  }
  const ICONS = { ok:'fa-check', err:'fa-xmark', warn:'fa-triangle-exclamation', info:'fa-circle-info' };
  w.toast = function(msg, type='info', timeout=3200){
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.innerHTML = `<div class="ic"><i class="fa-solid ${ICONS[type]||ICONS.info}"></i></div><div>${msg}</div>`;
    ensureWrap().appendChild(el);
    setTimeout(()=>{ el.style.opacity='0'; el.style.transform='translateX(20px)'; el.style.transition='.25s'; setTimeout(()=>el.remove(),260); }, timeout);
  };

  // Modal
  w.openModal = function({title, subtitle, body, actions=[], size}={}){
    const back = document.createElement('div');
    back.className='modal-back open';
    const m = document.createElement('div');
    m.className='modal'; if(size) m.style.maxWidth = size;
    m.innerHTML = `
      <h3>${title||''}</h3>
      ${subtitle?`<div class="sub">${subtitle}</div>`:''}
      <div class="modal-body"></div>
      <div class="foot"></div>`;
    back.appendChild(m); document.body.appendChild(back);
    const bodyEl = m.querySelector('.modal-body');
    if(typeof body === 'string') bodyEl.innerHTML = body;
    else if(body instanceof Node) bodyEl.appendChild(body);
    const foot = m.querySelector('.foot');
    const close = ()=>{ back.style.opacity='0'; setTimeout(()=>back.remove(),180); };
    actions.forEach(a=>{
      const b = document.createElement('button');
      b.className = 'btn ' + (a.variant?('btn-'+a.variant):'');
      b.innerHTML = (a.icon?`<i class="fa-solid ${a.icon}"></i>`:'') + (a.label||'OK');
      b.onclick = async ()=>{
        if(a.onClick){
          b.disabled = true; b.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px"></span>';
          try{ const r = await a.onClick({close, modal:m}); if(r !== false) close(); }
          catch(e){ console.error(e); toast(e.message||'Error','err'); b.disabled=false; b.innerHTML = (a.icon?`<i class="fa-solid ${a.icon}"></i>`:'') + (a.label||'OK'); }
        } else close();
      };
      foot.appendChild(b);
    });
    back.addEventListener('click', e=>{ if(e.target===back) close(); });
    return { close, modal: m, back };
  };

  w.confirmModal = function({title='Are you sure?', text='', confirmLabel='Confirm', variant='danger', icon='fa-triangle-exclamation'}={}){
    return new Promise(resolve=>{
      openModal({
        title, subtitle: text,
        body: `<div style="display:flex;align-items:center;gap:14px"><div style="width:44px;height:44px;border-radius:12px;background:rgba(239,68,68,.15);color:#fca5a5;display:grid;place-items:center"><i class="fa-solid ${icon}"></i></div><div class="muted text-sm">This action may be permanent.</div></div>`,
        actions: [
          { label:'Cancel', variant:'ghost', onClick:()=>{ resolve(false); } },
          { label:confirmLabel, variant, onClick:()=>{ resolve(true); } }
        ]
      });
    });
  };

  // Skeleton helper
  w.skeletonCards = function(n=4){
    let s = '';
    for(let i=0;i<n;i++) s += `<div class="sk-card"><div class="sk sk-thumb"></div><div class="sk sk-line" style="width:60%"></div><div class="sk sk-line" style="width:90%"></div><div class="sk sk-line" style="width:40%"></div></div>`;
    return s;
  };

  // Sidebar toggle
  w.bindSidebar = function(){
    const sb = document.querySelector('.sidebar');
    const bd = document.querySelector('.backdrop');
    const btn = document.querySelector('.menu-btn');
    if(!sb || !btn) return;
    const close = ()=>{ sb.classList.remove('open'); bd?.classList.remove('open'); };
    btn.addEventListener('click', ()=>{ sb.classList.add('open'); bd?.classList.add('open'); });
    bd?.addEventListener('click', close);
    sb.querySelectorAll('.nav-item').forEach(n=>n.addEventListener('click', close));
  };

  // Escape helper
  w.esc = function(s){ return String(s??'').replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); };

  // Format
  w.fmtDate = function(t){ if(!t) return '—'; const d = new Date(typeof t==='number'?t:Date.parse(t)); if(isNaN(d)) return '—'; return d.toLocaleString(); };
  w.fmtDay = function(t){ if(!t||t==='unlimited') return 'Unlimited'; const d = new Date(typeof t==='number'?t:Date.parse(t)); if(isNaN(d)) return '—'; return d.toLocaleDateString(); };

  // Random key
  w.genKey = function(prefix='SDRM'){
    const seg = ()=>Math.random().toString(36).slice(2,6).toUpperCase();
    return `${prefix}-${seg()}-${seg()}-${seg()}`;
  };
})();
/* ============ Offline Detector ============ */
(function(){
  const w = window;
  let overlay;
  function ensure(){
    if(overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'offline-overlay';
    overlay.innerHTML = `
      <div class="offline-card">
        <div class="ic"><i class="fa-solid fa-wifi"></i></div>
        <h3>No Internet Connection</h3>
        <p>Please check your internet connection and try again. This site requires an active connection to work.</p>
        <div class="dots"><span></span><span></span><span></span></div>
      </div>`;
    document.body.appendChild(overlay);
    return overlay;
  }
  function show(){ ensure().classList.add('open'); }
  function hide(){ overlay && overlay.classList.remove('open'); }
  function check(){ if (!navigator.onLine) show(); else hide(); }
  w.addEventListener('online', hide);
  w.addEventListener('offline', show);
  w.addEventListener('DOMContentLoaded', check);
  // Extra: periodic ping to detect API/DNS drop
  setInterval(()=>{ if(!navigator.onLine) show(); }, 3000);
  w.__offlineCheck = check;
})();

/* Copyright footer helper */
window.copyrightHTML = function(){
  const y = new Date().getFullYear();
  return `<div class="copyright">© ${y} Salman DRM. All rights reserved.</div>`;
};
