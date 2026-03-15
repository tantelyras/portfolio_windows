
const $=id=>document.getElementById(id)
let zc=10, saved={}, paintTool='pen', paintColor='#000', paintDrawing=false
let currentLang='en'

/* ═══ WALLPAPER ═══ */
function initWallpaper(){
  const cv=$('wallpaper-canvas'); if(!cv||cv._wi)return; cv._wi=true
  cv.width=window.innerWidth; cv.height=window.innerHeight
  const ctx=cv.getContext('2d'), N=35
  const nodes=Array.from({length:N},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*2+1}))
  function draw(){
    ctx.clearRect(0,0,cv.width,cv.height)
    for(let i=0;i<N;i++){
      const n=nodes[i]; n.x+=n.vx; n.y+=n.vy
      if(n.x<0||n.x>cv.width)n.vx*=-1
      if(n.y<0||n.y>cv.height)n.vy*=-1
      for(let j=i+1;j<N;j++){
        const m=nodes[j],dx=n.x-m.x,dy=n.y-m.y,d=Math.sqrt(dx*dx+dy*dy)
        if(d<120){ctx.beginPath();ctx.strokeStyle=`rgba(180,120,60,${(1-d/120)*0.28})`;ctx.lineWidth=.5;ctx.moveTo(n.x,n.y);ctx.lineTo(m.x,m.y);ctx.stroke()}
      }
      ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fillStyle='rgba(200,140,60,.55)';ctx.fill()
    }
    requestAnimationFrame(draw)
  }
  draw()
  window.addEventListener('resize',()=>{cv.width=window.innerWidth;cv.height=window.innerHeight})
}

/* ═══ CLOCK ═══ */
function tick(){
  const n=new Date()
  const t=n.getHours().toString().padStart(2,'0')+':'+n.getMinutes().toString().padStart(2,'0')
  const daysEN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const monthsEN=['January','February','March','April','May','June','July','August','September','October','November','December']
  const daysFR=['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
  const monthsFR=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
  const days=currentLang==='fr'?daysFR:daysEN
  const months=currentLang==='fr'?monthsFR:monthsEN
  const ds=days[n.getDay()]+' '+n.getDate()+' '+months[n.getMonth()]+' '+n.getFullYear()
  const sd=String(n.getDate()).padStart(2,'0')+'/'+String(n.getMonth()+1).padStart(2,'0')+'/'+n.getFullYear()
  const lt=$('l-time');if(lt)lt.textContent=t
  const ld=$('l-date');if(ld)ld.textContent=ds
  const tt=$('tray-time');if(tt)tt.textContent=t
  const td=$('tray-date');if(td)td.textContent=sd
}

/* ═══ SCREENS ═══ */
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));$(id).classList.add('active')}

/* ═══ POWER ACTIONS ═══ */
function doLock(){closePowerMenu();closeStart();show('s-lock')}
function doSleep(){
  closePowerMenu();closeStart()
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'))
  $('s-sleep').classList.add('active')
}
function doLogout(){closePowerMenu();closeStart();show('s-login')}
function doShutdown(){
  closePowerMenu();closeStart()
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'))
  $('s-shutdown').classList.add('active')
  setTimeout(()=>{show('s-boot');setTimeout(()=>{$('s-boot').classList.add('fade-out');setTimeout(()=>show('s-lock'),480)},800)},2000)
}
function doRestart(){doShutdown()}
function closePowerMenu(){$('power-menu').classList.remove('open')}

/* ═══ WINDOWS ═══ */
const WIN_META={
  'w-about':{label:'Profile',color:'#60cdff'},
  'w-skills':{label:'Skills',color:'#b39dff'},
  'w-projects':{label:'Projects',color:'#EF9F27'},
  'w-contact':{label:'Contact',color:'#5DCAA5'},
  'w-experience':{label:'Experience',color:'#e05a4d'},
  'w-formation':{label:'Formation',color:'#5DCAA5'},
  'w-certif':{label:'Certifications',color:'#EF9F27'},
  'w-volontariat':{label:'Volunteering',color:'#378ADD'},
  'w-calc':{label:'Calculator',color:'#60cdff'},
  'w-paint':{label:'Paint',color:'#4dcc48'},
  'w-vscode':{label:'VS Code',color:'#007ACC'},
  'w-chrome':{label:'Chrome',color:'#EA4335'},
  'w-settings':{label:'Settings',color:'#888'}
}
function bringFront(id){zc++;$(id).style.zIndex=zc}
function openWin(id){const el=$(id);if(!el)return;el.classList.remove('minimized');el.classList.add('open');bringFront(id);closeStart();closeAC();closeNotif();refreshTaskbar()}
function closeWin(id){$(id).classList.remove('open','minimized','maximized');refreshTaskbar()}
function minimizeWin(id){$(id).classList.add('minimized');refreshTaskbar()}
function maximizeWin(id){
  const el=$(id);if(!el)return
  const btn=el.querySelector('[data-action="max"] svg')
  if(el.classList.contains('maximized')){
    el.classList.remove('maximized')
    const s=saved[id]||{}
    if(s.top!==undefined)el.style.top=s.top
    if(s.left!==undefined)el.style.left=s.left
    if(s.width!==undefined)el.style.width=s.width
    el.style.height=''
    if(btn)btn.innerHTML='<rect x=".75" y=".75" width="8.5" height="8.5" rx="1.25" stroke="currentColor" stroke-width="1.3" fill="none"/>'
  }else{
    saved[id]={top:el.style.top,left:el.style.left,width:el.style.width}
    el.classList.add('maximized')
    if(btn)btn.innerHTML='<rect x=".75" y="3.25" width="5.5" height="5.5" rx="1" stroke="currentColor" stroke-width="1.3" fill="none"/><rect x="3.75" y=".75" width="5.5" height="5.5" rx="1" stroke="currentColor" stroke-width="1.3" fill="none"/>'
  }
  bringFront(id)
}
function refreshTaskbar(){
  // Pinned apps in taskbar
  const PINNED = ['w-chrome','w-vscode','w-calc','w-paint','w-settings']
  
  // Portfolio/shortcut windows (shown as icons right of start when open)
  const SHORTCUTS = [
    {id:'w-about', color:'#60cdff', label:'Profile',
     svg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill="white"/><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="white" stroke-width="2" fill="none"/></svg>',
     bg:'linear-gradient(135deg,#0078d4,#6b47ed)'},
    {id:'w-skills', color:'#b39dff', label:'Skills',
     svg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="white" stroke-width="2" fill="none"/><line x1="7" y1="11" x2="17" y2="11" stroke="white" stroke-width="1.6"/></svg>',
     bg:'linear-gradient(135deg,#6b47ed,#9b6bff)'},
    {id:'w-projects', color:'#EF9F27', label:'Projects',
     svg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 7h7l2 3h9v11H3z" stroke="white" stroke-width="2" fill="none"/></svg>',
     bg:'linear-gradient(135deg,#854F0B,#EF9F27)'},
    {id:'w-contact', color:'#5DCAA5', label:'Contact',
     svg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" stroke="white" stroke-width="2" fill="none"/><polyline points="2,7 12,14 22,7" stroke="white" stroke-width="1.6" fill="none"/></svg>',
     bg:'linear-gradient(135deg,#0f6e56,#5DCAA5)'},
    {id:'w-experience', color:'#e05a4d', label:'Experience',
     svg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="15" rx="2" stroke="white" stroke-width="2" fill="none"/><path d="M8 7V5a4 4 0 0 1 8 0v2" stroke="white" stroke-width="2" fill="none"/></svg>',
     bg:'linear-gradient(135deg,#c42b1c,#e05a4d)'},
    {id:'w-formation', color:'#5DCAA5', label:'Education',
     svg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3L2 9l10 6 10-6-10-6z" stroke="white" stroke-width="2" fill="none"/></svg>',
     bg:'linear-gradient(135deg,#0f6e56,#1D9E75)'},
    {id:'w-certif', color:'#60cdff', label:'Certifications',
     svg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="6" stroke="white" stroke-width="2" fill="none"/><polyline points="9,10 11.5,12.5 16,8" stroke="white" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg>',
     bg:'linear-gradient(135deg,#185FA5,#60cdff)'},
    {id:'w-volontariat', color:'#378ADD', label:'Volunteering',
     svg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 21s-9-6-9-13a9 9 0 0 1 18 0c0 7-9 13-9 13z" stroke="white" stroke-width="2" fill="none"/></svg>',
     bg:'linear-gradient(135deg,#185FA5,#378ADD)'},
  ]

  // 1. Update dot indicators on pinned taskbar icons
  PINNED.forEach(id => {
    const tbiEl = document.querySelector('.tbi[data-open="'+id+'"]')
    if (!tbiEl) return
    const el = document.getElementById(id)
    el && el.classList.contains('open') ? tbiEl.classList.add('lit') : tbiEl.classList.remove('lit')
  })

  // 2. Update shortcut icons (right of start menu center)
  const sc = document.getElementById('tb-shortcuts')
  if (sc) {
    sc.innerHTML = ''
    SHORTCUTS.forEach(s => {
      const el = document.getElementById(s.id)
      if (!el || !el.classList.contains('open')) return
      const isMin = el.classList.contains('minimized')
      const btn = document.createElement('div')
      btn.className = 'tbi' + (isMin ? '' : ' lit')
      btn.title = s.label
      btn.style.cssText = 'width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;flex-shrink:0'
      btn.innerHTML = '<div style="width:26px;height:26px;border-radius:7px;background:'+s.bg+';display:flex;align-items:center;justify-content:center">'+s.svg+'</div>'
      if (!isMin) {
        const dot = document.createElement('span')
        dot.style.cssText = 'position:absolute;bottom:3px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:'+s.color
        btn.appendChild(dot)
      }
      btn.addEventListener('click', () => {
        el.classList.contains('minimized') ? openWin(s.id) : minimizeWin(s.id)
      })
      sc.appendChild(btn)
    })
  }

  // 3. tb-wins: only for truly extra windows (none by default)
  const c = document.getElementById('tb-wins')
  if (c) c.innerHTML = ''
}
/* ═══ DRAG ═══ */
function makeDraggable(el){
  const tb=el.querySelector('.tbar');if(!tb)return
  tb.addEventListener('mousedown',e=>{
    if(e.target.closest('.wb'))return
    if(el.classList.contains('maximized'))return
    const da=$('desk-area'),dr=da.getBoundingClientRect()
    const sx=e.clientX-el.offsetLeft,sy=e.clientY-el.offsetTop
    bringFront(el.id)
    function mv(e){el.style.left=Math.max(0,Math.min(e.clientX-sx,dr.width-el.offsetWidth))+'px';el.style.top=Math.max(0,Math.min(e.clientY-sy,dr.height-el.offsetHeight))+'px'}
    function up(){document.removeEventListener('mousemove',mv);document.removeEventListener('mouseup',up)}
    document.addEventListener('mousemove',mv);document.addEventListener('mouseup',up);e.preventDefault()
  })
  tb.addEventListener('dblclick',e=>{if(e.target.closest('.wb'))return;maximizeWin(el.id)})
}

/* ═══ RESIZE ═══ */
function addResizeHandles(el){
  ['n','s','e','w','ne','nw','se','sw'].forEach(dir=>{
    const h=document.createElement('div')
    h.className='win-resize-handle '+dir
    h.addEventListener('mousedown',e=>{
      e.stopPropagation();e.preventDefault()
      if(el.classList.contains('maximized'))return
      const sx=e.clientX,sy=e.clientY,sw=el.offsetWidth,sh=el.offsetHeight,sl=el.offsetLeft,st=el.offsetTop
      bringFront(el.id)
      function mv(e){
        const dx=e.clientX-sx,dy=e.clientY-sy
        if(dir.includes('e'))el.style.width=Math.max(280,sw+dx)+'px'
        if(dir.includes('s'))el.style.height=Math.max(200,sh+dy)+'px'
        if(dir.includes('w')){el.style.width=Math.max(280,sw-dx)+'px';el.style.left=sl+sw-parseInt(el.style.width)+'px'}
        if(dir.includes('n')){el.style.height=Math.max(200,sh-dy)+'px';el.style.top=st+sh-parseInt(el.style.height)+'px'}
        const wc=el.querySelector('.wcont');if(wc)wc.style.maxHeight=(el.offsetHeight-36)+'px'
      }
      function up(){document.removeEventListener('mousemove',mv);document.removeEventListener('mouseup',up)}
      document.addEventListener('mousemove',mv);document.addEventListener('mouseup',up)
    })
    el.appendChild(h)
  })
}

/* ═══ DRAGGABLE ICONS ═══ */
function makeDraggableIcon(el){
  el.addEventListener('mousedown',e=>{
    if(e.button!==0)return
    let moved=false
    const da=$('desk-area'),dr=da.getBoundingClientRect()
    const sx=e.clientX-el.offsetLeft,sy=e.clientY-el.offsetTop
    function mv(e){moved=true;el.style.left=Math.max(0,Math.min(e.clientX-sx,dr.width-el.offsetWidth))+'px';el.style.top=Math.max(0,Math.min(e.clientY-sy,dr.height-el.offsetHeight))+'px'}
    function up(){document.removeEventListener('mousemove',mv);document.removeEventListener('mouseup',up);if(!moved){const t=el.dataset.open;if(t)openWin(t)}}
    document.addEventListener('mousemove',mv);document.addEventListener('mouseup',up);e.preventDefault()
  })
}

/* ═══ START MENU ═══ */
function openStart(){
  $('smenu').classList.add('open');$('tb-start').classList.add('start-active')
  setTimeout(()=>{const i=$('sm-search-input');if(i){i.value='';smSearch('');i.focus()}},50)
}
function closeStart(){$('smenu').classList.remove('open');$('tb-start').classList.remove('start-active')}
function toggleStart(){$('smenu').classList.contains('open')?closeStart():openStart()}

const SM_APPS=[
  {id:'w-about',label:'Profile / Profil',desc:'Portfolio profile'},
  {id:'w-skills',label:'Skills / Compétences',desc:'Technical skills'},
  {id:'w-projects',label:'Projects / Projets',desc:'Projects'},
  {id:'w-contact',label:'Contact',desc:'Get in touch'},
  {id:'w-experience',label:'Experience / Expérience',desc:'Work experience'},
  {id:'w-formation',label:'Formation',desc:'Academic background'},
  {id:'w-certif',label:'Certifications',desc:'Certificates'},
  {id:'w-volontariat',label:'Volunteering / Volontariat',desc:'Community work'},
  {id:'w-chrome',label:'Chrome',desc:'Web browser'},
  {id:'w-vscode',label:'VS Code',desc:'Code editor'},
  {id:'w-calc',label:'Calculator / Calculatrice',desc:'Calculator'},
  {id:'w-paint',label:'Paint',desc:'Drawing tool'},
  {id:'w-settings',label:'Settings / Paramètres',desc:'System settings'},
]
function smSearch(q){
  const res=$('sm-results-list'),resCont=$('sm-search-results'),body=$('sm-normal-body')
  if(!q||!q.trim()){resCont.classList.remove('show');body.style.display='flex';return}
  body.style.display='none';resCont.classList.add('show')
  const matches=SM_APPS.filter(a=>a.label.toLowerCase().includes(q.toLowerCase())||a.desc.toLowerCase().includes(q.toLowerCase()))
  if(!matches.length){res.innerHTML=`<div style="color:rgba(255,255,255,.4);font-size:12px;padding:12px;text-align:center">No results for "${q}"</div>`;return}
  res.innerHTML=matches.map(a=>`<div class="sm-res-item" onclick="openWin('${a.id}');closeStart()"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="rgba(255,255,255,.4)" stroke-width="1.2"/><line x1="9.5" y1="9.5" x2="13" y2="13" stroke="rgba(255,255,255,.4)" stroke-width="1.2" stroke-linecap="round"/></svg><div><div style="font-size:12px;color:white">${a.label}</div><div style="font-size:10px;color:rgba(255,255,255,.4)">${a.desc}</div></div></div>`).join('')
}

/* ═══ ACTION/NOTIF CENTER ═══ */
function openAC(){$('action-center').classList.add('open');$('notif-center').classList.remove('open');closePowerMenu()}
function closeAC(){$('action-center').classList.remove('open')}
function openNotif(){$('notif-center').classList.add('open');$('action-center').classList.remove('open');closePowerMenu();buildCal()}
function closeNotif(){$('notif-center').classList.remove('open')}

/* ═══ CALENDAR ═══ */
let calYear=new Date().getFullYear(),calMonth=new Date().getMonth()
function calMove(d){calMonth+=d;if(calMonth>11){calMonth=0;calYear++}if(calMonth<0){calMonth=11;calYear--};buildCal()}
function buildCal(){
  const ms=['January','February','March','April','May','June','July','August','September','October','November','December']
  const msfr=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
  const mt=$('cal-month-title');if(mt)mt.textContent=(currentLang==='fr'?msfr:ms)[calMonth]+' '+calYear
  const g=$('cal-grid');if(!g)return;g.innerHTML=''
  const dn=currentLang==='fr'?['lu','ma','me','je','ve','sa','di']:['mo','tu','we','th','fr','sa','su']
  dn.forEach(d=>{const el=document.createElement('div');el.className='cal-day-name';el.textContent=d;g.appendChild(el)})
  const today=new Date(),first=new Date(calYear,calMonth,1)
  let sd=first.getDay()-1;if(sd<0)sd=6
  const dim=new Date(calYear,calMonth+1,0).getDate()
  const pd=new Date(calYear,calMonth,0).getDate()
  for(let i=sd-1;i>=0;i--){const el=document.createElement('div');el.className='cal-day other-month';el.textContent=pd-i;g.appendChild(el)}
  for(let d=1;d<=dim;d++){const el=document.createElement('div');el.className='cal-day';if(d===today.getDate()&&calMonth===today.getMonth()&&calYear===today.getFullYear())el.classList.add('today');el.textContent=d;g.appendChild(el)}
  const rem=(7-((sd+dim)%7))%7
  for(let d=1;d<=rem;d++){const el=document.createElement('div');el.className='cal-day other-month';el.textContent=d;g.appendChild(el)}
}

/* ═══ BRIGHTNESS ═══ */
function setBrightness(v){
  const bv=$('brightness-val');if(bv)bv.textContent=v+'%'
  const br=$('brightness-range');if(br)br.value=v
  const ab=$('ac-brightness');if(ab)ab.value=v
}

/* ═══ CALCULATOR ═══ */
let cb='',cp='',co='',cn=true
function cd(){const el=$('calc-val');if(el)el.textContent=cb||'0'}
function calcNum(n){if(cn){cb=n;cn=false}else{cb=cb==='0'?n:cb+n};cd()}
function calcDot(){if(cn){cb='0.';cn=false}else if(!cb.includes('.'))cb+='.';cd()}
function calcSign(){cb=cb.startsWith('-')?cb.slice(1):'-'+cb;cd()}
function calcPct(){cb=String(parseFloat(cb)/100);cd()}
function calcOp(op){if(cp&&!cn)calcEq();cp=cb;co=op;cn=true;const el=$('calc-expr');if(el)el.textContent=cb+' '+{'+':'+','-':'-','*':'×','/':'÷'}[op]}
function calcEq(){if(!cp||!co)return;const a=parseFloat(cp),b=parseFloat(cb),r={'+':a+b,'-':a-b,'*':a*b,'/':a/b}[co];const el=$('calc-expr');if(el)el.textContent=cp+' '+{'+':'+','-':'-','*':'×','/':'÷'}[co]+' '+cb+' =';cb=String(parseFloat(r.toFixed(10)));cp='';co='';cn=true;cd()}
function calcAC(){cb='';cp='';co='';cn=true;const el=$('calc-expr');if(el)el.textContent='';cd()}

/* ═══ PAINT ═══ */
function initPaint(){
  const cv=$('paint-canvas');if(!cv||cv._init)return;cv._init=true
  cv.width=cv.parentElement.offsetWidth-16||450
  const ctx=cv.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,cv.width,cv.height)
  cv.addEventListener('mousedown',e=>{paintDrawing=true;const r=cv.getBoundingClientRect();ctx.beginPath();ctx.moveTo(e.clientX-r.left,e.clientY-r.top)})
  cv.addEventListener('mousemove',e=>{if(!paintDrawing)return;const r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,sz=parseInt($('pt-size').value)||4;if(paintTool==='eraser'){ctx.globalCompositeOperation='destination-out';ctx.lineWidth=sz*3}else{ctx.globalCompositeOperation='source-over';ctx.strokeStyle=paintColor;ctx.lineWidth=sz};ctx.lineCap='round';ctx.lineJoin='round';ctx.lineTo(x,y);ctx.stroke()})
  cv.addEventListener('mouseup',()=>paintDrawing=false)
  cv.addEventListener('mouseleave',()=>paintDrawing=false)
}
function setPaintTool(t){paintTool=t;document.querySelectorAll('.paint-btn').forEach(b=>b.classList.remove('active'));const bt=$('pt-'+t);if(bt)bt.classList.add('active')}
function setPaintColor(c,el){paintColor=c;document.querySelectorAll('.color-swatch').forEach(s=>s.classList.remove('active'));if(el)el.classList.add('active')}
function clearCanvas(){const c=$('paint-canvas');if(!c)return;const ctx=c.getContext('2d');ctx.globalCompositeOperation='source-over';ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height)}

/* ═══ VS CODE ═══ */
const VF={
  html:`<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <title>Portfolio</title>\n</head>\n<body>\n  <!-- Boot → Lock → Login → Desktop -->\n  <canvas id="wallpaper-canvas"></canvas>\n  <div id="s-boot" class="screen active">...</div>\n  <div id="s-lock" class="screen">...</div>\n  <div id="s-login" class="screen">...</div>\n  <div id="s-desk" class="screen">\n    <div class="desk-area">\n      <div class="dico" data-open="w-about">Profile</div>\n      <div class="win" id="w-about">...</div>\n    </div>\n    <div class="tskbar">...</div>\n  </div>\n</body>\n</html>`,
  css:`/* Windows 11 Portfolio */\n:root {\n  --blue: #0078d4;\n  --surface: rgba(28,28,36,.96);\n}\n\n.win {\n  position: absolute;\n  background: var(--surface);\n  border-radius: 10px;\n  box-shadow: 0 24px 60px rgba(0,0,0,.5);\n}\n\n.tskbar {\n  position: absolute;\n  bottom: 0; height: 48px;\n  background: rgba(12,12,18,.95);\n}`,
  js:`// Portfolio Windows 11\nconst $ = id => document.getElementById(id)\n\nfunction openWin(id) {\n  $(id).classList.add('open')\n  bringFront(id)\n  refreshTaskbar()\n}\n\nfunction initWallpaper() {\n  const canvas = $('wallpaper-canvas')\n  const ctx = canvas.getContext('2d')\n  requestAnimationFrame(draw)\n}`,
  toml:`[build]\n  publish = "."\n\n[[redirects]]\n  from = "/*"\n  to   = "/index.html"\n  status = 200`
}
function showVsFile(f){
  document.querySelectorAll('.vs-file').forEach((el,i)=>{el.style.background=['html','css','js','toml'][i]===f?'rgba(0,122,204,.25)':'transparent'})
  const c=$('vs-content');if(!c)return
  c.textContent=VF[f]
  c.style.color={html:'#ce9178',css:'#9cdcfe',js:'#dcdcaa',toml:'#4ec9b0'}[f]||'#60cdff'
}

/* ═══ CHROME ═══ */
function focusChromeSearch(){const i=$('chrome-search-input');if(i)i.focus()}
function chromeSearch(e){if(e.key==='Enter'){const q=$('chrome-search-input').value.trim();if(q)showChromeResults(q)}}
function chromeGoogleSearch(e){if(e.key==='Enter'){const q=$('chrome-google-input').value.trim();if(q)showChromeResults(q)}}
function showChromeResults(q){
  $('chrome-home').style.display='none';$('chrome-results').style.display='block'
  $('chrome-results-query').textContent=(currentLang==='fr'?'Résultats pour : "':'Results for: "')+q+'"'
  $('chrome-real-link').href='https://www.google.com/search?q='+encodeURIComponent(q)
  const fr=currentLang==='fr'
  $('chrome-results-list').innerHTML=[
    {t:q+(fr?' — Wikipédia':' — Wikipedia'),u:'fr.wikipedia.org/wiki/'+q,d:(fr?'Encyclopédie libre. Informations générales sur ':'Free encyclopedia. General information about ')+q+'.'},
    {t:(fr?'Tout savoir sur ':'All about ')+q,u:'www.example.com/'+q.replace(/\s/g,'-'),d:(fr?'Guide complet sur ':'Complete guide on ')+q+'.'},
    {t:q+' | Google Scholar',u:'scholar.google.com/scholar?q='+encodeURIComponent(q),d:(fr?'Articles académiques sur ':'Academic articles about ')+q+'.'},
    {t:q+' News',u:'news.google.com/search?q='+encodeURIComponent(q),d:(fr?'Dernières actualités concernant ':'Latest news about ')+q+'.'},
  ].map(r=>`<div style="margin-bottom:14px"><div style="font-size:11px;color:rgba(255,255,255,.4)">${r.u}</div><div style="font-size:14px;color:#60cdff;margin:2px 0;cursor:pointer" onclick="window.open('https://www.google.com/search?q='+encodeURIComponent('${q}'),'_blank')">${r.t}</div><div style="font-size:12px;color:rgba(255,255,255,.6);line-height:1.4">${r.d}</div></div>`).join('')
}

/* ═══ LANGUAGE ═══ */
function closeLangMenu(){const m=document.getElementById('lang-menu');if(m)m.classList.remove('open')}
function setLang(lang){
  currentLang=lang
  document.querySelectorAll('#lang-en,#desk-lang-en').forEach(b=>{
    b.style.background=lang==='en'?'rgba(0,120,212,.7)':'rgba(255,255,255,.12)'
    b.style.color=lang==='en'?'white':'rgba(255,255,255,.65)'
    b.style.fontWeight=lang==='en'?'600':'normal'
    b.style.borderColor=lang==='en'?'rgba(0,120,212,.9)':'rgba(255,255,255,.2)'
  })
  document.querySelectorAll('#lang-fr,#desk-lang-fr').forEach(b=>{
    b.style.background=lang==='fr'?'rgba(0,120,212,.7)':'rgba(255,255,255,.12)'
    b.style.color=lang==='fr'?'white':'rgba(255,255,255,.65)'
    b.style.fontWeight=lang==='fr'?'600':'normal'
    b.style.borderColor=lang==='fr'?'rgba(0,120,212,.9)':'rgba(255,255,255,.2)'
  })
  const lh=document.querySelector('.lock-hint')
  if(lh)lh.innerHTML='<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3v9M10 3L7 6M10 3l3 3" stroke="rgba(255,255,255,.55)" stroke-width="1.5" stroke-linecap="round"/></svg>'+(lang==='fr'?'Cliquer pour accéder au portfolio':'Click to access the portfolio')
  const lr=document.querySelector('.login-role');if(lr)lr.textContent=lang==='fr'?'Telecommunications · Networks · Data · Web':'Telecommunications · Networks · Data · Web'
  const pin=$('pin');if(pin)pin.placeholder=lang==='fr'?'Leave empty and click the arrow':'Leave empty and click the arrow'
  const lh2=document.querySelector('.login-hint-txt');if(lh2)lh2.textContent=lang==='fr'?'Leave empty and click the arrow':'Leave empty and click the arrow'
  const lt=document.querySelector('.login-tip');if(lt)lt.textContent=lang==='fr'?'No password needed — click directly.':'No password needed — click directly.'
  const bl=document.querySelector('.boot-label');if(bl)bl.textContent=lang==='fr'?'Loading portfolio...':'Loading portfolio...'
  // update tray label
  const tll=document.getElementById('tray-lang-label');if(tll)tll.textContent=lang==='en'?'ENG':'FRA'
  const lmen=document.getElementById('lm-en');if(lmen)lmen.className='lang-menu-item'+(lang==='en'?' active':'')
  const lmfr=document.getElementById('lm-fr');if(lmfr)lmfr.className='lang-menu-item'+(lang==='fr'?' active':'')
  refreshTaskbar()
  // Update all translatable DOM elements
  const T = {
    en: {
      'di-lbl-skills':'Skills','di-lbl-projects':'Projects','di-lbl-exp':'Experience','di-lbl-form':'Education','di-lbl-cert':'Certifications','di-lbl-vol':'Volunteering',
      'wt-skills':'Skills','wt-projects':'Projects ','wt-exp':'Professional Experience','wt-form':'Academic Background','wt-cert':'Certifications ','wt-vol':'Volunteering & Associations','wt-calc':'Calculator','wt-settings':'Settings',
      'about-role':'Telecommunications Engineer · Master 2','about-avail':'Available for freelance',
      'about-bio-lbl':'Bio','about-bio-txt':'Excellent problem-solving skills with ability to perform as a team in a dynamic environment. 5 years of Telecommunications training, 2 years of experience, 14 projects completed and 5 certificates obtained.',
      'about-city-lbl':'City','about-deg-lbl':'Degree','about-exp-lbl':'Experience','about-exp-val':'2 years','about-birth-lbl':'Birth','about-birth-val':'October 29, 1997',
      'tag-avail':'Available','tag-cert':'5 certificates','tag-proj':'14 projects','tag-xp':'2 yrs XP',
      'btn-contact':'Contact me','btn-myproj':'My projects',
      'sk-sys-lbl':'Systems & Networks','sk-sysnet':'Sys & Network','sk-cyber':'Cybersecurity','sk-tools-lbl':'Tools','tag-virt':'Virtualization','tag-net':'Networks',
      'p1-name':'Web & Mobile Applications','p1-desc':'14 web/mobile pages and apps built individually and in teams.',
      'p2-name':'Systems & Networks Projects','p2-desc':'Network administration, Linux server configuration and IT infrastructure.',
      'p3-name':'Data Analytics & Visualization','p3-desc':'Data analysis, dashboards and visualizations for decision support.',
      'p4-name':'Machine Learning Projects','p4-desc':'ML models applied to real-world problems as part of certified training.',
      'e1-title':'Network & Systems Technician Intern','e1-date':'2022 · Academic internship','e1-desc':'Configuration and maintenance of telecom networks, Linux administration, IT infrastructure support.',
      'e2-title':'Freelance Web Developer','e2-company':'Self-employed · Madagascar','e2-date':'2021 — present','e2-desc':'Design and development of websites and applications for local clients. 14 projects completed.',
      'e3-title':'IT Technician','e3-company':'Service provider · Antananarivo','e3-date':'2020 — present','e3-desc':'Installation, configuration and troubleshooting of computer equipment and local networks.',
      'f1-title':'Master 2 — Telecommunications Engineering','f1-desc':'Networks, embedded systems, cybersecurity and data analytics.',
      'f2-title':'Bachelor — Telecommunications & Computer Science','f2-desc':'Telecommunications, computer networks, programming and operating systems.',
      'f3-title':'Scientific Baccalaureate — Series C','f3-desc':'Scientific baccalaureate with distinction.',
      'v1-title':'Volunteer Trainer — Computer Initiation','v1-co':'Youth & Digital Association · Antananarivo','v1-date':'2022 — present','v1-desc':'Leading computer initiation workshops for underprivileged youth.',
      'v2-title':'Active Member — ESPA Computer Club','v2-co':'ESPA — École Supérieure Polytechnique','v2-date':'2020 — 2024','v2-desc':'Organizing tech events, hackathons and knowledge-sharing sessions between students.',
      'v3-title':'Mentor — Student Projects','v3-co':'ESPA alumni network','v3-date':'2023 — present','v3-desc':'Supporting junior students with their final year projects.',
      'ac-title':'Quick Settings','bt-lbl':'Enabled','flight-lbl':'Airplane mode','flight-st':'Off','dnd-lbl':'Do not disturb','dnd-st':'Off','eco-lbl':'Battery saver','eco-st':'Off','disp-lbl':'Display','disp-st':'On','ac-batt-txt':'71% — Plugged in · ~5h remaining',
      'notif-title-el':'Notifications','notif-clear-el':'Clear all',
      'sm-pinned-title_inner':'Pinned','sm-seeall':'All ›','sm-rec-title':'Recommended','sm-shortcuts-title':'Shortcuts','sm-recent-title':'Recent activity','sm-sys-title':'System','sm-batt-txt':'🔋 71% · Plugged in',
      'papp-skills':'Skills','papp-projects':'Projects','papp-exp':'Experience','papp-form':'Education','papp-vol':'Volunteering',
      'ql-exp':'Experience','ql-form':'Education','ql-vol':'Volunteering','rec3-time':'5 min ago',
      'set-sys-lbl':'System','set-perso-lbl':'Personalization','set-bright-lbl':'Brightness','set-lang-lbl':'Language','set-lang-val':'English','set-wifi-lbl':'Wi-Fi','set-wifi-txt':'Tantely_5G — Connected','set-acct-lbl':'Local account',
      'contact-direct-lbl':'Direct message','f-lbl-name':'Name *','f-lbl-subj':'Subject','f-lbl-msg':'Message *',
      'lout-msg':'What would you like to do?','btn-cancel-lbl':'Cancel','btn-logout-lbl':'Sign out',
      'pm-lock-lbl':'Lock','pm-sleep-lbl':'Sleep','pm-shut-lbl':'Shut down','pm-rest-lbl':'Restart','pm-logo-lbl':'Sign out',
      'batt-status':'Plugged in · ~5h remaining','batt-note':'Battery saver is off',
    },
    fr: {
      "di-lbl-skills":"Compétences","di-lbl-projects":"Projets","di-lbl-exp":"Expérience","di-lbl-form":"Formation","di-lbl-cert":"Certifications","di-lbl-vol":"Volontariat",
      "wt-skills":"Compétences","wt-projects":"Projets ","wt-exp":"Expérience professionnelle","wt-form":"Formation académique","wt-cert":"Certifications ","wt-vol":"Volontariat & Associations","wt-calc":"Calculatrice","wt-settings":"Paramètres",
      "about-role":"Ingénieur Télécommunications · Master 2","about-avail":"Freelance disponible",
      "about-bio-lbl":"Bio","about-bio-txt":"Excellent problem-solving skills avec capacité de performer en équipe. 5 ans de formation en Télécommunications, 2 ans d'expérience, 14 projets réalisés et 5 certificats obtenus.",
      "about-city-lbl":"Ville","about-deg-lbl":"Diplôme","about-exp-lbl":"Expérience","about-exp-val":"2 ans","about-birth-lbl":"Naissance","about-birth-val":"29 octobre 1997",
      "tag-avail":"Disponible","tag-cert":"5 certificats","tag-proj":"14 projets","tag-xp":"2 ans XP",
      "btn-contact":"Me contacter","btn-myproj":"Mes projets",
      "sk-sys-lbl":"Systèmes & Réseaux","sk-sysnet":"Sys & Réseau","sk-cyber":"Cybersécurité","sk-tools-lbl":"Outils","tag-virt":"Virtualisation","tag-net":"Réseaux",
      "p1-name":"Applications Web & Mobile","p1-desc":"14 pages et applications web/mobile réalisées en groupe et individuellement.",
      "p2-name":"Projets Systèmes & Réseaux","p2-desc":"Administration de réseaux, configuration serveurs Linux et infrastructure IT.",
      "p3-name":"Data Analytics & Visualisation","p3-desc":"Analyses de données, dashboards et visualisations pour aide à la décision.",
      "p4-name":"Projets Machine Learning","p4-desc":"Modèles ML appliqués à des problèmes réels dans le cadre de formations certifiées.",
      "e1-title":"Stagiaire Technicien Réseau & Systèmes","e1-date":"2022 · Stage académique","e1-desc":"Configuration et maintenance de réseaux télécoms, administration Linux, support infrastructure IT.",
      "e2-title":"Développeur Web Freelance","e2-company":"Auto-entrepreneur · Madagascar","e2-date":"2021 — présent","e2-desc":"Conception et développement de sites web et applications pour clients locaux. 14 projets réalisés.",
      "e3-title":"Technicien Informatique","e3-company":"Prestation de services · Antananarivo","e3-date":"2020 — présent","e3-desc":"Installation, configuration et dépannage de matériel informatique et réseaux locaux.",
      "f1-title":"Master 2 — Ingénierie des Télécommunications","f1-desc":"Réseaux, systèmes embarqués, sécurité informatique et data analytics.",
      "f2-title":"Licence — Télécommunications & Informatique","f2-desc":"Télécommunications, réseaux informatiques, programmation et systèmes d'exploitation.",
      "f3-title":"Baccalauréat Série C","f3-desc":"Baccalauréat scientifique avec mention.",
      "v1-title":"Formateur bénévole — Initiation à l'informatique","v1-co":"Association Jeunesse & Numérique · Antananarivo","v1-date":"2022 — présent","v1-desc":"Animation d'ateliers d'initiation à l'informatique pour jeunes défavorisés.",
      "v2-title":"Membre actif — Club Informatique ESPA","v2-co":"ESPA — École Supérieure Polytechnique","v2-date":"2020 — 2024","v2-desc":"Organisation d'événements tech, hackathons et sessions de partage entre étudiants.",
      "v3-title":"Mentor — Projets étudiants","v3-co":"Réseau alumni ESPA","v3-date":"2023 — présent","v3-desc":"Accompagnement de juniors sur leurs projets de fin d'études.",
      "ac-title":"Connexions rapides","bt-lbl":"Activé","flight-lbl":"Mode avion","flight-st":"Désactivé","dnd-lbl":"Ne pas déranger","dnd-st":"Désactivé","eco-lbl":"Économiseur","eco-st":"Désactivé","disp-lbl":"Affichage","disp-st":"Activé","ac-batt-txt":"71% — Branché · ~5h restantes",
      "notif-title-el":"Notifications","notif-clear-el":"Tout effacer",
      "sm-pinned-title_inner":"Épinglées","sm-seeall":"Tout voir ›","sm-rec-title":"Recommandés","sm-shortcuts-title":"Raccourcis","sm-recent-title":"Activité récente","sm-sys-title":"Système","sm-batt-txt":"🔋 71% · Branché",
      "papp-skills":"Compétences","papp-projects":"Projets","papp-exp":"Expérience","papp-form":"Formation","papp-vol":"Volontariat",
      "ql-exp":"Expérience","ql-form":"Formation","ql-vol":"Volontariat","rec3-time":"Il y a 5 min",
      "set-sys-lbl":"Système","set-perso-lbl":"Personnalisation","set-bright-lbl":"Luminosité","set-lang-lbl":"Langue","set-lang-val":"Français","set-wifi-lbl":"Wi-Fi","set-wifi-txt":"Tantely_5G — Connecté","set-acct-lbl":"Compte local",
      "contact-direct-lbl":"Message direct","f-lbl-name":"Nom *","f-lbl-subj":"Sujet","f-lbl-msg":"Message *",
      "lout-msg":"Que souhaitez-vous faire ?","btn-cancel-lbl":"Annuler","btn-logout-lbl":"Se déconnecter",
      "pm-lock-lbl":"Lock","pm-sleep-lbl":"Sleep","pm-shut-lbl":"Arrêter","pm-rest-lbl":"Redémarrer","pm-logo-lbl":"Déconnexion",
      "batt-status":"Branché · ~5h restantes","batt-note":"Économiseur désactivé",
    }
  }
  const d=T[lang]||T.en
  Object.entries(d).forEach(([id,txt])=>{
    if(id==='wt-projects'){const el=document.getElementById(id);if(el){el.childNodes[0].textContent=txt;return}}
    if(id==='wt-cert'){const el=document.getElementById(id);if(el){el.childNodes[0].textContent=txt;return}}
    const el=document.getElementById(id)
    if(el)el.textContent=txt
  })
  // special: pinned title has child span
  const spt=document.getElementById('sm-pinned-title')
  if(spt){const sa=document.getElementById('sm-seeall');spt.textContent=(lang==='fr'?'Épinglées ':'Pinned ');if(sa)spt.appendChild(sa)}
  // refresh date display with new language
  tick()
  // contact placeholders
  const fn=document.getElementById('f-name');if(fn)fn.placeholder=lang==='fr'?'Votre nom':'Your name'
  const fs=document.getElementById('f-subject');if(fs)fs.placeholder=lang==='fr'?'Proposition...':'Proposal...'
  const fm=document.getElementById('f-message');if(fm)fm.placeholder=lang==='fr'?'Votre message...':'Your message...'
  // close batt popup on lang change
  const bp=document.getElementById('batt-popup');if(bp)bp.style.display='none'
  tick()
}

/* ═══ EMAILJS ═══ */
const EJS_SERVICE='YOUR_SERVICE_ID',EJS_TEMPLATE='YOUR_TEMPLATE_ID',EJS_KEY='YOUR_PUBLIC_KEY'
window.addEventListener('load',()=>{if(typeof emailjs!=='undefined')emailjs.init(EJS_KEY)})

/* ═══ BOOT + INIT ═══ */

// Expose functions to global scope (required for HTML onclick with type=module)
window.calMove = calMove
window.calcAC = calcAC
window.calcDot = calcDot
window.calcEq = calcEq
window.calcNum = calcNum
window.calcOp = calcOp
window.calcPct = calcPct
window.calcSign = calcSign
window.chromeGoogleSearch = chromeGoogleSearch
window.chromeSearch = chromeSearch
window.clearCanvas = clearCanvas
window.closeStart = closeStart
window.doLock = doLock
window.doLogout = doLogout
window.doRestart = doRestart
window.doShutdown = doShutdown
window.doSleep = doSleep
window.focusChromeSearch = focusChromeSearch
window.setBrightness = setBrightness
window.setPaintColor = setPaintColor
window.setPaintTool = setPaintTool
window.show = show
window.showVsFile = showVsFile
window.smSearch = smSearch
window.setLang = setLang
window.openWin = openWin
window.closeWin = closeWin
window.toggleStart = toggleStart
window.openStart = openStart

document.addEventListener('DOMContentLoaded', function() {


  tick(); setInterval(tick,30000)

  // Boot → Lock after 300ms
  setTimeout(()=>{
    show('s-lock')
    setTimeout(initWallpaper, 50)
  },300)


  // Fallback: if still on boot after 3s, force unlock
  setTimeout(()=>{
    if(document.getElementById('s-boot').classList.contains('active')){
      show('s-lock')
      initWallpaper()
    }
  },3000)
  // Lock screen click
  $('s-lock').addEventListener('click',()=>{show('s-login');setTimeout(()=>{const p=$('pin');if(p)p.focus()},80)})
  $('s-sleep').addEventListener('click',()=>show('s-lock'))

  // Login
  function goDesk(){
    show('s-desk')
    refreshTaskbar()
    initPaint()
    showVsFile('html')
    buildCal()
  }
  $('login-btn').addEventListener('click',goDesk)
  $('pin').addEventListener('keydown',e=>{if(e.key==='Enter')goDesk()})

  // Click delegation
  document.addEventListener('click',e=>{
    const o=e.target.closest('[data-open]');if(o){openWin(o.dataset.open);return}
    const cl=e.target.closest('[data-close]');if(cl){closeWin(cl.dataset.close);return}
    const a=e.target.closest('[data-action]')
    if(a){if(a.dataset.action==='min')minimizeWin(a.dataset.win);if(a.dataset.action==='max')maximizeWin(a.dataset.win);return}
    const w=e.target.closest('.win');if(w)bringFront(w.id)
  })

  // Taskbar
  $('tb-start').addEventListener('click',e=>{e.stopPropagation();toggleStart()})
  $('tray-notif').addEventListener('click',e=>{e.stopPropagation();$('notif-center').classList.contains('open')?closeNotif():openNotif()})
  $('tray-ac').addEventListener('click',e=>{e.stopPropagation();$('action-center').classList.contains('open')?closeAC():openAC()})
  // tray-power removed - power is in start menu footer only
  // lang toggle handled via inline onclick
  $('tray-clock-btn').addEventListener('click',e=>{e.stopPropagation();$('notif-center').classList.contains('open')?closeNotif():openNotif()})
  $('btn-cancel').addEventListener('click',()=>$('lout').classList.remove('show'))
  $('btn-logout').addEventListener('click',()=>{$('lout').classList.remove('show');show('s-login')})

  // Close overlays on outside click
  document.addEventListener('click',e=>{
    if(!e.target.closest('#smenu')&&!e.target.closest('#tb-start'))closeStart()
    if(!e.target.closest('#action-center')&&!e.target.closest('#tray-ac'))closeAC()
    if(!e.target.closest('#notif-center')&&!e.target.closest('#tray-notif')&&!e.target.closest('#tray-clock-btn'))closeNotif()
    if(!e.target.closest('#power-menu')&&!e.target.closest('.sm-power-btn'))closePowerMenu()
    if(!e.target.closest('#lang-menu')&&!e.target.closest('#tray-lang')){const lm=document.getElementById('lang-menu');if(lm)lm.classList.remove('open')}
    if(!e.target.closest('#batt-popup')&&!e.target.closest('#tray-batt')){const bp=document.getElementById('batt-popup');if(bp)bp.style.display='none'}
  })

  // Init draggable windows + icons
  document.querySelectorAll('.win').forEach(w=>{makeDraggable(w);addResizeHandles(w)})
  document.querySelectorAll('.dico').forEach(makeDraggableIcon)

  // Brightness sliders
  const abEl=$('ac-brightness');if(abEl)abEl.addEventListener('input',function(){setBrightness(this.value)})
  const brEl=$('brightness-range');if(brEl)brEl.addEventListener('input',function(){setBrightness(this.value)})

// Lang menu - use event delegation (no inline onclick needed)
document.addEventListener('click', function(e) {
  const item = e.target.closest('[data-lang]')
  if (item) {
    const lang = item.dataset.lang
    setLang(lang)
    const m = document.getElementById('lang-menu')
    if (m) m.classList.remove('open')
    return
  }
  // Toggle lang menu
  const trayLang = e.target.closest('#tray-lang-btn') || e.target.closest('#tray-lang')
  if (trayLang) {
    e.stopPropagation()
    const m = document.getElementById('lang-menu')
    if (m) m.classList.toggle('open')
    return
  }
  // Toggle battery popup
  const trayBatt = e.target.closest('#tray-batt-btn') || e.target.closest('#tray-batt')
  if (trayBatt) {
    e.stopPropagation()
    const bp = document.getElementById('batt-popup')
    if (bp) bp.style.display = bp.style.display === 'block' ? 'none' : 'block'
    return
  }
})

  // Init windows + icons
  document.querySelectorAll('.win').forEach(w => { makeDraggable(w); addResizeHandles(w) })
  document.querySelectorAll('.dico').forEach(makeDraggableIcon)
})
