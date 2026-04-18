# 🏃‍♀️ Semi-Marathon 1h55 - PWA

Application web progressive (PWA) pour le suivi du plan d'entraînement.
**Installable sur iPhone comme une vraie app, fonctionne hors-ligne, gratuit à vie.**

---

## 🎯 Guide de déploiement GitHub Pages

### 📋 Prérequis

- Un compte GitHub (tu en as déjà un si tu utilises GitLab, sinon créé en 1 min sur https://github.com)
- Git installé sur ta machine

---

### 🚀 Étape 1 : Créer le repo GitHub (2 minutes)

1. Va sur https://github.com/new
2. **Repository name** : `semi-marathon` (ou autre nom, mais il FAUT le reporter dans `vite.config.js`)
3. **Public** (obligatoire pour GitHub Pages gratuit)
4. Ne coche rien d'autre (pas de README, pas de gitignore)
5. Clique **"Create repository"**

---

### ⚙️ Étape 2 : Adapter le nom du repo

Si tu n'as **pas** nommé ton repo `semi-marathon`, modifie cette ligne dans `vite.config.js` :

```javascript
const REPO_NAME = 'mon-autre-nom'; // mets le vrai nom de ton repo
```

---

### 📤 Étape 3 : Pousser le code sur GitHub

Ouvre un terminal dans le dossier `pwa_semi/` et exécute :

```bash
git init
git add .
git commit -m "Initial commit - PWA semi-marathon"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/semi-marathon.git
git push -u origin main
```

Remplace `TON-USERNAME` par ton username GitHub.

---

### 🔧 Étape 4 : Activer GitHub Pages (1 minute)

1. Va sur ton repo GitHub
2. Onglet **Settings** (en haut à droite)
3. Menu de gauche : **Pages**
4. Dans **Build and deployment** → **Source** : choisir **"GitHub Actions"**
5. C'est tout ! (pas de validation nécessaire)

---

### ⏱️ Étape 5 : Attendre le build automatique (~2 min)

1. Retourne sur ton repo
2. Onglet **Actions** → tu verras le workflow "Deploy PWA to GitHub Pages" qui tourne
3. Attends qu'il passe au vert ✅
4. L'URL de ton app sera : `https://TON-USERNAME.github.io/semi-marathon/`

---

### 📱 Étape 6 : Installation sur iPhone

Envoie l'URL par SMS à ta proche. Ensuite sur son iPhone :

1. **Ouvrir l'URL dans Safari** (❗ obligatoire, pas Chrome)
2. Bouton **Partager** (icône carré + flèche)
3. Faire défiler → **"Sur l'écran d'accueil"**
4. **"Ajouter"** en haut à droite
5. ✅ L'icône rouge "SEMI 1h55" apparaît sur l'écran d'accueil
6. Tap → ouverture plein écran comme une vraie app

---

## 🔄 Mise à jour de l'app (après la config initiale)

Quand tu veux modifier quelque chose (ex: ajuster une séance) :

```bash
# 1. Modifier le code (src/App.jsx par exemple)
# 2. Commit et push
git add .
git commit -m "Adaptation sem 7"
git push

# 3. GitHub Actions rebuild et redéploie automatiquement (~2 min)
# 4. Ta proche voit la mise à jour au prochain lancement
```

**Zéro action de sa part** : le service worker détecte la mise à jour et la télécharge en arrière-plan.

---

## 💾 Persistance des données

### Fonctionnement
Les données (séances cochées, date de début) sont stockées dans le **localStorage du navigateur**.
**100% local**, aucune donnée envoyée sur internet.

### ⚠️ Le piège iOS
Safari peut purger le localStorage après **7 jours d'inactivité**. C'est rare si elle utilise l'app régulièrement.

### 🛡️ Solution intégrée : Export/Import
L'app a **3 boutons** en haut de l'onglet "Plan semaines" :
- **Export** : télécharge un backup JSON
- **Import** : restaure depuis un JSON
- **Réinitialiser** : reset (avec confirmation)

Une **bannière jaune** apparaît automatiquement au bout de 5 jours sans backup.

### 🎯 Recommandation
Lui dire de faire un export 1x par semaine (après la sortie longue du dimanche) et de s'envoyer le fichier par mail à elle-même = backup cloud gratuit.

---

## 🛠️ Développement local

```bash
npm install      # Installer les dépendances (1 fois)
npm run dev      # Mode dev avec hot reload sur http://localhost:5173
npm run build    # Build de production dans dist/
npm run preview  # Prévisualiser le build
```

---

## 📂 Structure

```
pwa_semi/
├── .github/
│   └── workflows/
│       └── deploy.yml       # Workflow auto-déploiement
├── public/                   # Icônes PWA
│   ├── favicon.svg
│   ├── pwa-192x192.png
│   ├── pwa-512x512.png
│   └── apple-touch-icon-*.png
├── src/
│   ├── App.jsx              # Code principal
│   └── main.jsx             # Point d'entrée React
├── index.html               # Meta tags iOS optimisés
├── vite.config.js           # Config Vite + PWA + base path
├── package.json
└── generate_icons.py        # Régénération des icônes
```

---

## 🎨 Personnalisation

**Changer les allures/objectif** : dans `src/App.jsx`, cherche `ALLURES` et `"1h55"`

**Changer les couleurs** : modifie `PHASE_COLORS` dans `src/App.jsx`

**Changer le nom de l'app** :
- `vite.config.js` → `manifest.name` et `short_name`
- `index.html` → `<title>` et `apple-mobile-web-app-title`

**Régénérer les icônes** après modification du SVG :
```bash
python generate_icons.py
```

---

## 🛠️ Stack technique

- **Vite 5** - Build tool
- **React 18** - UI
- **vite-plugin-pwa** - Manifest + Service Worker
- **lucide-react** - Icônes
- **localStorage** - Persistance locale
- **GitHub Actions** - CI/CD auto
- **GitHub Pages** - Hébergement gratuit

Bundle size : **~210 KB (64 KB gzippé)** - ultra léger.

---

## ✅ Checklist complète

**Config initiale (1 fois)**
- [ ] Repo GitHub créé et nommé `semi-marathon`
- [ ] Code pushé sur `main`
- [ ] GitHub Pages activé en mode "GitHub Actions"
- [ ] Premier workflow Actions passé au vert
- [ ] URL `https://USERNAME.github.io/semi-marathon/` accessible

**Installation iPhone**
- [ ] URL ouverte dans Safari
- [ ] "Sur l'écran d'accueil" → Ajouter
- [ ] Icône rouge visible sur l'écran d'accueil
- [ ] Tap sur l'icône → ouverture plein écran
- [ ] Cocher une séance test → fermer → rouvrir : la coche persiste

**Test PWA**
- [ ] Mode avion → l'app fonctionne toujours
- [ ] Export JSON fonctionne
- [ ] Date de début par défaut : 17/08/2026

---

## 🆘 Troubleshooting

**404 sur GitHub Pages** → Vérifier que `REPO_NAME` dans `vite.config.js` correspond EXACTEMENT au nom du repo GitHub.

**Workflow Actions qui échoue** → Aller dans Actions, cliquer sur le run rouge, lire les logs. Cause la plus courante : Pages pas activé en mode "GitHub Actions".

**L'app ne s'installe pas sur iPhone** → Vérifier Safari (pas Chrome). Vérifier que l'URL est HTTPS (GitHub Pages l'est toujours).

**Pas de mise à jour après push** → Attendre 2-3 min. Puis sur iPhone, swipe up sur l'app et la rouvrir.

**localStorage effacé** → Restaurer depuis le dernier backup JSON (bouton Import).

---

## 💰 Coûts

- **GitHub** : gratuit (repo public illimités)
- **GitHub Actions** : gratuit (2000 min/mois pour repos publics, largement suffisant)
- **GitHub Pages** : gratuit (pas de limite raisonnable pour ce genre d'app)
- **Domaine** : le `github.io` est gratuit. Si tu veux un domaine custom, ~10€/an.

**Total : 0€/an** 🎉

---

Bonne préparation ! 🏁🔥
