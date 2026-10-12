/* ITI4Future — logica dell'interfaccia
   ⚠️ Se nel tuo server.py gli endpoint hanno nomi diversi, cambia solo qui: */

const $ = id => document.getElementById(id);
const el = { viewport: $('chat-viewport'), msgs: $('chat-messages'),
  input: $('user-input'), send: $('send-btn'), welcome: $('welcome'), badge: $('status-badge'), status: $('status-text'), down: $('scroll-down'), bgMedia: $('bg-media') };
const LOGO = 'images/logo.png';
/* foto/video di sfondo: visibili solo nella home; in conversazione spariscono (e i video si fermano) */
function showBg(on) {
  if (!el.bgMedia) return;
  el.bgMedia.classList.toggle('hidden', !on);
  el.bgMedia.querySelectorAll('video').forEach(v => on ? v.play().catch(() => {}) : v.pause());
}
let history = [], busy = false, controller = null, currentId = null;
const DEMO = false; // aperto senza server: risposte finte per provare la grafica

/* ---------- Nuova conversazione ---------- */
$('new-chat-btn').onclick = () => {
  if (controller) controller.abort();
  history = []; currentId = null; busy = false; setBusy(false);
  el.msgs.innerHTML = ''; el.msgs.appendChild(el.welcome); el.input.focus();
  $('new-chat-btn').classList.remove('show');
  showBg(true); // foto e video tornano nella home
  closeMenu(); renderMenu();
};
document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('new-chat-btn').click(); } });

document.addEventListener('click', e => {
  const p = e.target.closest('[data-prompt]');
  if (p) send(p.dataset.prompt);
  const c = e.target.closest('.copy-btn');
  if (c) {
    navigator.clipboard.writeText(c.closest('.code-header').nextElementSibling.innerText).then(() => {
      c.textContent = 'Copiato ✓'; c.classList.add('copied'); toast('Codice copiato');
      setTimeout(() => { c.textContent = 'Copia'; c.classList.remove('copied'); }, 1800);
    });
  }
});

function toast(t) {
  const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d);
  requestAnimationFrame(() => d.classList.add('show'));
  setTimeout(() => { d.classList.remove('show'); setTimeout(() => d.remove(), 400); }, 1600);
}

/* ---------- Stato connessione ---------- */
/* Riflette esattamente i campi restituiti da /api/status in server.py:
   { ollama, model, model_name, pulling, pull_percent, warming, starting, error } */
async function checkStatus() {
  const L = window.ITI_LLM;
  if (!L) { el.badge.className = 'status-badge loading'; el.status.textContent = 'Avvio...'; return setTimeout(checkStatus, 500); }
  const st = L.state;
  el.badge.className = 'status-badge ' + (st.state === 'ready' ? 'online' : st.state === 'basic' ? 'offline' : 'loading');
  el.status.textContent = st.text;
  if (st.state === 'loading') setTimeout(checkStatus, 400);
}

/* ---------- Messaggi ---------- */
const time = () => new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

function addMessage(role, html = '', t = time()) {
  el.welcome.remove();
  showBg(false); // in chat niente foto/video di sfondo
  $('new-chat-btn').classList.add('show');
  const m = document.createElement('div'); m.className = 'message ' + role;
  m.innerHTML = `<div class="msg-avatar">${role === 'user' ? 'Tu' : `<img src="${LOGO}" alt="">`}</div>
    <div class="msg-body"><div class="msg-bubble">${html}</div><span class="msg-time">${t}</span></div>`;
  el.msgs.appendChild(m); scrollDown(true);
  return m.querySelector('.msg-bubble');
}

const plain = h => h.map(({ role, content }) => ({ role, content }));
const nearBottom = () => el.viewport.scrollHeight - el.viewport.scrollTop - el.viewport.clientHeight < 120;
function scrollDown(force) { if (force || nearBottom()) el.viewport.scrollTo({ top: el.viewport.scrollHeight }); }
el.viewport.addEventListener('scroll', () => el.down.classList.toggle('show', !nearBottom()));
el.down.onclick = () => el.viewport.scrollTo({ top: el.viewport.scrollHeight, behavior: 'smooth' });

function showError(msg) {
  const d = document.createElement('div'); d.className = 'error-banner'; d.innerHTML = `⚠️ <span>${esc(msg)}</span>`;
  el.msgs.appendChild(d); scrollDown(true);
}

function setBusy(b) {
  busy = b;
  el.send.disabled = false; // resta cliccabile: durante l'invio serve per fermare la risposta
  el.send.classList.toggle('busy', b);
  el.send.textContent = b ? '■' : '➤';
  el.send.title = b ? 'Ferma la risposta' : 'Invia messaggio';
}

function stopGeneration() { if (controller) controller.abort(); }

/* estrae il testo da un chunk SSE, qualunque formato usi il server */
function chunkText(d) {
  if (d === '[DONE]') return null;
  try { const j = JSON.parse(d);
    return j.token ?? j.content ?? j.response ?? j.text ?? j.delta ?? j.message?.content ?? j.choices?.[0]?.delta?.content ?? ''; }
  catch { return d; }
}

async function* stream(text) {
  controller = new AbortController();
  yield* window.ITI_LLM.chat(history.map(m => ({ role: m.role, content: m.content })), controller.signal);
}

async function send(text) {
  text = (text ?? el.input.value).trim();
  if (!text || busy) return;
  el.input.value = ''; el.input.style.height = 'auto';
  addMessage('user', `<p>${esc(text)}</p>`); history.push({ role: 'user', content: text, t: time() }); persist();
  setBusy(true);
  const bubble = addMessage('assistant', '<div class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>');
  let full = '';
  try {
    for await (const t of stream(text)) {
      full += t; bubble.classList.add('streaming'); bubble.innerHTML = renderMarkdown(full); scrollDown();
    }
    if (!full) bubble.innerHTML = '<p>Nessuna risposta ricevuta.</p>';
    history.push({ role: 'assistant', content: full, t: time() });
  } catch (e) {
    if (e.name !== 'AbortError') { bubble.closest('.message').remove(); showError(e.message || 'Impossibile contattare il server.'); checkStatus(); }
  } finally { bubble.classList.remove('streaming'); setBusy(false); controller = null; persist(); el.input.focus(); }
}

/* ---------- Input ---------- */
el.send.onclick = () => (busy ? stopGeneration() : send());
el.input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(); } });
el.input.addEventListener('input', () => { el.input.style.height = 'auto'; el.input.style.height = Math.min(el.input.scrollHeight, 150) + 'px'; });


/* ---------- Menu conversazioni (dal logo) ----------
   Le conversazioni sono salvate nel browser (localStorage), non sul server. */
const STORE = 'iti4future.conversations', MAX_CONVS = 50;
const brand = $('brand'), brandBtn = $('brand-btn'), convList = $('conv-list');

const loadConvs = () => { try { const a = JSON.parse(localStorage.getItem(STORE)); return Array.isArray(a) ? a : []; } catch { return []; } };
const saveConvs = a => { try { localStorage.setItem(STORE, JSON.stringify(a.slice(0, MAX_CONVS))); } catch { /* storage pieno o bloccato */ } };

function persist() {
  if (!history.length) return;
  const convs = loadConvs(); let c = convs.find(x => x.id === currentId);
  if (!c) {
    c = { id: currentId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6), title: '' };
    convs.unshift(c);
  }
  const first = history.find(m => m.role === 'user');
  c.title = (first ? first.content : 'Conversazione').replace(/\s+/g, ' ').trim().slice(0, 60);
  c.ts = Date.now(); c.messages = history.map(m => ({ ...m }));
  convs.sort((a, b) => b.ts - a.ts); saveConvs(convs); renderMenu();
}

function fmtDate(ts) {
  const d = new Date(ts), now = new Date(), day = 864e5;
  const diff = Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / day);
  if (diff === 0) return 'Oggi · ' + d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  if (diff === 1) return 'Ieri';
  if (diff < 7) return d.toLocaleDateString('it-IT', { weekday: 'long' });
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: d.getFullYear() === now.getFullYear() ? undefined : 'numeric' });
}

function renderMenu() {
  const convs = loadConvs();
  convList.innerHTML = convs.length ? '' : '<div class="conv-empty">Nessuna conversazione salvata</div>';
  for (const c of convs) {
    const row = document.createElement('div'); row.className = 'conv-row' + (c.id === currentId ? ' active' : '');
    row.innerHTML = `<button class="conv-item" role="menuitem" data-id="${c.id}"><span class="conv-title">${esc(c.title)}</span><span class="conv-date">${esc(fmtDate(c.ts))}</span></button>
      <button class="conv-del" data-del="${c.id}" title="Elimina conversazione" aria-label="Elimina conversazione">✕</button>`;
    convList.appendChild(row);
  }
}

function openConv(id) {
  const c = loadConvs().find(x => x.id === id); if (!c) return;
  if (controller) controller.abort();
  busy = false; setBusy(false);
  history = c.messages.map(m => ({ ...m })); currentId = c.id;
  el.msgs.innerHTML = '';
  for (const m of history) addMessage(m.role, m.role === 'user' ? `<p>${esc(m.content)}</p>` : renderMarkdown(m.content), m.t);
  closeMenu(); renderMenu(); scrollDown(true); el.input.focus();
}

function deleteConv(id) {
  saveConvs(loadConvs().filter(x => x.id !== id));
  if (id === currentId) $('new-chat-btn').click(); else renderMenu();
  toast('Conversazione eliminata');
}

function openMenu() { renderMenu(); brand.classList.add('open'); brandBtn.setAttribute('aria-expanded', 'true'); }
function closeMenu() { brand.classList.remove('open'); brandBtn.setAttribute('aria-expanded', 'false'); }

brandBtn.onclick = () => (brand.classList.contains('open') ? closeMenu() : openMenu());
$('conv-new').onclick = () => $('new-chat-btn').click();
convList.addEventListener('click', e => {
  const del = e.target.closest('[data-del]');
  if (del) {
    if (del.classList.contains('confirm')) return deleteConv(del.dataset.del);   // secondo clic: elimina davvero
    del.classList.add('confirm'); del.textContent = 'Elimina?';
    setTimeout(() => { del.classList.remove('confirm'); del.textContent = '✕'; }, 2500);
    return;
  }
  const it = e.target.closest('[data-id]'); if (it) openConv(it.dataset.id);
});
document.addEventListener('click', e => { if (!brand.contains(e.target)) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && brand.classList.contains('open')) { closeMenu(); brandBtn.focus(); } });
renderMenu();

checkStatus(); el.input.focus();

/* ---------- Effetti extra ---------- */
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

// riflettore che segue il mouse con inerzia (movimento morbido, non a scatti)
if (!still) {
  const mc = document.querySelector('.main-content'); let tx = 0, ty = 0, x = 0, y = 0, on = false;
  mc.addEventListener('pointermove', e => { const r = mc.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; if (!on) { x = tx; y = ty; on = true; loop(); } });
  const loop = () => { x += (tx - x) * .06; y += (ty - y) * .06; mc.style.setProperty('--mx', x + 'px'); mc.style.setProperty('--my', y + 'px'); requestAnimationFrame(loop); };
}

// onda sul pulsante invio
el.send.addEventListener('pointerdown', e => {
  if (still) return;
  const r = el.send.getBoundingClientRect(), s = document.createElement('span'); s.className = 'ripple';
  s.style.cssText = `width:20px;height:20px;left:${e.clientX - r.left - 10}px;top:${e.clientY - r.top - 10}px`;
  el.send.appendChild(s); setTimeout(() => s.remove(), 650);
});

// suggerimenti che "si scrivono" da soli nel campo di testo
const HINTS = ['Quali indirizzi ci sono all\'ITI G. Caso?', 'Quale indirizzo è adatto a me?', 'Cosa posso fare dopo il diploma?', 'Come mi iscrivo?', 'Aiutami con un errore in Python...'];
(async function typeHints() {
  if (still) return;
  const base = el.input.placeholder; let i = 0;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  for (;;) {
    const t = HINTS[i++ % HINTS.length];
    for (let k = 1; k <= t.length; k++) { if (el.input.value || document.activeElement === el.input) break; el.input.placeholder = t.slice(0, k) + '▍'; await wait(55 + Math.random() * 75); }
    if (el.input.value || document.activeElement === el.input) { el.input.placeholder = base; await wait(1500); continue; }
    el.input.placeholder = t; await wait(2200);
    for (let k = t.length; k >= 0; k--) { if (el.input.value || document.activeElement === el.input) break; el.input.placeholder = t.slice(0, k) + '▍'; await wait(16 + Math.random() * 20); }
  }
})();

/* ---------- Titolo e sottotitolo: comparsa parola per parola ---------- */
(function splitText() {
  let n = 0, k = 0;
  const walk = (node, base, step) => [...node.childNodes].forEach(c => {
    if (c.nodeType === 3) {
      const f = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(t => {
        if (!t.trim()) return f.append(t);
        const s = document.createElement('span'); s.className = 'w';
        s.style.setProperty('--d', (base + n++ * step).toFixed(2) + 's'); s.style.setProperty('--k', k++);
        s.textContent = t; f.append(s);
      });
      c.replaceWith(f);
    } else walk(c, base, step);
  });
  const h = document.querySelector('.greeting-text'), p = document.querySelector('.sub-greeting');
  if (!h || !p) return;
  h.setAttribute('aria-label', h.textContent); p.setAttribute('aria-label', p.textContent);
  walk(h, .5, .16); const after = .5 + n * .16 + .15; n = 0; walk(p, after, .045);
  h.classList.add('split'); p.classList.add('split');
})();

/* ---------- Intro: nero + logo che si dissolve sul posto, poi (dopo una pausa) compare la home ---------- */
(function intro() {
  const it = $('intro'); let done = false;
  const open = () => { if (done) return; done = true; document.body.classList.add('ready'); };
  const end = () => { open(); it && it.remove(); };
  if (still || !it) { end(); return; }
  const t = setTimeout(open, 3900);               // logo sparito (3,4s) -> pausa -> parte la home col suo logo
  it.addEventListener('animationend', e => { if (e.target === it) end(); });
  it.addEventListener('click', () => { clearTimeout(t); open(); it.classList.add('skip'); });
  setTimeout(end, 6000);                           // rete di sicurezza
})();
