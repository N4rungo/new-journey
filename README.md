# Portfolio Village (React + Vite + Tailwind)

Une GitHub Page qui présente votre profil sous forme de carte de village médiéval, avec bâtiments cliquables.

## Prérequis
- Node.js >= 18 (recommandé 20)
- Un compte GitHub

## Développement local
```bash
npm install
npm run dev
```
Puis ouvrez http://localhost:5173/

## Déploiement sur GitHub Pages

### Option A — **Projet** dans un repo (recommandé)
1. **Créer le dépôt** sur GitHub (par ex. `portfolio-village`).  
2. Sur votre machine :
   ```bash
   git init
   git branch -M main
   git remote add origin https://github.com/<votre-user>/<repo>.git
   npm install
   git add -A
   git commit -m "feat: init"
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages**  
   - "Build and deployment" = *GitHub Actions* (par défaut)  
4. Le workflow `.github/workflows/deploy.yml` fourni va : installer, builder et déployer.  
   - Il passe `VITE_BASE="/<repo>/"` pour que Vite génère des URLs correctes.
5. Votre site sera disponible à : `https://<user>.github.io/<repo>/`

### Option B — **Site utilisateur** (sans sous-chemin)
Si vous nommez le repo `monuser.github.io`, alors le site sera à la racine et **pas besoin** de `VITE_BASE` personnalisé.  
Modifiez le job *Build* pour retirer la variable d'environnement :
```yaml
- name: Build
  run: npm run build
```
Et dans `vite.config.js`, laissez `base: '/'` (déjà le cas par défaut).

## Personnalisation du contenu
- Les bâtiments sont définis dans `src/App.jsx` dans le tableau `BUILDINGS` (position en pourcentage).  
- Les pages `Château/Caserne/Auberge/CV` sont des composants simples que vous pouvez alimenter avec vos vrais contenus (on pourra passer en Markdown/JSON plus tard).

## Notes techniques
- Routing **hash** (`#/chateau`) pour éviter les 404 sur GH Pages.
- Accessibilité : focus visible, alternative "Place du village" en liste.
- Performances : SVG léger + Tailwind + Framer Motion avec `prefers-reduced-motion`.

## Licence
MIT
