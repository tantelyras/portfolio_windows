import './style.css'
import emailjs from '@emailjs/browser'

// ─── EmailJS Config ───────────────────────────────────────────────
// 1. Créez un compte sur https://www.emailjs.com (gratuit)
// 2. Ajoutez un service email (Gmail, Outlook…)
// 3. Créez un template avec les variables : {{from_name}}, {{from_email}}, {{subject}}, {{message}}
// 4. Remplacez les 3 valeurs ci-dessous
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID'   // ex: service_abc123
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'  // ex: template_xyz789
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY'   // ex: aBcDeFgHiJkLmNoP

emailjs.init(EMAILJS_PUBLIC_KEY)

// ─── Helpers ──────────────────────────────────────────────────────
const $ = id => document.getElementById(id)
let zCounter = 10

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'))
  $(id).classList.add('active')
}

function tick() {
  const n = new Date()
  const hh = n.getHours().toString().padStart(2,'0')
  const mm = n.getMinutes().toString().padStart(2,'0')
  const t = `${hh}:${mm}`
  const days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
  const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
  const ds = `${days[n.getDay()]} ${n.getDate()} ${months[n.getMonth()]} ${n.getFullYear()}`
  const el = $('l-time'); if (el) el.textContent = t
  const ed = $('l-date'); if (ed) ed.textContent = ds
  const dc = $('d-clock'); if (dc) dc.textContent = t
}

function bringFront(id) {
  zCounter++
  $(id).style.zIndex = zCounter
}

function openWin(id) {
  $(id).classList.add('open')
  bringFront(id)
  closeStart()
}

function closeWin(id) {
  $(id).classList.remove('open')
}

function toggleStart() {
  $('smenu').classList.toggle('open')
}

function closeStart() {
  $('smenu').classList.remove('open')
}

function showLout() {
  closeStart()
  $('lout').classList.add('show')
}

function cancelLout() {
  $('lout').classList.remove('show')
}

function doLout() {
  $('lout').classList.remove('show')
  $('s-desk').classList.add('fade-out')
  setTimeout(() => {
    $('s-desk').classList.remove('fade-out')
    show('s-lock')
  }, 450)
}

function goDesk() {
  show('s-desk')
}

function makeDraggable(el) {
  const tbar = el.querySelector('.tbar')
  if (!tbar) return
  tbar.addEventListener('mousedown', e => {
    const da = $('desk-area')
    const dr = da.getBoundingClientRect()
    const sx = e.clientX - el.offsetLeft
    const sy = e.clientY - el.offsetTop
    bringFront(el.id)
    function mv(e) {
      el.style.left = Math.max(0, Math.min(e.clientX - sx, dr.width - el.offsetWidth)) + 'px'
      el.style.top  = Math.max(0, Math.min(e.clientY - sy, dr.height - el.offsetHeight)) + 'px'
    }
    function up() {
      document.removeEventListener('mousemove', mv)
      document.removeEventListener('mouseup', up)
    }
    document.addEventListener('mousemove', mv)
    document.addEventListener('mouseup', up)
    e.preventDefault()
  })
}

// ─── Form ─────────────────────────────────────────────────────────
async function handleFormSubmit(e) {
  e.preventDefault()
  const btn    = $('form-submit')
  const status = $('form-status')
  const name    = $('f-name').value.trim()
  const email   = $('f-email').value.trim()
  const subject = $('f-subject').value.trim()
  const message = $('f-message').value.trim()

  if (!name || !email || !message) {
    status.textContent = 'Veuillez remplir tous les champs obligatoires.'
    status.className = 'form-status err'
    return
  }

  btn.disabled = true
  btn.textContent = 'Envoi en cours...'
  status.className = 'form-status'

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name:  name,
      from_email: email,
      subject:    subject || 'Message depuis le portfolio',
      message:    message,
      to_email:   'ttlrasoloniaina@gmail.com',
    })
    status.textContent = '✓ Message envoyé ! Je vous réponds dans les plus brefs délais.'
    status.className = 'form-status ok'
    $('contact-form').reset()
  } catch (err) {
    console.error('EmailJS error:', err)
    status.textContent = '✗ Erreur lors de l\'envoi. Contactez-moi directement par email.'
    status.className = 'form-status err'
  } finally {
    btn.disabled = false
    btn.textContent = 'Envoyer le message'
  }
}

// ─── HTML ─────────────────────────────────────────────────────────
document.querySelector('#app').innerHTML = `

<!-- BOOT -->
<div class="screen active" id="s-boot">
  <div class="boot-wrap">
    <div class="boot-ring"></div>
    <svg class="boot-logo" viewBox="0 0 28 28">
      <rect x="0"  y="0"  width="12" height="12" rx="1.5" fill="#0078d4"/>
      <rect x="16" y="0"  width="12" height="12" rx="1.5" fill="#0078d4"/>
      <rect x="0"  y="16" width="12" height="12" rx="1.5" fill="#0078d4"/>
      <rect x="16" y="16" width="12" height="12" rx="1.5" fill="#0078d4"/>
    </svg>
  </div>
  <div class="boot-dots">
    <div class="boot-dot"></div><div class="boot-dot"></div>
    <div class="boot-dot"></div><div class="boot-dot"></div>
  </div>
  <p class="boot-label">Chargement du portfolio...</p>
</div>

<!-- LOCK -->
<div class="screen" id="s-lock">
  <div class="lock-bg"></div>
  <div class="lock-time-block">
    <div class="lock-hour" id="l-time">--:--</div>
    <div class="lock-date" id="l-date">Chargement...</div>
  </div>
  <div class="lock-hint">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3v9M10 3L7 6M10 3l3 3" stroke="rgba(255,255,255,.55)" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    Cliquer pour accéder au portfolio
  </div>
  <div class="lock-tip">Portfolio de Tantelinirina Rasoloniaina — Cliquez n'importe où pour entrer</div>
</div>

<!-- LOGIN -->
<div class="screen" id="s-login">
  <div class="login-bg"></div>
  <div class="login-card">
    <div class="login-avatar" style="width:90px;height:90px;font-size:28px;">TR</div>
    <div class="login-name">Tantelinirina Rasoloniaina</div>
    <div class="login-role">Télécommunications · Réseaux · Data · Web</div>
    <div class="login-row">
      <input class="login-input" id="pin" type="password" placeholder="Appuyez sur Entrée pour continuer" />
      <button class="login-go" id="login-btn">&#10148;</button>
    </div>
    <p class="login-hint-text">Laissez vide et cliquez sur la flèche</p>
    <div class="login-tip">Pas besoin de mot de passe — entrez directement pour découvrir le portfolio.</div>
  </div>
</div>

<!-- DESKTOP -->
<div class="screen" id="s-desk">
  <div class="wp"></div>
  <div class="wp-glow"></div>

  <!-- GUIDE -->
  <div class="guide-banner" id="guide-banner">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7.5" stroke="#60cdff" stroke-width="1.3"/>
      <path d="M9 8v5M9 6.5v-.5" stroke="#60cdff" stroke-width="1.4" stroke-linecap="round"/>
    </svg>
    <span>Utilisez les icônes en bas ou le menu Démarrer pour naviguer. Les fenêtres sont déplaçables.</span>
    <span class="guide-close" id="guide-close">&#10005;</span>
  </div>

  <div class="desk-area" id="desk-area">

    <!-- ABOUT WINDOW -->
    <div class="win open" id="w-about" style="top:24px;left:18px;width:325px;">
      <div class="tbar">
        <svg class="wi" viewBox="0 0 16 16"><circle cx="8" cy="5" r="3" fill="#60cdff"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#60cdff" stroke-width="1.5" fill="none"/></svg>
        <span class="wt">À propos — Profil</span>
        <div class="wbtns">
          <div class="wb">&#8212;</div><div class="wb">&#9633;</div>
          <div class="wb cls" data-close="w-about">&#10005;</div>
        </div>
      </div>
      <div class="wcont">
        <div style="display:flex;gap:14px;align-items:center;margin-bottom:14px;">
          <div class="avtr" style="width:60px;height:60px;font-size:20px;">TR</div>
          <div>
            <div style="font-size:15px;font-weight:600;color:white;line-height:1.25;">Tantelinirina Rasoloniaina</div>
            <div style="font-size:11px;color:var(--text2);margin-top:3px;">Ingénieur Télécommunications · Master 2</div>
            <div style="margin-top:6px;"><span class="sdot"></span><span style="font-size:11px;color:var(--green);">Freelance disponible</span></div>
          </div>
        </div>
        <div class="acard">
          <div class="slabel">Bio</div>
          <div style="font-size:11px;color:rgba(255,255,255,.68);line-height:1.65;">
            Excellent problem-solving skills avec capacité de performer en équipe dans un environnement dynamique. 5 ans de formation en Télécommunications, 2 ans d'expérience professionnelle, 14 projets web &amp; mobile réalisés et 5 certificats obtenus.
          </div>
        </div>
        <div class="acard">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;font-size:11px;">
            <div><div style="color:var(--text3);">Ville</div><div style="color:var(--text);margin-top:2px;">Antananarivo, Madagascar</div></div>
            <div><div style="color:var(--text3);">Diplôme</div><div style="color:var(--text);margin-top:2px;">Master 2</div></div>
            <div><div style="color:var(--text3);">Expérience</div><div style="color:var(--text);margin-top:2px;">2 ans</div></div>
            <div><div style="color:var(--text3);">Naissance</div><div style="color:var(--text);margin-top:2px;">29 octobre 1997</div></div>
          </div>
        </div>
        <div style="margin-bottom:13px;">
          <span class="tag tag-g">Freelance dispo</span>
          <span class="tag">5 certificats</span>
          <span class="tag">14 projets</span>
          <span class="tag">2 ans XP</span>
        </div>
        <div>
          <button class="btn" data-open="w-contact">Me contacter</button>
          <button class="btn ghost" data-open="w-projects">Mes projets</button>
        </div>
      </div>
    </div>

    <!-- SKILLS WINDOW -->
    <div class="win open" id="w-skills" style="top:24px;left:365px;width:290px;">
      <div class="tbar">
        <svg class="wi" viewBox="0 0 16 16"><rect x="1" y="3" width="14" height="10" rx="2" stroke="#b39dff" stroke-width="1.2" fill="none"/><line x1="4" y1="7" x2="12" y2="7" stroke="#b39dff" stroke-width="1.2"/></svg>
        <span class="wt">Compétences</span>
        <div class="wbtns">
          <div class="wb">&#8212;</div><div class="wb">&#9633;</div>
          <div class="wb cls" data-close="w-skills">&#10005;</div>
        </div>
      </div>
      <div class="wcont">
        <div class="acard">
          <div class="slabel">Systèmes &amp; Réseaux</div>
          <div class="srow"><span class="sn">Sys &amp; Réseau</span><div class="strk"><div class="sfil" style="width:85%"></div></div><span class="spct">85%</span></div>
          <div class="srow"><span class="sn">Linux</span><div class="strk"><div class="sfil" style="width:87%"></div></div><span class="spct">87%</span></div>
          <div class="srow"><span class="sn">Cybersécurité</span><div class="strk"><div class="sfil" style="width:60%"></div></div><span class="spct">60%</span></div>
        </div>
        <div class="acard">
          <div class="slabel">Data &amp; IA</div>
          <div class="srow"><span class="sn">Data Analytics</span><div class="strk"><div class="sfil" style="width:85%"></div></div><span class="spct">85%</span></div>
          <div class="srow"><span class="sn">Machine Learning</span><div class="strk"><div class="sfil" style="width:58%"></div></div><span class="spct">58%</span></div>
          <div class="srow"><span class="sn">Bases de données</span><div class="strk"><div class="sfil" style="width:55%"></div></div><span class="spct">55%</span></div>
        </div>
        <div class="acard">
          <div class="slabel">Développement &amp; Design</div>
          <div class="srow"><span class="sn">Web Dev</span><div class="strk"><div class="sfil" style="width:59%"></div></div><span class="spct">59%</span></div>
          <div class="srow"><span class="sn">Design graphique</span><div class="strk"><div class="sfil" style="width:79%"></div></div><span class="spct">79%</span></div>
        </div>
        <div class="acard">
          <div class="slabel">Outils &amp; Technos</div>
          <div>
            <span class="tag">Linux</span><span class="tag">Virtualisation</span>
            <span class="tag">Réseaux</span><span class="tag">SQL</span>
            <span class="tag">Python</span><span class="tag">ML</span>
            <span class="tag">Web</span><span class="tag">Design graphique</span>
          </div>
        </div>
      </div>
    </div>

    <!-- PROJECTS WINDOW -->
    <div class="win open" id="w-projects" style="top:220px;left:18px;width:340px;">
      <div class="tbar">
        <svg class="wi" viewBox="0 0 16 16"><path d="M2 4h5l1.5 2H14v7H2z" stroke="#EF9F27" stroke-width="1.2" fill="none"/></svg>
        <span class="wt">Projets <span class="badge">14+</span></span>
        <div class="wbtns">
          <div class="wb">&#8212;</div><div class="wb">&#9633;</div>
          <div class="wb cls" data-close="w-projects">&#10005;</div>
        </div>
      </div>
      <div class="wcont">
        <div class="pcard">
          <div class="pname">Applications Web &amp; Mobile</div>
          <div class="pdesc">14 pages et applications web/mobile réalisées en groupe et individuellement.</div>
          <div style="margin-top:6px;"><span class="tag">HTML/CSS</span><span class="tag">JavaScript</span><span class="tag">Mobile</span></div>
        </div>
        <div class="pcard">
          <div class="pname">Projets Systèmes &amp; Réseaux</div>
          <div class="pdesc">Administration de réseaux, configuration de serveurs Linux et infrastructure IT.</div>
          <div style="margin-top:6px;"><span class="tag">Linux</span><span class="tag">Réseaux</span><span class="tag">Serveurs</span></div>
        </div>
        <div class="pcard">
          <div class="pname">Data Analytics &amp; Visualisation</div>
          <div class="pdesc">Analyses de données, dashboards et visualisations pour aide à la décision.</div>
          <div style="margin-top:6px;"><span class="tag">Python</span><span class="tag">SQL</span><span class="tag">Dashboard</span></div>
        </div>
        <div class="pcard">
          <div class="pname">Projets Machine Learning</div>
          <div class="pdesc">Modèles ML appliqués à des problèmes réels dans le cadre de formations certifiées.</div>
          <div style="margin-top:6px;"><span class="tag">ML</span><span class="tag">Python</span><span class="tag">Data</span></div>
        </div>
        <div style="margin-top:10px;display:flex;justify-content:flex-end;">
          <button class="btn" data-open="w-contact">Me contacter &#8599;</button>
        </div>
      </div>
    </div>

    <!-- CONTACT WINDOW -->
    <div class="win open" id="w-contact" style="top:220px;left:382px;width:310px;">
      <div class="tbar">
        <svg class="wi" viewBox="0 0 16 16"><rect x="1" y="3" width="14" height="10" rx="2" stroke="#5DCAA5" stroke-width="1.2" fill="none"/><polyline points="1,5 8,9 15,5" stroke="#5DCAA5" stroke-width="1.2" fill="none"/></svg>
        <span class="wt">Contact &amp; Message</span>
        <div class="wbtns">
          <div class="wb">&#8212;</div><div class="wb">&#9633;</div>
          <div class="wb cls" data-close="w-contact">&#10005;</div>
        </div>
      </div>
      <div class="wcont">
        <a class="clink" href="mailto:ttlrasoloniaina@gmail.com">
          <div class="cico" style="background:rgba(0,120,212,.2);">
            <svg width="16" height="16" viewBox="0 0 16 16"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="#60cdff" stroke-width="1.2" fill="none"/><polyline points="1,5 8,9 15,5" stroke="#60cdff" stroke-width="1.2" fill="none"/></svg>
          </div>
          <div><div style="font-size:12px;font-weight:500;">Email (prioritaire)</div><div style="font-size:10px;color:var(--text3);">ttlrasoloniaina@gmail.com</div></div>
        </a>
        <a class="clink" href="https://wa.me/261344389749" target="_blank" rel="noopener">
          <div class="cico" style="background:rgba(37,211,102,.16);">
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 1a7 7 0 0 1 6.08 10.47l.92 3.53-3.53-.92A7 7 0 1 1 8 1z" stroke="#25D366" stroke-width="1.2" fill="none"/></svg>
          </div>
          <div><div style="font-size:12px;">WhatsApp</div><div style="font-size:10px;color:var(--text3);">+261 34 43 897 49</div></div>
        </a>
        <a class="clink" href="https://rtantelinirina.netlify.app" target="_blank" rel="noopener">
          <div class="cico" style="background:rgba(255,255,255,.07);">
            <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.5" stroke="#60cdff" stroke-width="1.2" fill="none"/><path d="M8 1.5C6 4 5 6 5 8s1 4 3 6.5M8 1.5C10 4 11 6 11 8s-1 4-3 6.5M1.5 8h13" stroke="#60cdff" stroke-width="1.1" fill="none"/></svg>
          </div>
          <div><div style="font-size:12px;">Portfolio actuel</div><div style="font-size:10px;color:var(--text3);">rtantelinirina.netlify.app</div></div>
        </a>

        <div style="border-top:1px solid rgba(255,255,255,.07);margin:12px 0 10px;"></div>

        <!-- FORM -->
        <form id="contact-form" novalidate>
          <div class="slabel" style="margin-bottom:10px;">Envoyer un message direct</div>
          <div class="form-field">
            <label class="form-label" for="f-name">Nom complet *</label>
            <input class="form-input" id="f-name" type="text" placeholder="Votre nom" required />
          </div>
          <div class="form-field">
            <label class="form-label" for="f-email">Email *</label>
            <input class="form-input" id="f-email" type="email" placeholder="votre@email.com" required />
          </div>
          <div class="form-field">
            <label class="form-label" for="f-subject">Sujet</label>
            <input class="form-input" id="f-subject" type="text" placeholder="Proposition, question..." />
          </div>
          <div class="form-field">
            <label class="form-label" for="f-message">Message *</label>
            <textarea class="form-textarea" id="f-message" placeholder="Votre message..." required></textarea>
          </div>
          <div id="form-status" class="form-status"></div>
          <button class="btn full" type="submit" id="form-submit" style="margin-top:8px;">
            Envoyer le message
          </button>
        </form>
      </div>
    </div>

  </div><!-- desk-area -->

  <!-- LOGOUT OVERLAY -->
  <div class="lout" id="lout">
    <div class="lout-card">
      <div class="avtr" style="width:64px;height:64px;font-size:22px;margin:0 auto 14px;">TR</div>
      <div style="font-size:16px;color:white;margin-bottom:4px;">Tantelinirina Rasoloniaina</div>
      <div style="font-size:11px;color:var(--text3);margin-bottom:20px;">Que souhaitez-vous faire ?</div>
      <button class="btn full" id="btn-cancel-lout" style="margin-bottom:9px;">Annuler</button>
      <button class="btn full red" id="btn-do-lout">Se déconnecter</button>
    </div>
  </div>

  <!-- TASKBAR -->
  <div class="tskbar">
    <div style="display:flex;gap:4px;align-items:center;">
      <div class="tbi" id="tb-st" title="Démarrer">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <rect x="1" y="1" width="6" height="6" rx="1" fill="#0078d4"/>
          <rect x="9" y="1" width="6" height="6" rx="1" fill="#0078d4"/>
          <rect x="1" y="9" width="6" height="6" rx="1" fill="#0078d4"/>
          <rect x="9" y="9" width="6" height="6" rx="1" fill="#0078d4"/>
        </svg>
      </div>
      <div class="tbi lit" data-open="w-about" title="À propos">
        <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="5" r="3" fill="#60cdff"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#60cdff" stroke-width="1.5" fill="none"/></svg>
      </div>
      <div class="tbi lit" data-open="w-skills" title="Compétences">
        <svg width="16" height="16" viewBox="0 0 16 16"><rect x="1" y="3" width="14" height="10" rx="2" stroke="#b39dff" stroke-width="1.2" fill="none"/><line x1="4" y1="7" x2="12" y2="7" stroke="#b39dff" stroke-width="1.2"/></svg>
      </div>
      <div class="tbi lit" data-open="w-projects" title="Projets">
        <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 4h5l1.5 2H14v7H2z" stroke="#EF9F27" stroke-width="1.2" fill="none"/></svg>
      </div>
      <div class="tbi lit" data-open="w-contact" title="Contact">
        <svg width="16" height="16" viewBox="0 0 16 16"><rect x="1" y="3" width="14" height="10" rx="2" stroke="#5DCAA5" stroke-width="1.2" fill="none"/><polyline points="1,5 8,9 15,5" stroke="#5DCAA5" stroke-width="1.2" fill="none"/></svg>
      </div>
    </div>
    <div class="tb-r" id="d-clock">--:--</div>
  </div>

  <!-- START MENU -->
  <div class="smenu" id="smenu">
    <input class="ssearch" type="text" placeholder="Rechercher dans le portfolio..." />
    <div style="font-size:11px;color:var(--text3);margin-bottom:8px;">Sections</div>
    <div class="pgrid">
      <div class="papp" data-open="w-about">
        <div class="aico" style="background:rgba(0,120,212,.28);">
          <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="5" r="3" fill="#60cdff"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#60cdff" stroke-width="1.5" fill="none"/></svg>
        </div><span>Profil</span>
      </div>
      <div class="papp" data-open="w-skills">
        <div class="aico" style="background:rgba(107,71,237,.28);">
          <svg width="16" height="16" viewBox="0 0 16 16"><rect x="1" y="3" width="14" height="10" rx="2" stroke="#b39dff" stroke-width="1.2" fill="none"/><line x1="4" y1="7" x2="12" y2="7" stroke="#b39dff" stroke-width="1.2"/></svg>
        </div><span>Skills</span>
      </div>
      <div class="papp" data-open="w-projects">
        <div class="aico" style="background:rgba(239,153,39,.28);">
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 4h5l1.5 2H14v7H2z" stroke="#EF9F27" stroke-width="1.2" fill="none"/></svg>
        </div><span>Projets</span>
      </div>
      <div class="papp" data-open="w-contact">
        <div class="aico" style="background:rgba(29,158,117,.28);">
          <svg width="16" height="16" viewBox="0 0 16 16"><rect x="1" y="3" width="14" height="10" rx="2" stroke="#5DCAA5" stroke-width="1.2" fill="none"/><polyline points="1,5 8,9 15,5" stroke="#5DCAA5" stroke-width="1.2" fill="none"/></svg>
        </div><span>Contact</span>
      </div>
    </div>
    <div class="dvd"></div>
    <div style="display:flex;align-items:center;justify-content:space-between;">
      <div class="prow">
        <div class="avtr" style="width:30px;height:30px;font-size:11px;">TR</div>
        <span style="font-size:12px;color:var(--text2);">Tantelinirina R.</span>
      </div>
      <div class="pwbtn lo" id="start-lout" title="Se déconnecter">
        <svg width="16" height="16" viewBox="0 0 16 16"><path d="M6 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3M10 11l4-3-4-3M6 8h8" stroke="rgba(255,255,255,.65)" stroke-width="1.3" fill="none" stroke-linecap="round"/></svg>
      </div>
    </div>
  </div>

</div><!-- s-desk -->
`

// ─── Boot Sequence ────────────────────────────────────────────────
tick()
setInterval(tick, 15000)

setTimeout(() => {
  $('s-boot').classList.add('fade-out')
  setTimeout(() => show('s-lock'), 480)
}, 2800)

// ─── Lock Screen ─────────────────────────────────────────────────
$('s-lock').addEventListener('click', () => {
  show('s-login')
  setTimeout(() => { const p = $('pin'); if (p) p.focus() }, 80)
})

// ─── Login ───────────────────────────────────────────────────────
$('login-btn').addEventListener('click', goDesk)
$('pin').addEventListener('keydown', e => { if (e.key === 'Enter') goDesk() })

// ─── Window open/close delegation ────────────────────────────────
document.addEventListener('click', e => {
  const openTarget = e.target.closest('[data-open]')
  if (openTarget) { openWin(openTarget.dataset.open); return }

  const closeTarget = e.target.closest('[data-close]')
  if (closeTarget) { closeWin(closeTarget.dataset.close); return }

  const winEl = e.target.closest('.win')
  if (winEl) bringFront(winEl.id)
})

// ─── Taskbar & Start ─────────────────────────────────────────────
$('tb-st').addEventListener('click', e => { e.stopPropagation(); toggleStart() })
$('start-lout').addEventListener('click', showLout)
$('btn-cancel-lout').addEventListener('click', cancelLout)
$('btn-do-lout').addEventListener('click', doLout)

document.addEventListener('click', e => {
  if (!e.target.closest('#smenu') && !e.target.closest('#tb-st')) closeStart()
})

// ─── Guide banner ─────────────────────────────────────────────────
$('guide-close').addEventListener('click', () => { $('guide-banner').style.display = 'none' })

// ─── Make windows draggable ───────────────────────────────────────
document.querySelectorAll('.win').forEach(makeDraggable)

// ─── Form submit ──────────────────────────────────────────────────
$('contact-form').addEventListener('submit', handleFormSubmit)
