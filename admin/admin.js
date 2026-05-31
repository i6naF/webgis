/* ===== Site Admin Dashboard logic (v2) =====
   100% client-side. Single source of truth = site-config.json in the repo,
   edited via the GitHub Contents API. Analytics from GoatCounter, speed from
   Google PageSpeed. No secrets in this file. */

(() => {
'use strict';

const CFG = {
  repo: 'i6naF/webgis',
  configFile: 'site-config.json',
  legacyMaintFile: 'maintenance.json',  // kept in sync for the old shim
  branch: 'main',
  siteUrl: 'https://i6naf.github.io/webgis/',
};

const LS = {
  pwd:'admin_pwd_hash_v1', ghTok:'admin_gh_token_v1',
  gc:'admin_goatcounter_v1', gcTok:'admin_goatcounter_token_v1',
  psi:'admin_psi_key_v1', theme:'admin_theme_v1', log:'admin_log_v1',
};
const SS_STATS = 'admin_stats_cache_v1';
const DEFAULT_GC = 'webgis-i6na';

const SECTIONS = [
  {id:'about', name:'عن التخصص', icon:'fa-circle-info'},
  {id:'devices', name:'الأجهزة الموصى بها', icon:'fa-laptop'},
  {id:'gis-file-converter', name:'محول ملفات GIS', icon:'fa-file-export'},
  {id:'software', name:'البرمجيات', icon:'fa-laptop-code'},
  {id:'spatial-data-hub', name:'مستودع البيانات', icon:'fa-database'},
  {id:'utm-crs-calculator', name:'حاسبة UTM', icon:'fa-calculator'},
  {id:'courses', name:'الدورات الموصى بها', icon:'fa-graduation-cap'},
  {id:'tips', name:'نصائح ذهبية', icon:'fa-lightbulb'},
  {id:'mistakes', name:'أخطاء شائعة', icon:'fa-triangle-exclamation'},
  {id:'vision-future', name:'رؤية 2030 والمستقبل', icon:'fa-gem'},
  {id:'x-community', name:'مجتمع X', icon:'fa-x-twitter'},
];

// ---------- helpers ----------
const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const fmt = n => (n==null||isNaN(n))?'—':Number(n).toLocaleString('ar-EG');
async function sha256(str){
  const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(str));
  return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
}
function toast(msg,type=''){
  const t=$('#toast');
  const ic=type==='ok'?'fa-circle-check':type==='err'?'fa-circle-exclamation':'fa-circle-info';
  t.innerHTML=`<i class="fa-solid ${ic}"></i> ${msg}`; t.className='toast '+type; t.hidden=false;
  clearTimeout(toast._t); toast._t=setTimeout(()=>t.hidden=true,3400);
}
const b64encode = obj => btoa(unescape(encodeURIComponent(typeof obj==='string'?obj:JSON.stringify(obj,null,2))));
const b64decode = s => decodeURIComponent(escape(atob(s)));

// ---------- activity log ----------
function logAction(icon, text){
  const arr=JSON.parse(localStorage.getItem(LS.log)||'[]');
  arr.unshift({icon, text, t:Date.now()});
  localStorage.setItem(LS.log, JSON.stringify(arr.slice(0,50)));
  if (!$('#dashboard').hidden) renderLog();
}
function renderLog(){
  const arr=JSON.parse(localStorage.getItem(LS.log)||'[]');
  const el=$('#logList'); if(!el) return;
  if(!arr.length){ el.innerHTML='<li class="empty" style="justify-content:center;padding:24px;color:var(--text-muted)">— لا توجد عمليات بعد —</li>'; return; }
  el.innerHTML=arr.map(a=>`<li><span class="log-ic"><i class="fa-solid ${a.icon}"></i></span>
    <div class="log-body">${a.text}<div class="log-time">${new Date(a.t).toLocaleString('ar-EG')}</div></div></li>`).join('');
}

// ===================================================================
// AUTH
// ===================================================================
const loginScreen=$('#loginScreen'), dashboard=$('#dashboard'),
      loginForm=$('#loginForm'), pwInput=$('#passwordInput'), loginError=$('#loginError');
const isFirstRun=()=>!localStorage.getItem(LS.pwd);

function refreshLoginCopy(){
  const title=loginScreen.querySelector('h1'), btn=loginForm.querySelector('button');
  if(isFirstRun()){
    title.textContent='إنشاء كلمة المرور'; pwInput.placeholder='اختر كلمة مرور قوية'; pwInput.autocomplete='new-password';
    btn.innerHTML='<i class="fa-solid fa-key"></i> تعيين كلمة المرور';
    loginError.textContent='أول مرة — اختر كلمة المرور التي ستدخل بها لاحقاً.'; loginError.style.color='var(--text-muted)';
  }else{
    title.textContent='لوحة التحكم'; pwInput.placeholder='كلمة المرور'; pwInput.autocomplete='current-password';
    btn.innerHTML='<i class="fa-solid fa-right-to-bracket"></i> دخول'; loginError.textContent=''; loginError.style.color='';
  }
}
loginForm.addEventListener('submit',async e=>{
  e.preventDefault(); const val=pwInput.value;
  if(isFirstRun()){
    if(val.length<8){loginError.style.color='var(--danger)';loginError.textContent='كلمة المرور قصيرة (8 أحرف على الأقل).';return;}
    localStorage.setItem(LS.pwd,await sha256(val)); toast('تم تعيين كلمة المرور','ok'); enterDashboard();
  }else{
    if((await sha256(val))===localStorage.getItem(LS.pwd)) enterDashboard();
    else{loginError.style.color='var(--danger)';loginError.textContent='كلمة المرور غير صحيحة.';pwInput.value='';}
  }
});
function enterDashboard(){ sessionStorage.setItem('admin_authed','1'); loginScreen.hidden=true; dashboard.hidden=false; pwInput.value=''; initDashboard(); }
$('#logoutBtn').addEventListener('click',()=>{ sessionStorage.removeItem('admin_authed'); dashboard.hidden=true; loginScreen.hidden=false; refreshLoginCopy(); });

// ===================================================================
// NAVIGATION
// ===================================================================
const titles={overview:'نظرة عامة',analytics:'الزوار',performance:'الأداء والتوفر',maintenance:'الصيانة',content:'المحتوى',site:'معلومات الموقع',log:'السجل',settings:'الإعدادات'};
function showView(name){
  $$('.nav-link[data-view]').forEach(l=>l.classList.toggle('active',l.dataset.view===name));
  $$('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===name));
  $('#viewTitle').textContent=titles[name]||'';
  $('.sidebar').classList.remove('open');
  if(name==='site') loadSiteInfo();
  if(name==='log') renderLog();
}
function wireNav(){
  $$('.nav-link[data-view]').forEach(l=>l.addEventListener('click',e=>{e.preventDefault();showView(l.dataset.view);}));
  $$('[data-jump]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();showView(b.dataset.jump);}));
  $('#menuToggle')?.addEventListener('click',()=>$('.sidebar').classList.toggle('open'));
  // sub-tabs
  $$('.subtab').forEach(t=>t.addEventListener('click',()=>{
    const grp=t.parentElement; const sub=t.dataset.sub;
    $$('.subtab',grp).forEach(x=>x.classList.toggle('active',x===t));
    const scope=grp.closest('.view');
    $$('.subview',scope).forEach(v=>v.classList.toggle('active',v.dataset.sub===sub));
  }));
}

// ===================================================================
// GITHUB API  (config read/write)
// ===================================================================
function ghToken(){ return localStorage.getItem(LS.ghTok)||''; }
async function ghGet(path){
  const h={'Accept':'application/vnd.github+json'}; if(ghToken()) h.Authorization='Bearer '+ghToken();
  const r=await fetch(`https://api.github.com/repos/${CFG.repo}/${path}`,{headers:h});
  if(!r.ok) throw new Error('gh-'+r.status); return r.json();
}
async function ghPutFile(path, contentObj, message, shaRef){
  const tok=ghToken(); if(!tok) throw new Error('no-token');
  let sha=shaRef;
  if(!sha){ try{ const f=await ghGet(`contents/${path}?ref=${CFG.branch}`); sha=f.sha; }catch{} }
  const body={message, content:b64encode(contentObj), branch:CFG.branch}; if(sha) body.sha=sha;
  const r=await fetch(`https://api.github.com/repos/${CFG.repo}/contents/${path}`,{
    method:'PUT', headers:{'Accept':'application/vnd.github+json','Authorization':'Bearer '+tok,'Content-Type':'application/json'},
    body:JSON.stringify(body)});
  if(!r.ok){ const e=await r.json().catch(()=>({})); throw new Error(e.message||('HTTP '+r.status)); }
  return (await r.json()).content.sha;
}

// ===================================================================
// SITE CONFIG  (the heart of v2)
// ===================================================================
let CONFIG=null, configSha=null;
const defaultConfig=()=>({
  maintenance:{enabled:false,message:'نعتذر، الموقع تحت الصيانة حالياً. نعود إليكم قريباً بإذن الله.',schedule:{enabled:false,from:'',to:''}},
  announcement:{enabled:false,text:'',type:'info',link:'',linkText:''},
  hiddenSections:[], updated:''
});
async function loadConfig(){
  try{
    const r=await fetch('../site-config.json?_='+Date.now(),{cache:'no-store'});
    if(r.ok) CONFIG=await r.json();
  }catch{}
  if(!CONFIG) CONFIG=defaultConfig();
  // backfill missing keys
  CONFIG={...defaultConfig(),...CONFIG};
  CONFIG.maintenance={...defaultConfig().maintenance,...(CONFIG.maintenance||{})};
  CONFIG.maintenance.schedule={...defaultConfig().maintenance.schedule,...(CONFIG.maintenance.schedule||{})};
  CONFIG.announcement={...defaultConfig().announcement,...(CONFIG.announcement||{})};
  if(ghToken()){ try{ const f=await ghGet(`contents/${CFG.configFile}?ref=${CFG.branch}`); configSha=f.sha; CONFIG={...CONFIG,...JSON.parse(b64decode(f.content))}; }catch{} }
  applyConfigToUI();
}
function effectiveMaintenance(){
  const m=CONFIG.maintenance;
  if(m.enabled) return true;
  if(m.schedule&&m.schedule.enabled&&m.schedule.from&&m.schedule.to){
    const now=Date.now(); return now>=Date.parse(m.schedule.from)&&now<=Date.parse(m.schedule.to);
  }
  return false;
}
async function saveConfig(commitMsg){
  const tok=ghToken();
  CONFIG.updated=new Date().toISOString();
  // keep legacy maintenance.json in sync so the existing shim keeps working
  const legacy={enabled:effectiveMaintenance(),message:CONFIG.maintenance.message,updated:CONFIG.updated};
  if(!tok){
    try{ await navigator.clipboard.writeText(JSON.stringify(CONFIG,null,2)); }catch{}
    applyConfigToUI();
    toast('لا يوجد رمز GitHub — نُسخت الإعدادات للحافظة. الصقها في site-config.json يدوياً.','err');
    return false;
  }
  configSha=await ghPutFile(CFG.configFile, CONFIG, commitMsg, configSha);
  try{ await ghPutFile(CFG.legacyMaintFile, legacy, 'chore: sync maintenance flag'); }catch{}
  applyConfigToUI();
  return true;
}
function applyConfigToUI(){
  const on=effectiveMaintenance();
  // status pill + overview
  const pill=$('#siteStatusPill'); pill.className='status-pill '+(on?'status-maint':'status-online'); pill.querySelector('span').textContent=on?'صيانة':'يعمل';
  $('#ov-status').textContent=on?'صيانة':'يعمل';
  $('#ov-status-icon').className='stat-icon '+(on?'red':'green');
  // maintenance tab
  $('#maintToggle').checked=CONFIG.maintenance.enabled;
  $('#maintMessage').value=CONFIG.maintenance.message||'';
  $('#maintLed').classList.toggle('on',on);
  $('#maintStatusTitle').textContent=on?'الموقع مغلق للصيانة':'الموقع يعمل بشكل طبيعي';
  $('#maintStatusDesc').textContent=on?'الزوار يشاهدون شاشة الصيانة الآن.':'الزوار يستطيعون الوصول للموقع الآن.';
  const sc=CONFIG.maintenance.schedule;
  $('#schedToggle').checked=!!sc.enabled; $('#schedFields').hidden=!sc.enabled;
  if(sc.from)$('#schedFrom').value=sc.from; if(sc.to)$('#schedTo').value=sc.to;
  $('#maintTokenWarn').hidden=!!ghToken();
  // announcement
  const a=CONFIG.announcement;
  $('#annToggle').checked=!!a.enabled; $('#annText').value=a.text||'';
  $('#annLink').value=a.link||''; $('#annLinkText').value=a.linkText||'';
  const rt=$(`input[name=annType][value="${a.type||'info'}"]`); if(rt)rt.checked=true;
  updateAnnPreview();
  // sections
  renderSectionList();
}

// ===================================================================
// MAINTENANCE TAB
// ===================================================================
function wireMaintenance(){
  $('#maintToggle').addEventListener('change',()=>$('#maintLed').classList.toggle('on',$('#maintToggle').checked));
  $('#schedToggle').addEventListener('change',()=>$('#schedFields').hidden=!$('#schedToggle').checked);
  $('#maintSaveBtn').addEventListener('click',async()=>{
    CONFIG.maintenance.enabled=$('#maintToggle').checked;
    CONFIG.maintenance.message=$('#maintMessage').value.trim();
    CONFIG.maintenance.schedule={enabled:$('#schedToggle').checked,from:$('#schedFrom').value,to:$('#schedTo').value};
    const btn=$('#maintSaveBtn'),o=btn.innerHTML; btn.disabled=true; btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> جارٍ النشر...';
    try{
      if(await saveConfig(`chore: ${effectiveMaintenance()?'enable':'disable'} maintenance`)){
        toast(effectiveMaintenance()?'تم تفعيل الصيانة (دقيقة للنشر)':'الموقع يعمل الآن','ok');
        logAction('fa-screwdriver-wrench', effectiveMaintenance()?'فعّل وضع الصيانة':'أوقف وضع الصيانة');
      }
    }catch(e){ toast('فشل الحفظ: '+e.message,'err'); }
    finally{ btn.disabled=false; btn.innerHTML=o; }
  });
  $('#maintPreviewBtn').addEventListener('click',()=>{ $('#previewMsg').textContent=$('#maintMessage').value||'—'; $('#previewModal').hidden=false; });
  $('#previewClose').addEventListener('click',()=>$('#previewModal').hidden=true);
  $('#previewModal').addEventListener('click',e=>{if(e.target.id==='previewModal')$('#previewModal').hidden=true;});
}

// ===================================================================
// ANNOUNCEMENT TAB
// ===================================================================
function updateAnnPreview(){
  const text=$('#annText').value.trim()||'—';
  const type=$('input[name=annType]:checked')?.value||'info';
  const link=$('#annLink').value.trim(), linkText=$('#annLinkText').value.trim()||'اضغط هنا';
  const ic=type==='success'?'fa-circle-check':type==='warning'?'fa-triangle-exclamation':'fa-circle-info';
  const p=$('#annPreview'); p.className='ann-bar '+type;
  p.innerHTML=`<i class="fa-solid ${ic}"></i> <span>${text}</span>`+(link?` <a href="${link}" target="_blank">${linkText}</a>`:'');
}
function wireAnnouncement(){
  ['#annText','#annLink','#annLinkText'].forEach(s=>$(s).addEventListener('input',updateAnnPreview));
  $$('input[name=annType]').forEach(r=>r.addEventListener('change',updateAnnPreview));
  $('#annSaveBtn').addEventListener('click',async()=>{
    CONFIG.announcement={enabled:$('#annToggle').checked,text:$('#annText').value.trim(),
      type:$('input[name=annType]:checked').value,link:$('#annLink').value.trim(),linkText:$('#annLinkText').value.trim()};
    const btn=$('#annSaveBtn'),o=btn.innerHTML; btn.disabled=true; btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> جارٍ النشر...';
    try{ if(await saveConfig('chore: update announcement banner')){ toast('تم نشر الإعلان','ok'); logAction('fa-bullhorn', CONFIG.announcement.enabled?'نشر إعلاناً للزوار':'أوقف شريط الإعلان'); } }
    catch(e){ toast('فشل: '+e.message,'err'); }
    finally{ btn.disabled=false; btn.innerHTML=o; }
  });
}

// ===================================================================
// SECTIONS TAB
// ===================================================================
function renderSectionList(){
  const hidden=CONFIG.hiddenSections||[];
  $('#secList').innerHTML=SECTIONS.map(s=>{
    const off=hidden.includes(s.id);
    return `<div class="sec-item ${off?'hidden-sec':''}">
      <i class="fa-solid ${s.icon}"></i>
      <span class="sec-name">${s.name}</span>
      <span class="sec-state ${off?'off':'on'}">${off?'مخفي':'ظاهر'}</span>
      <label class="switch"><input type="checkbox" data-sec="${s.id}" ${off?'':'checked'}><span class="slider"></span></label>
    </div>`;
  }).join('');
  $$('#secList input[data-sec]').forEach(c=>c.addEventListener('change',()=>{
    const item=c.closest('.sec-item'); const st=$('.sec-state',item);
    item.classList.toggle('hidden-sec',!c.checked);
    st.className='sec-state '+(c.checked?'on':'off'); st.textContent=c.checked?'ظاهر':'مخفي';
  }));
}
function wireSections(){
  $('#secSaveBtn').addEventListener('click',async()=>{
    CONFIG.hiddenSections=$$('#secList input[data-sec]').filter(c=>!c.checked).map(c=>c.dataset.sec);
    const btn=$('#secSaveBtn'),o=btn.innerHTML; btn.disabled=true; btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> جارٍ النشر...';
    try{ if(await saveConfig('chore: update visible sections')){ toast('تم تحديث الأقسام','ok'); logAction('fa-eye-slash',`عدّل الأقسام (${CONFIG.hiddenSections.length} مخفي)`); } }
    catch(e){ toast('فشل: '+e.message,'err'); }
    finally{ btn.disabled=false; btn.innerHTML=o; }
  });
}

// ===================================================================
// ANALYTICS  (GoatCounter)
// ===================================================================
function gcCode(){ return localStorage.getItem(LS.gc)||DEFAULT_GC; }
function gcTokenV(){ return localStorage.getItem(LS.gcTok)||''; }
async function gcApi(path){
  const code=gcCode(),tok=gcTokenV(); if(!code||!tok) throw new Error('no-api-token');
  const r=await fetch(`https://${code}.goatcounter.com/api/v0${path}`,{headers:{'Authorization':'Bearer '+tok,'Content-Type':'application/json'}});
  if(!r.ok) throw new Error('gc-'+r.status); return r.json();
}
async function gcPublicTotal(){
  try{ const r=await fetch(`https://${gcCode()}.goatcounter.com/counter/TOTAL.json`); if(!r.ok)return null;
    const j=await r.json(); const num=s=>parseInt(String(s||'').replace(/[^\d]/g,''),10)||0;
    return {count:num(j.count),unique:num(j.count_unique)};
  }catch{ return null; }
}
function demoSeries(days){
  const out=[],today=new Date();
  for(let i=days-1;i>=0;i--){const d=new Date(today);d.setDate(d.getDate()-i);
    const base=18+Math.round(14*Math.sin(i/3))+Math.round(Math.random()*10);
    out.push({date:d,count:Math.max(3,base+([5,6].includes(d.getDay())?-6:0))});}
  return out;
}
function summarize(series,top,total,demo){
  const n=series.length, today=series[n-1]?.count||0, yest=series[n-2]?.count||0;
  const week=series.slice(-7).reduce((a,b)=>a+b.count,0), prevWeek=series.slice(-14,-7).reduce((a,b)=>a+b.count,0);
  const wd=[0,0,0,0,0,0,0], wdNames=['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  series.forEach(s=>wd[s.date.getDay()]+=s.count);
  const weekdays=wd.map((c,i)=>({name:wdNames[i],count:c})).sort((a,b)=>b.count-a.count);
  return {series,top:top||[],today,yesterday:yest,week,prevWeek,total:total!=null?total:series.reduce((a,b)=>a+b.count,0),weekdays,demo};
}
async function getStats(){
  const cached=JSON.parse(sessionStorage.getItem(SS_STATS)||'null');
  if(cached&&Date.now()-cached.t<5*60*1000) return cached.data;
  const pub=await gcPublicTotal(); let data;
  if(gcTokenV()){
    try{
      const end=new Date(),start=new Date();start.setDate(start.getDate()-29);
      const iso=d=>d.toISOString().slice(0,10);
      const hits=await gcApi(`/stats/total?start=${iso(start)}&end=${iso(end)}`);
      const paths=await gcApi(`/stats/hits?start=${iso(start)}&end=${iso(end)}&limit=8`).catch(()=>({hits:[]}));
      const series=(hits.stats||[]).map(s=>({date:new Date(s.day||s.date),count:s.daily||s.count||0}));
      const top=(paths.hits||[]).map(h=>({name:h.path||h.name,count:h.count||h.count_unique||0}));
      data=summarize(series.length?series:demoSeries(30),top,pub?pub.count:hits.total,false);
    }catch(e){ data=summarize(demoSeries(30),[],pub?pub.count:null,true); data.error=String(e.message||e); }
  }else{
    data=summarize(demoSeries(30),[
      {name:'/',count:642},{name:'/#spatial-data-hub',count:318},{name:'/#courses',count:147},
      {name:'/#software',count:96},{name:'/#about',count:54}],pub?pub.count:null,true);
  }
  sessionStorage.setItem(SS_STATS,JSON.stringify({t:Date.now(),data}));
  return data;
}
function deltaBadge(el,cur,prev){
  const e=$(el); if(!e)return;
  if(!prev){e.className='delta flat';e.textContent='—';return;}
  const pct=Math.round((cur-prev)/prev*100);
  if(pct>0){e.className='delta up';e.innerHTML=`<i class="fa-solid fa-arrow-up"></i> ${pct}%`;}
  else if(pct<0){e.className='delta down';e.innerHTML=`<i class="fa-solid fa-arrow-down"></i> ${Math.abs(pct)}%`;}
  else{e.className='delta flat';e.textContent='0%';}
}
let chart14=null,chart30=null,deviceChart=null;
function drawLine(id,series,ref){
  const ctx=$('#'+id); if(!ctx||!window.Chart) return ref; if(ref)ref.destroy();
  const g=ctx.getContext('2d').createLinearGradient(0,0,0,160);
  g.addColorStop(0,'rgba(16,185,129,.45)'); g.addColorStop(1,'rgba(16,185,129,0)');
  return new Chart(ctx,{type:'line',
    data:{labels:series.map(s=>s.date.toLocaleDateString('ar-EG',{day:'numeric',month:'short'})),
      datasets:[{data:series.map(s=>s.count),borderColor:'#10b981',backgroundColor:g,fill:true,tension:.4,borderWidth:2.5,pointRadius:0,pointHoverRadius:5,pointHoverBackgroundColor:'#f59e0b'}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#162340',titleColor:'#e2e8f0',bodyColor:'#cbd5e1',borderColor:'rgba(0,242,254,.2)',borderWidth:1,padding:10,displayColors:false}},
      scales:{x:{grid:{display:false},ticks:{color:'#889ec1',maxTicksLimit:7,font:{family:'Tajawal'}}},y:{grid:{color:'rgba(136,158,193,.08)'},ticks:{color:'#889ec1',precision:0,font:{family:'Tajawal'}},beginAtZero:true}}}});
}
function rankList(id,items,unit=''){
  const el=$('#'+id); if(!el)return;
  if(!items||!items.length){el.innerHTML='<li class="empty">— لا توجد بيانات —</li>';return;}
  el.innerHTML=items.map(i=>`<li><span class="rl-name" title="${i.name}">${i.name}</span><span class="rl-val">${fmt(i.count)}${unit}</span></li>`).join('');
}
function drawDevices(stats){
  const ctx=$('#deviceChart'); if(!ctx||!window.Chart)return; if(deviceChart)deviceChart.destroy();
  const colors=['#10b981','#00f2fe','#f59e0b'];
  deviceChart=new Chart(ctx,{type:'doughnut',
    data:{labels:stats.map(s=>s.name),datasets:[{data:stats.map(s=>s.count),backgroundColor:colors,borderColor:'#0f182c',borderWidth:3}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'65%',plugins:{legend:{display:false}}}});
  $('#an-devices-legend').innerHTML=stats.map((s,i)=>`<div class="dl"><span class="dot" style="background:${colors[i]}"></span>${s.name} — <b style="margin-inline-start:4px">${fmt(s.count)}</b></div>`).join('');
}
async function loadAnalytics(){
  const s=await getStats();
  $('#ov-today').textContent=fmt(s.today); $('#ov-week').textContent=fmt(s.week); $('#ov-total').textContent=fmt(s.total);
  $('#an-today').textContent=fmt(s.today); $('#an-yesterday').textContent=fmt(s.yesterday);
  $('#an-week').textContent=fmt(s.week); $('#an-total').textContent=fmt(s.total);
  deltaBadge('#ov-week-delta',s.week,s.prevWeek); deltaBadge('#an-week-delta',s.week,s.prevWeek);
  chart14=drawLine('miniChart',s.series.slice(-14),chart14);
  chart30=drawLine('bigChart',s.series,chart30);
  rankList('ov-toppages',s.top.slice(0,5)); rankList('an-toppages',s.top);
  rankList('an-weekdays',s.weekdays);
  $('#analyticsUnconfigured').hidden=!s.demo;
  // tech + devices (need API token)
  if(gcTokenV()){
    gcApi('/stats/browsers?limit=6').then(d=>rankList('an-browsers',(d.stats||[]).map(x=>({name:x.name||x.id,count:x.count})))).catch(()=>rankList('an-browsers',[]));
    gcApi('/stats/systems?limit=6').then(d=>rankList('an-systems',(d.stats||[]).map(x=>({name:x.name||x.id,count:x.count})))).catch(()=>rankList('an-systems',[]));
    gcApi('/stats/locations?limit=6').then(d=>rankList('an-countries',(d.stats||[]).map(x=>({name:x.name||x.id,count:x.count})))).catch(()=>rankList('an-countries',[]));
    gcApi('/stats/sizes').then(d=>{
      const map={phone:'جوال',largephone:'جوال',tablet:'لوحي',desktop:'كمبيوتر',width:'كمبيوتر'};
      const agg={};(d.stats||[]).forEach(x=>{const k=map[x.id]||map[(x.name||'').toLowerCase()]||'أخرى';agg[k]=(agg[k]||0)+x.count;});
      const arr=Object.entries(agg).map(([name,count])=>({name,count})); drawDevices(arr.length?arr:[{name:'كمبيوتر',count:1}]);
    }).catch(()=>drawDevices([{name:'جوال',count:60},{name:'كمبيوتر',count:35},{name:'لوحي',count:5}]));
  }else{
    rankList('an-browsers',[{name:'Chrome',count:512},{name:'Safari',count:198},{name:'Edge',count:64},{name:'Firefox',count:31}]);
    rankList('an-systems',[{name:'Android',count:341},{name:'Windows',count:248},{name:'iOS',count:142},{name:'macOS',count:74}]);
    rankList('an-countries',[{name:'السعودية',count:712},{name:'مصر',count:118},{name:'الإمارات',count:64},{name:'غير معروف',count:41}]);
    drawDevices([{name:'جوال',count:60},{name:'كمبيوتر',count:35},{name:'لوحي',count:5}]);
  }
}

// ===================================================================
// PERFORMANCE + UPTIME
// ===================================================================
function wirePerformance(){
  $('#pingBtn').addEventListener('click',pingSite);
  $('#psiBtn').addEventListener('click',runPSI);
}
async function pingSite(){
  const led=$('#uptimeLed'),title=$('#uptimeTitle'),desc=$('#uptimeDesc');
  led.className='uptime-led checking'; led.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>';
  title.textContent='جارٍ الفحص...'; desc.textContent='';
  const t0=performance.now();
  try{
    await fetch(CFG.siteUrl+'?_='+Date.now(),{mode:'no-cors',cache:'no-store'});
    const ms=Math.round(performance.now()-t0);
    led.className='uptime-led up'; led.innerHTML='<i class="fa-solid fa-check"></i>';
    title.textContent='الموقع يعمل ✓'; desc.textContent=`زمن الاستجابة: ${ms} مللي ثانية · آخر فحص ${new Date().toLocaleTimeString('ar-EG')}`;
    logAction('fa-heart-pulse',`فحص التوفر: يعمل (${ms}ms)`);
  }catch(e){
    led.className='uptime-led down'; led.innerHTML='<i class="fa-solid fa-xmark"></i>';
    title.textContent='تعذّر الوصول'; desc.textContent='قد يكون الموقع متوقفاً أو هناك مشكلة بالشبكة.';
    logAction('fa-heart-pulse','فحص التوفر: تعذّر الوصول');
  }
}
async function runPSI(){
  const btn=$('#psiBtn'),o=btn.innerHTML; btn.disabled=true; btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> جارٍ القياس...';
  $('#psiEmpty').textContent='جارٍ القياس من Google... (قد يستغرق 30 ثانية)';
  try{
    const key=localStorage.getItem(LS.psi)||'';
    let url=`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(CFG.siteUrl)}&strategy=mobile&category=performance`;
    if(key) url+='&key='+key;
    const r=await fetch(url); if(!r.ok) throw new Error('HTTP '+r.status);
    const j=await r.json();
    const score=Math.round((j.lighthouseResult.categories.performance.score||0)*100);
    const a=j.lighthouseResult.audits;
    $('#psiEmpty').hidden=true; $('#psiResult').hidden=false;
    $('#psiScore').textContent=score;
    const arc=$('#gaugeArc'),C=427; arc.style.strokeDashoffset=C-(C*score/100);
    arc.style.stroke=score>=90?'#10b981':score>=50?'#f59e0b':'#ef4444';
    $('#psiScore').style.color=score>=90?'#34d399':score>=50?'#fbbf24':'#fca5a5';
    $('#psi-fcp').textContent=a['first-contentful-paint']?.displayValue||'—';
    $('#psi-lcp').textContent=a['largest-contentful-paint']?.displayValue||'—';
    $('#psi-tbt').textContent=a['total-blocking-time']?.displayValue||'—';
    $('#psi-cls').textContent=a['cumulative-layout-shift']?.displayValue||'—';
    logAction('fa-gauge-high',`قاس الأداء: ${score}/100`);
    toast('تم قياس الأداء','ok');
  }catch(e){ $('#psiEmpty').hidden=false; $('#psiEmpty').textContent='تعذّر القياس: '+e.message+'. حاول مرة أخرى.'; toast('فشل القياس','err'); }
  finally{ btn.disabled=false; btn.innerHTML=o; }
}

// ===================================================================
// SITE INFO
// ===================================================================
let siteInfoLoaded=false;
async function loadSiteInfo(){
  if(siteInfoLoaded)return; siteInfoLoaded=true;
  $('#si-repolink').href=`https://github.com/${CFG.repo}`;
  $('#si-lastcheck').textContent=new Date().toLocaleString('ar-EG');
  try{ const r=await ghGet('');
    $('#si-repo').textContent=r.full_name; $('#si-updated').textContent=new Date(r.pushed_at).toLocaleString('ar-EG');
    $('#si-stars').textContent=fmt(r.stargazers_count); $('#si-visibility').textContent=r.private?'خاص':'عام';
  }catch{ $('#si-repo').textContent=CFG.repo; $('#si-visibility').textContent='عام'; }
  try{ const c=await ghGet('commits?per_page=6');
    $('#commitList').innerHTML=c.map(x=>`<li><span class="commit-msg">${(x.commit.message||'').split('\n')[0]}</span>
      <span class="commit-meta"><span class="commit-sha">${x.sha.slice(0,7)}</span><span>${x.commit.author?.name||''}</span><span>${new Date(x.commit.author?.date).toLocaleDateString('ar-EG')}</span></span></li>`).join('');
  }catch{ $('#commitList').innerHTML='<li class="empty">— أضف رمز GitHub في الإعدادات —</li>'; }
}

// ===================================================================
// SETTINGS
// ===================================================================
function wireSettings(){
  const tok=$('#ghToken'),tokSt=$('#ghTokenState');
  if(ghToken())tokSt.textContent='✓ رمز محفوظ في هذا المتصفح';
  $('#saveTokenBtn').addEventListener('click',()=>{const v=tok.value.trim();if(!v){toast('الصق الرمز','err');return;}
    localStorage.setItem(LS.ghTok,v);tok.value='';tokSt.textContent='✓ تم الحفظ';toast('تم حفظ رمز GitHub','ok');configSha=null;siteInfoLoaded=false;loadConfig();});
  $('#clearTokenBtn').addEventListener('click',()=>{localStorage.removeItem(LS.ghTok);tokSt.textContent='تم الحذف';toast('تم الحذف','ok');});
  const gc=$('#gcCode'),gcSt=$('#gcState'); gc.value=gcCode(); gcSt.textContent=`✓ مرتبط بـ ${gcCode()}.goatcounter.com`;
  $('#saveGcBtn').addEventListener('click',()=>{const v=gc.value.trim().replace(/\..*$/,'').replace(/^https?:\/\//,'');if(!v){toast('اكتب الاسم','err');return;}
    localStorage.setItem(LS.gc,v);gcSt.textContent=`✓ مرتبط بـ ${v}.goatcounter.com`;sessionStorage.removeItem(SS_STATS);toast('تم','ok');loadAnalytics();});
  const gt=$('#gcToken'),gtSt=$('#gcTokenState'); if(gcTokenV())gtSt.textContent='✓ مفتاح API محفوظ — التفاصيل مفعّلة';
  $('#saveGcTokBtn').addEventListener('click',()=>{const v=gt.value.trim();if(!v){toast('الصق المفتاح','err');return;}
    localStorage.setItem(LS.gcTok,v);gt.value='';gtSt.textContent='✓ تم الحفظ';sessionStorage.removeItem(SS_STATS);toast('تم حفظ مفتاح API','ok');loadAnalytics();});
  const pk=$('#psiKey'),pkSt=$('#psiKeyState'); if(localStorage.getItem(LS.psi))pkSt.textContent='✓ مفتاح محفوظ';
  $('#savePsiBtn').addEventListener('click',()=>{const v=pk.value.trim();if(v)localStorage.setItem(LS.psi,v);else localStorage.removeItem(LS.psi);pk.value='';pkSt.textContent=v?'✓ تم الحفظ':'تم الحذف';toast('تم','ok');});
  $('#forgetBtn').addEventListener('click',()=>{if(!confirm('سيتم مسح كلمة المرور والرموز والإعدادات من هذا المتصفح. متأكد؟'))return;
    Object.values(LS).forEach(k=>localStorage.removeItem(k));sessionStorage.clear();toast('تم المسح','ok');setTimeout(()=>location.reload(),700);});
}

// ===================================================================
// THEME
// ===================================================================
function applyTheme(t){ document.body.classList.toggle('light',t==='light'); $('#themeBtn').innerHTML=`<i class="fa-solid fa-${t==='light'?'sun':'moon'}"></i>`; }
function wireTheme(){
  applyTheme(localStorage.getItem(LS.theme)||'dark');
  $('#themeBtn').addEventListener('click',()=>{const cur=document.body.classList.contains('light')?'light':'dark';const next=cur==='light'?'dark':'light';localStorage.setItem(LS.theme,next);applyTheme(next);});
}

// ===================================================================
// MISC
// ===================================================================
function wireMisc(){
  const refresh=()=>{sessionStorage.removeItem(SS_STATS);loadAnalytics();loadConfig();toast('تم التحديث','ok');};
  $('#refreshBtn').addEventListener('click',refresh);
  $('#qa-refresh').addEventListener('click',refresh);
  $('#clearLogBtn').addEventListener('click',()=>{localStorage.removeItem(LS.log);renderLog();toast('تم مسح السجل','ok');});
}

// ===================================================================
// INIT
// ===================================================================
// ===================================================================
// PWA — install (A2HS), offline feedback, theme-color sync, mobile backdrop, deep-link
// ===================================================================
let deferredPrompt=null;
const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent);
function setThemeColor(){ const m=$('meta[name="theme-color"]'); if(m) m.setAttribute('content',document.body.classList.contains('light')?'#f1f5f9':'#070b13'); }
function openViewFromHash(){ const h=(location.hash||'').slice(1); if(!h) return; const l=$(`.nav-link[data-view="${h}"]`); if(l) l.click(); }

addEventListener('beforeinstallprompt',e=>{ e.preventDefault(); deferredPrompt=e; const b=$('#installBtn'); if(b&&!isStandalone()) b.hidden=false; });
addEventListener('appinstalled',()=>{ deferredPrompt=null; const b=$('#installBtn'); if(b) b.hidden=true; toast('تم تثبيت التطبيق ✓','ok'); logAction('fa-download','ثبّت اللوحة كتطبيق'); });

function wirePWA(){
  // keep the OS status-bar colour in sync with the active theme
  setThemeColor();
  new MutationObserver(setThemeColor).observe(document.body,{attributes:true,attributeFilter:['class']});

  // install button (Add to Home Screen) — Chromium prompt, or iOS Share-sheet hint
  const installBtn=$('#installBtn');
  if(installBtn){
    installBtn.addEventListener('click',async()=>{
      if(deferredPrompt){
        deferredPrompt.prompt();
        try{ await deferredPrompt.userChoice; }catch(_){}
        deferredPrompt=null; installBtn.hidden=true;
      }else if(isIOS()){
        toast('للتثبيت على iPhone: زر المشاركة ⬆️ ثم «أضف إلى الشاشة الرئيسية»','ok');
      }
    });
    if(isIOS()&&!isStandalone()) installBtn.hidden=false;
  }

  // mobile sidebar backdrop — dim + close on outside-tap / Esc (decoupled from the menu toggle)
  const sb=$('.sidebar'), bd=$('#sidebarBackdrop');
  if(sb&&bd){
    new MutationObserver(()=>{ bd.hidden=!sb.classList.contains('open'); }).observe(sb,{attributes:true,attributeFilter:['class']});
    bd.addEventListener('click',()=>sb.classList.remove('open'));
    addEventListener('keydown',e=>{ if(e.key==='Escape') sb.classList.remove('open'); });
  }

  // connectivity feedback
  addEventListener('offline',()=>toast('انقطع الاتصال — تعمل الآن أوفلاين','err'));
  addEventListener('online',()=>toast('عاد الاتصال بالإنترنت','ok'));
}

// ===================================================================
// INIT
// ===================================================================
let dashInited=false;
function initDashboard(){
  if(dashInited)return; dashInited=true;
  wireNav(); wireSettings(); wireMaintenance(); wireAnnouncement(); wireSections();
  wirePerformance(); wireTheme(); wireMisc(); wirePWA();
  loadAnalytics(); loadConfig(); renderLog();
  openViewFromHash();
  // register service worker for PWA (admin scope only)
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').then(reg=>{
      reg.addEventListener('updatefound',()=>{
        const nw=reg.installing;
        nw&&nw.addEventListener('statechange',()=>{
          if(nw.state==='installed'&&navigator.serviceWorker.controller) toast('تم تحديث اللوحة — حدّث الصفحة لتطبيقه','ok');
        });
      });
    }).catch(()=>{});
  }
}

refreshLoginCopy();
applyTheme(localStorage.getItem(LS.theme)||'dark');
if(sessionStorage.getItem('admin_authed')==='1'&&!isFirstRun()) enterDashboard();

})();
