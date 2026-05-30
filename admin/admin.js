/* ===== Site Admin Dashboard logic =====
   100% client-side. Talks to GoatCounter (stats) and GitHub (maintenance toggle).
   No secrets in this file: the password hash and tokens live in the browser only. */

(() => {
'use strict';

const CFG = {
  repo: 'i6naF/webgis',                 // owner/repo
  maintenanceFile: 'maintenance.json',  // path in repo
  branch: 'main',
  siteUrl: 'https://i6naf.github.io/webgis/',
};

const LS = {
  pwd:   'admin_pwd_hash_v1',
  ghTok: 'admin_gh_token_v1',
  gc:    'admin_goatcounter_v1',
  gcTok: 'admin_goatcounter_token_v1',
};
const SS_STATS = 'admin_stats_cache_v1';
const DEFAULT_GC = 'webgis-i6na';   // this site's existing GoatCounter account

// ---------- helpers ----------
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const fmt = n => (n==null || isNaN(n)) ? '—' : Number(n).toLocaleString('ar-EG');

async function sha256(str){
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
function toast(msg, type=''){
  const t = $('#toast');
  const icon = type==='ok' ? 'fa-circle-check' : type==='err' ? 'fa-circle-exclamation' : 'fa-circle-info';
  t.innerHTML = `<i class="fa-solid ${icon}"></i> ${msg}`;
  t.className = 'toast ' + type; t.hidden = false;
  clearTimeout(toast._t); toast._t = setTimeout(()=>{ t.hidden = true; }, 3200);
}

// ===================================================================
// AUTH  (first run = set password; later = login)
// ===================================================================
const loginScreen = $('#loginScreen');
const dashboard   = $('#dashboard');
const loginForm   = $('#loginForm');
const pwInput     = $('#passwordInput');
const loginError  = $('#loginError');

function isFirstRun(){ return !localStorage.getItem(LS.pwd); }

function refreshLoginCopy(){
  const title = loginScreen.querySelector('h1');
  const btn   = loginForm.querySelector('button');
  if (isFirstRun()){
    title.textContent = 'إنشاء كلمة المرور';
    pwInput.placeholder = 'اختر كلمة مرور قوية (16+ حرف)';
    pwInput.autocomplete = 'new-password';
    btn.innerHTML = '<i class="fa-solid fa-key"></i> تعيين كلمة المرور';
    loginError.textContent = 'هذه أول مرة — اختر كلمة المرور التي ستستخدمها للدخول لاحقاً.';
    loginError.style.color = 'var(--text-muted)';
  } else {
    title.textContent = 'لوحة التحكم';
    pwInput.placeholder = 'كلمة المرور';
    pwInput.autocomplete = 'current-password';
    btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> دخول';
    loginError.textContent = ''; loginError.style.color = '';
  }
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const val = pwInput.value;
  if (isFirstRun()){
    if (val.length < 8){ loginError.style.color='var(--danger)'; loginError.textContent = 'كلمة المرور قصيرة جداً (8 أحرف على الأقل).'; return; }
    localStorage.setItem(LS.pwd, await sha256(val));
    toast('تم تعيين كلمة المرور', 'ok');
    enterDashboard();
  } else {
    const ok = (await sha256(val)) === localStorage.getItem(LS.pwd);
    if (ok){ enterDashboard(); }
    else { loginError.style.color='var(--danger)'; loginError.textContent = 'كلمة المرور غير صحيحة.'; pwInput.value=''; }
  }
});

function enterDashboard(){
  sessionStorage.setItem('admin_authed','1');
  loginScreen.hidden = true;
  dashboard.hidden = false;
  pwInput.value = '';
  initDashboard();
}

$('#logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('admin_authed');
  dashboard.hidden = true;
  loginScreen.hidden = false;
  refreshLoginCopy();
});

// ===================================================================
// NAVIGATION
// ===================================================================
const titles = {overview:'نظرة عامة', analytics:'الزوار', maintenance:'الصيانة', site:'معلومات الموقع', settings:'الإعدادات'};
function showView(name){
  $$('.nav-link[data-view]').forEach(l => l.classList.toggle('active', l.dataset.view===name));
  $$('.view').forEach(v => v.classList.toggle('active', v.dataset.view===name));
  $('#viewTitle').textContent = titles[name] || '';
  $('.sidebar').classList.remove('open');
  if (name==='site') loadSiteInfo();
}
function wireNav(){
  $$('.nav-link[data-view]').forEach(l => l.addEventListener('click', e => { e.preventDefault(); showView(l.dataset.view); }));
  $$('[data-jump]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); showView(b.dataset.jump); }));
  $('#menuToggle')?.addEventListener('click', () => $('.sidebar').classList.toggle('open'));
}

// ===================================================================
// ANALYTICS  (GoatCounter, with demo fallback)
// ===================================================================
function gcCode(){ return localStorage.getItem(LS.gc) || DEFAULT_GC; }
function gcToken(){ return localStorage.getItem(LS.gcTok) || ''; }

// API endpoints (need a read-stats token). Used for daily breakdown + top pages.
async function gcApi(path){
  const code = gcCode(); const tok = gcToken();
  if (!code || !tok) throw new Error('no-api-token');
  const res = await fetch(`https://${code}.goatcounter.com/api/v0${path}`, {
    headers:{'Authorization':'Bearer '+tok, 'Content-Type':'application/json'}
  });
  if (!res.ok) throw new Error('gc-'+res.status);
  return res.json();
}

// Public visitor counter — no token, CORS-enabled. Gives the REAL site total.
async function gcPublicTotal(){
  const code = gcCode(); if (!code) return null;
  try{
    const res = await fetch(`https://${code}.goatcounter.com/counter/TOTAL.json`);
    if (!res.ok) return null;
    const j = await res.json();
    const num = s => parseInt(String(s||'').replace(/[^\d]/g,''),10) || 0;
    return { count: num(j.count), unique: num(j.count_unique) };
  }catch{ return null; }
}

// Build a demo series so the dashboard looks alive before GoatCounter is connected.
function demoSeries(days){
  const out=[]; const today=new Date();
  for(let i=days-1;i>=0;i--){
    const d=new Date(today); d.setDate(d.getDate()-i);
    const base = 18 + Math.round(14*Math.sin(i/3)) + Math.round(Math.random()*10);
    const weekend = [5,6].includes(d.getDay()) ? -6 : 0;
    out.push({date:d, count:Math.max(3, base+weekend)});
  }
  return out;
}

async function getStats(){
  const cached = JSON.parse(sessionStorage.getItem(SS_STATS) || 'null');
  if (cached && Date.now()-cached.t < 5*60*1000) return cached.data;

  const pub = await gcPublicTotal();   // REAL total, no token required
  let data;
  if (gcToken()){
    try{
      // Daily buckets + top paths over the last 30 days (needs API token).
      const end = new Date(); const start = new Date(); start.setDate(start.getDate()-29);
      const iso = d => d.toISOString().slice(0,10);
      const hits = await gcApi(`/stats/total?start=${iso(start)}&end=${iso(end)}`);
      const paths = await gcApi(`/stats/hits?start=${iso(start)}&end=${iso(end)}&limit=8`).catch(()=>({hits:[]}));
      const series = (hits.stats||[]).map(s => ({date:new Date(s.day||s.date), count:s.daily||s.count||0}));
      const top = (paths.hits||[]).map(h => ({name:h.path||h.name, count:h.count||h.count_unique||0}));
      data = buildSummary(series.length?series:demoSeries(30), top, pub?pub.count:hits.total, false);
    }catch(err){
      data = buildSummary(demoSeries(30), [], pub?pub.count:null, true);
      data.error = String(err.message||err);
    }
  } else {
    // No API token: show the REAL total, but daily/top stay illustrative (banner explains).
    data = buildSummary(demoSeries(30), [
      {name:'/', count:642},{name:'/#spatial-data-hub', count:318},{name:'/#courses', count:147},
      {name:'/#software', count:96},{name:'/#about', count:54}
    ], pub?pub.count:null, true);
  }
  data.realTotal = !!pub;
  sessionStorage.setItem(SS_STATS, JSON.stringify({t:Date.now(), data}));
  return data;
}

function buildSummary(series, top, total, demo){
  const n = series.length;
  const today = series[n-1]?.count || 0;
  const yesterday = series[n-2]?.count || 0;
  const week = series.slice(-7).reduce((a,b)=>a+b.count,0);
  const sum = series.reduce((a,b)=>a+b.count,0);
  return {
    series, top: top||[],
    today, yesterday, week,
    total: total!=null ? total : sum,
    demo
  };
}

let chart14=null, chart30=null;
function drawChart(canvasId, series, ref){
  const ctx = $('#'+canvasId);
  if (!ctx || !window.Chart) return ref;
  if (ref) ref.destroy();
  const grad = ctx.getContext('2d').createLinearGradient(0,0,0,160);
  grad.addColorStop(0,'rgba(16,185,129,.45)'); grad.addColorStop(1,'rgba(16,185,129,0)');
  return new Chart(ctx, {
    type:'line',
    data:{ labels: series.map(s=>s.date.toLocaleDateString('ar-EG',{day:'numeric',month:'short'})),
      datasets:[{ data:series.map(s=>s.count), borderColor:'#10b981', backgroundColor:grad,
        fill:true, tension:.4, borderWidth:2.5, pointRadius:0, pointHoverRadius:5, pointHoverBackgroundColor:'#f59e0b' }] },
    options:{ responsive:true, maintainAspectRatio:false,
      plugins:{legend:{display:false}, tooltip:{backgroundColor:'#1a2235',titleColor:'#f8fafc',bodyColor:'#cbd5e1',borderColor:'rgba(148,163,184,.2)',borderWidth:1,padding:10,displayColors:false}},
      scales:{ x:{grid:{display:false},ticks:{color:'#94a3b8',maxTicksLimit:7,font:{family:'Tajawal'}}},
        y:{grid:{color:'rgba(148,163,184,.08)'},ticks:{color:'#94a3b8',precision:0,font:{family:'Tajawal'}},beginAtZero:true} } }
  });
}

function renderRankList(elId, items, unit=''){
  const el = $('#'+elId); if(!el) return;
  if(!items || !items.length){ el.innerHTML = '<li class="empty">— لا توجد بيانات —</li>'; return; }
  const max = Math.max(...items.map(i=>i.count));
  el.innerHTML = items.map(i=>{
    const pct = max? Math.round(i.count/max*100):0;
    return `<li><span class="rl-name" title="${i.name}">${i.name}</span>
      <span class="rl-val">${fmt(i.count)}${unit}</span></li>`;
  }).join('');
}

async function loadAnalytics(){
  const s = await getStats();
  // overview cards
  $('#ov-today').textContent = fmt(s.today);
  $('#ov-week').textContent  = fmt(s.week);
  $('#ov-total').textContent = fmt(s.total);
  // analytics cards
  $('#an-today').textContent = fmt(s.today);
  $('#an-yesterday').textContent = fmt(s.yesterday);
  $('#an-week').textContent = fmt(s.week);
  $('#an-total').textContent = fmt(s.total);
  // charts
  chart14 = drawChart('miniChart', s.series.slice(-14), chart14);
  chart30 = drawChart('bigChart',  s.series, chart30);
  // lists
  renderRankList('ov-toppages', s.top.slice(0,5));
  renderRankList('an-toppages', s.top);
  // unconfigured banner (shown when detailed data is still illustrative)
  $('#analyticsUnconfigured').hidden = !s.demo;
  // countries (best-effort, needs API token)
  if (gcToken()){
    try{
      const c = await gcApi('/stats/locations?limit=6');
      renderRankList('an-countries', (c.stats||[]).map(x=>({name:x.name||x.id, count:x.count})));
    }catch{ renderRankList('an-countries', []); }
  } else {
    renderRankList('an-countries', [
      {name:'السعودية', count:712},{name:'مصر', count:118},{name:'الإمارات', count:64},{name:'غير معروف', count:41}
    ]);
  }
}

// ===================================================================
// MAINTENANCE  (reads/writes maintenance.json via GitHub API)
// ===================================================================
function ghToken(){ return localStorage.getItem(LS.ghTok) || ''; }
let maintSha = null;

async function ghGet(path){
  const headers = {'Accept':'application/vnd.github+json'};
  if (ghToken()) headers.Authorization = 'Bearer '+ghToken();
  const res = await fetch(`https://api.github.com/repos/${CFG.repo}/${path}`, {headers});
  if (!res.ok) throw new Error('gh-'+res.status);
  return res.json();
}

async function loadMaintenance(){
  // Prefer the live file (works even without a token, since the repo is public)
  let m = {enabled:false, message:''};
  try{
    const res = await fetch('../maintenance.json?_=' + Date.now());
    if (res.ok) m = await res.json();
  }catch{}
  applyMaintUI(m);

  // Also get the blob SHA (needed to write back) if a token exists
  if (ghToken()){
    try{
      const file = await ghGet(`contents/${CFG.maintenanceFile}?ref=${CFG.branch}`);
      maintSha = file.sha;
      const decoded = JSON.parse(decodeURIComponent(escape(atob(file.content))));
      applyMaintUI(decoded);
    }catch(e){ /* keep live-file values */ }
  }
  $('#maintTokenWarn').hidden = !!ghToken();
}

function applyMaintUI(m){
  const on = !!m.enabled;
  $('#maintToggle').checked = on;
  $('#maintMessage').value = m.message || $('#maintMessage').value;
  $('#maintLed').classList.toggle('on', on);
  $('#maintStatusTitle').textContent = on ? 'الموقع مغلق للصيانة' : 'الموقع يعمل بشكل طبيعي';
  $('#maintStatusDesc').textContent  = on ? 'الزوار يشاهدون شاشة الصيانة الآن.' : 'الزوار يستطيعون الوصول للموقع الآن.';
  // top + overview status
  const pill = $('#siteStatusPill');
  pill.className = 'status-pill ' + (on?'status-maint':'status-online');
  pill.querySelector('span').textContent = on ? 'صيانة' : 'يعمل';
  $('#ov-status').textContent = on ? 'صيانة' : 'يعمل';
  const ovIcon = $('#ov-status-icon');
  ovIcon.className = 'stat-icon ' + (on?'red':'green');
}

async function saveMaintenance(){
  const tok = ghToken();
  const payload = {
    enabled: $('#maintToggle').checked,
    message: $('#maintMessage').value.trim(),
    until: '',
    updated: new Date().toISOString()
  };
  if (!tok){
    // No token: copy JSON to clipboard so the user can paste it manually.
    const txt = JSON.stringify(payload, null, 2);
    try{ await navigator.clipboard.writeText(txt); }catch{}
    applyMaintUI(payload);
    toast('لا يوجد رمز GitHub — نُسخت القيم للحافظة. الصقها في maintenance.json يدوياً.', 'err');
    return;
  }
  const btn = $('#maintSaveBtn'); const orig = btn.innerHTML;
  btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جارٍ النشر...';
  try{
    // Make sure we have a fresh SHA
    if (!maintSha){
      const file = await ghGet(`contents/${CFG.maintenanceFile}?ref=${CFG.branch}`);
      maintSha = file.sha;
    }
    const body = {
      message: `chore: ${payload.enabled?'enable':'disable'} maintenance mode`,
      content: btoa(unescape(encodeURIComponent(JSON.stringify(payload, null, 2)))),
      sha: maintSha, branch: CFG.branch
    };
    const res = await fetch(`https://api.github.com/repos/${CFG.repo}/contents/${CFG.maintenanceFile}`, {
      method:'PUT',
      headers:{'Accept':'application/vnd.github+json','Authorization':'Bearer '+tok,'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    if (!res.ok){ const er = await res.json().catch(()=>({})); throw new Error(er.message||('HTTP '+res.status)); }
    const out = await res.json();
    maintSha = out.content.sha;
    applyMaintUI(payload);
    toast(payload.enabled ? 'تم إغلاق الموقع للصيانة (يستغرق دقيقة للنشر)' : 'تم إعادة الموقع للعمل', 'ok');
  }catch(e){
    toast('فشل الحفظ: ' + e.message, 'err');
  }finally{
    btn.disabled = false; btn.innerHTML = orig;
  }
}

// ===================================================================
// SITE INFO  (GitHub API)
// ===================================================================
let siteInfoLoaded = false;
async function loadSiteInfo(){
  if (siteInfoLoaded) return; siteInfoLoaded = true;
  $('#si-repolink').href = `https://github.com/${CFG.repo}`;
  $('#si-lastcheck').textContent = new Date().toLocaleString('ar-EG');
  try{
    const r = await ghGet('');
    $('#si-repo').textContent = r.full_name;
    $('#si-updated').textContent = new Date(r.pushed_at).toLocaleString('ar-EG');
    $('#si-stars').textContent = fmt(r.stargazers_count);
    $('#si-visibility').textContent = r.private ? 'خاص' : 'عام';
  }catch{
    $('#si-repo').textContent = CFG.repo;
    $('#si-visibility').textContent = 'عام';
  }
  try{
    const commits = await ghGet('commits?per_page=6');
    $('#commitList').innerHTML = commits.map(c => `
      <li>
        <span class="commit-msg">${(c.commit.message||'').split('\n')[0]}</span>
        <span class="commit-meta">
          <span class="commit-sha">${c.sha.slice(0,7)}</span>
          <span>${c.commit.author?.name||''}</span>
          <span>${new Date(c.commit.author?.date).toLocaleDateString('ar-EG')}</span>
        </span>
      </li>`).join('');
  }catch{
    $('#commitList').innerHTML = '<li class="empty">— أضف رمز GitHub في الإعدادات لعرض السجل —</li>';
  }
}

// ===================================================================
// SETTINGS
// ===================================================================
function wireSettings(){
  // GitHub token
  const tokInput = $('#ghToken'); const tokState = $('#ghTokenState');
  if (ghToken()){ tokState.textContent = '✓ رمز محفوظ في هذا المتصفح'; }
  $('#saveTokenBtn').addEventListener('click', () => {
    const v = tokInput.value.trim();
    if(!v){ toast('الصق الرمز أولاً','err'); return; }
    localStorage.setItem(LS.ghTok, v); tokInput.value='';
    tokState.textContent = '✓ تم الحفظ'; toast('تم حفظ رمز GitHub','ok');
    maintSha=null; siteInfoLoaded=false; loadMaintenance();
  });
  $('#clearTokenBtn').addEventListener('click', () => {
    localStorage.removeItem(LS.ghTok); tokState.textContent='تم الحذف'; toast('تم حذف الرمز','ok');
    loadMaintenance();
  });
  // GoatCounter account code
  const gcInput = $('#gcCode'); const gcStateEl = $('#gcState');
  gcInput.value = gcCode();
  gcStateEl.textContent = `✓ مرتبط بـ ${gcCode()}.goatcounter.com (الإجمالي يُقرأ تلقائياً)`;
  $('#saveGcBtn').addEventListener('click', () => {
    const v = gcInput.value.trim().replace(/\..*$/,'').replace(/^https?:\/\//,'');
    if(!v){ toast('اكتب اسم الحساب','err'); return; }
    localStorage.setItem(LS.gc, v); gcStateEl.textContent = `✓ مرتبط بـ ${v}.goatcounter.com`;
    sessionStorage.removeItem(SS_STATS); toast('تم ربط العدّاد','ok'); loadAnalytics();
  });
  // GoatCounter API token (optional — unlocks daily chart, top pages, countries)
  const gcTokInput = $('#gcToken'); const gcTokState = $('#gcTokenState');
  if (gcToken()){ gcTokState.textContent = '✓ مفتاح API محفوظ — البيانات التفصيلية مفعّلة'; }
  $('#saveGcTokBtn')?.addEventListener('click', () => {
    const v = gcTokInput.value.trim();
    if(!v){ toast('الصق مفتاح API','err'); return; }
    localStorage.setItem(LS.gcTok, v); gcTokInput.value='';
    gcTokState.textContent = '✓ تم الحفظ'; sessionStorage.removeItem(SS_STATS);
    toast('تم حفظ مفتاح API','ok'); loadAnalytics();
  });
  // forget all
  $('#forgetBtn').addEventListener('click', () => {
    if(!confirm('سيتم مسح كلمة المرور والرموز والإعدادات من هذا المتصفح. متأكد؟')) return;
    localStorage.removeItem(LS.pwd); localStorage.removeItem(LS.ghTok); localStorage.removeItem(LS.gc);
    sessionStorage.clear(); toast('تم المسح','ok'); setTimeout(()=>location.reload(),700);
  });
}

// ===================================================================
// PREVIEW MODAL + misc wiring
// ===================================================================
function wireMisc(){
  $('#maintSaveBtn').addEventListener('click', saveMaintenance);
  $('#maintToggle').addEventListener('change', () => {
    const on = $('#maintToggle').checked;
    $('#maintLed').classList.toggle('on', on);
  });
  $('#maintPreviewBtn').addEventListener('click', () => {
    $('#previewMsg').textContent = $('#maintMessage').value || '—';
    $('#previewModal').hidden = false;
  });
  $('#previewClose').addEventListener('click', () => $('#previewModal').hidden = true);
  $('#previewModal').addEventListener('click', e => { if(e.target.id==='previewModal') $('#previewModal').hidden=true; });

  const refresh = () => { sessionStorage.removeItem(SS_STATS); loadAnalytics(); loadMaintenance(); toast('تم التحديث','ok'); };
  $('#refreshBtn').addEventListener('click', refresh);
  $('#qa-refresh').addEventListener('click', refresh);
}

// ===================================================================
// INIT
// ===================================================================
let dashInited = false;
function initDashboard(){
  if (dashInited) return; dashInited = true;
  wireNav(); wireSettings(); wireMisc();
  loadAnalytics();
  loadMaintenance();
}

// boot
refreshLoginCopy();
if (sessionStorage.getItem('admin_authed') === '1' && !isFirstRun()){
  enterDashboard();
}

})();
