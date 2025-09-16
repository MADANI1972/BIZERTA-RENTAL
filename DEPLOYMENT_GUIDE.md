# 🚀 Guide de déploiement Bizerta_Rental

## ❌ **Problème identifié**

L'erreur `react-scripts: command not found` indique que les dépendances du frontend ne sont pas installées correctement lors du build sur Vercel.

## ✅ **Solutions**

### **Option 1 : Déploiement Frontend seul (Recommandé)**

**1. Mise à jour des fichiers de configuration :**

Remplacez ces fichiers dans votre projet :
- `package.json` (racine) ← Version corrigée
- `frontend/package.json` ← Avec toutes les dépendances
- `vercel.json` ← Configuration Vercel
- `frontend/postcss.config.js` ← Configuration PostCSS

**2. Configurez Vercel pour le frontend uniquement :**

Dans les paramètres Vercel :
- **Root Directory :** `frontend`
- **Build Command :** `npm run build`
- **Output Directory :** `build`
- **Install Command :** `npm install`

**3. Variables d'environnement Vercel :**

Ajoutez dans Vercel Dashboard > Settings > Environment Variables :
```
REACT_APP_SUPABASE_URL=https://pxgeckzjsavfzzrwztcd.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4Z2Vja3pqc2F2Znp6cnd6dGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MDg5NTEsImV4cCI6MjA3MzI4NDk1MX0.DM3tOiRRMX0pYQa6bxiSqOdH6e6PSPqSzAj8BE3hbco
REACT_APP_API_URL=https://your-backend-url.com/api
REACT_APP_SITE_NAME=Bizerta_Rental
```

### **Option 2 : Déploiement séparé Frontend/Backend**

**Frontend (Vercel) :**
1. Créez un nouveau repo GitHub juste pour le dossier `frontend/`
2. Déployez ce repo sur Vercel

**Backend (Railway/Render/Heroku) :**
1. Créez un nouveau repo GitHub juste pour le dossier `backend/`
2. Déployez ce repo sur Railway, Render ou Heroku

### **Option 3 : Correction rapide actuelle**

Si vous voulez corriger le déploiement actuel :

**1. Ajoutez un fichier `.vercelignore` à la racine :**
```
backend/
database/
*.md
*.txt
*.bat
```

**2. Modifiez le `package.json` racine :**
```json
{
  "scripts": {
    "build": "cd frontend && npm install && npm run build"
  }
}
```

**3. Poussez les modifications :**
```bash
git add .
git commit -m "Fix Vercel deployment configuration"
git push
```

## 🎯 **Recommandation**

**Utilisez l'Option 1** - C'est la plus simple et efficace :

1. ✅ Mettez à jour les fichiers de configuration
2. ✅ Configurez Vercel pour pointer sur le dossier `frontend/`
3. ✅ Ajoutez les variables d'environnement
4. ✅ Redéployez

## 🔧 **Configuration complète Vercel**

**Project Settings :**
- Framework Preset: `Create React App`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`
- Node.js Version: `18.x`

**Environment Variables :**
```
REACT_APP_SUPABASE_URL=https://pxgeckzjsavfzzrwztcd.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4Z2Vja3pqc2F2Znp6cnd6dGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MDg5NTEsImV4cCI6MjA3MzI4NDk1MX0.DM3tOiRRMX0pYQa6bxiSqOdH6e6PSPqSzAj8BE3hbco
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SITE_NAME=Bizerta_Rental
```

Après ces modifications, votre déploiement devrait fonctionner parfaitement ! 🚀
