# 🪟 Portfolio Windows 11 — Guide de configuration

## 1. Configurer EmailJS (formulaire de contact)

### Étape 1 — Créer un compte EmailJS (gratuit)
1. Allez sur https://www.emailjs.com
2. Cliquez **Sign Up** → créez un compte gratuit

### Étape 2 — Ajouter un service email
1. Dans le dashboard EmailJS → **Email Services** → **Add New Service**
2. Choisissez **Gmail** (ou Outlook, etc.)
3. Connectez votre compte `ttlrasoloniaina@gmail.com`
4. Notez votre **Service ID** (ex: `service_abc123`)

### Étape 3 — Créer un template email
1. Dans EmailJS → **Email Templates** → **Create New Template**
2. Utilisez ce modèle :

**Subject :** `[Portfolio] Nouveau message de {{from_name}}`

**Body :**
```
Nouveau message depuis votre portfolio !

Nom : {{from_name}}
Email : {{from_email}}
Sujet : {{subject}}

Message :
{{message}}
```

3. Cliquez **Save** et notez votre **Template ID** (ex: `template_xyz789`)

### Étape 4 — Récupérer votre Public Key
1. Dans EmailJS → **Account** → **General**
2. Copiez votre **Public Key** (ex: `aBcDeFgHiJkLmNoP`)

### Étape 5 — Mettre à jour le code
Ouvrez `src/main.js` et remplacez les 3 valeurs en haut du fichier :

```javascript
const EMAILJS_SERVICE_ID  = 'service_abc123'   // Votre Service ID
const EMAILJS_TEMPLATE_ID = 'template_xyz789'  // Votre Template ID
const EMAILJS_PUBLIC_KEY  = 'aBcDeFgHiJkLmNoP' // Votre Public Key
```

---

## 2. Déployer sur Netlify

### Option A — Glisser-déposer (le plus simple)
1. Exécutez localement :
   ```bash
   npm install
   npm run build
   ```
2. Allez sur https://app.netlify.com
3. Glissez le dossier `dist/` dans la zone de dépôt Netlify

### Option B — Via GitHub (recommandé)
1. Poussez ce projet sur GitHub
2. Dans Netlify → **Add new site** → **Import from Git**
3. Choisissez votre repo
4. Les paramètres sont déjà configurés dans `netlify.toml` :
   - Build command : `npm run build`
   - Publish directory : `dist`
5. Cliquez **Deploy site**

---

## 3. Structure du projet

```
portfolio-win11/
├── index.html          # Point d'entrée HTML
├── package.json        # Dépendances (Vite + EmailJS)
├── vite.config.js      # Config Vite
├── netlify.toml        # Config Netlify (auto)
├── public/
│   └── favicon.svg     # Icône Windows
└── src/
    ├── main.js         # Tout le JavaScript + HTML + logique EmailJS
    └── style.css       # Tous les styles Windows 11
```

## 4. Commandes utiles

```bash
npm install        # Installer les dépendances
npm run dev        # Lancer en local (http://localhost:5173)
npm run build      # Construire pour la production → dossier dist/
npm run preview    # Prévisualiser le build local
```

---

> ✅ Le formulaire envoie les messages directement à ttlrasoloniaina@gmail.com
> ✅ EmailJS gratuit = 200 emails/mois
> ✅ Aucun backend nécessaire
