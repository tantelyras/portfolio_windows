# 🪟 Portfolio Windows 11 — Guide EmailJS

## Configurer le formulaire de contact (5 min)

### 1. Créer un compte EmailJS gratuit
→ https://www.emailjs.com (200 emails/mois gratuits)

### 2. Ajouter votre Gmail
- Dashboard → Email Services → Add New Service → Gmail
- Connectez `ttlrasoloniaina@gmail.com`
- Notez le **Service ID** (ex: `service_abc123`)

### 3. Créer un template
- Dashboard → Email Templates → Create New Template
- Subject : `[Portfolio] Message de {{from_name}}`
- Body :
  ```
  Nom    : {{from_name}}
  Email  : {{from_email}}
  Sujet  : {{subject}}
  
  {{message}}
  ```
- Cliquez Save → notez le **Template ID** (ex: `template_xyz789`)

### 4. Récupérer votre Public Key
- Account → General → **Public Key** (ex: `aBcDeFgHiJkLmNoP`)

### 5. Mettre à jour index.html
Ouvrez `index.html` et cherchez ces 3 lignes (~ligne 270) :

```javascript
const EJS_SERVICE  = 'YOUR_SERVICE_ID'   // ← remplacez
const EJS_TEMPLATE = 'YOUR_TEMPLATE_ID'  // ← remplacez
const EJS_KEY      = 'YOUR_PUBLIC_KEY'   // ← remplacez
```

---

## Déployer sur Netlify (sans build !)

Ce projet est un **fichier HTML unique** — pas de build nécessaire.

### Option A — Glisser-déposer (le plus simple)
1. Allez sur https://app.netlify.com
2. Glissez le dossier `portfolio-v3/` directement dans la zone de dépôt
3. C'est en ligne instantanément !

### Option B — Via GitHub
1. Poussez ce dossier sur GitHub
2. Netlify → Add new site → Import from Git
3. Build command : **(laisser vide)**
4. Publish directory : `.`
5. Deploy !

Le fichier `netlify.toml` est déjà configuré correctement.

---

> ✅ Aucune dépendance, aucun build, déploiement instantané
> ✅ EmailJS gratuit = 200 emails/mois
