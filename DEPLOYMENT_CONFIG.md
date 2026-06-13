# Aegis Academics: Deployment Configuration Guide

## Overview

This guide explains how your Aegis Academics project is configured for deployment to GitHub Pages and covers the complete deployment architecture.

---

## Architecture

### Current Setup

```
┌─────────────────┐
│   Source Code   │
│  (TypeScript)   │
└────────┬────────┘
         │
         └──→ [npm run build]
              └──→ Vite transpiles TS→JS
              └──→ Bundles React + dependencies
              └──→ Optimizes CSS
         │
┌────────▼─────────────┐
│   dist/ folder       │
│ (Static HTML/JS/CSS) │
└────────┬─────────────┘
         │
         └──→ [Git push]
              └──→ GitHub Actions runs workflow
              └──→ Builds & deploys automatically
         │
┌────────▼──────────────────────┐
│ GitHub Pages Server            │
│ https://lohith-raj-90.github.io│
│ /Aegis-Academics/              │
└───────────────────────────────┘
```

### Build Pipeline

1. **Local Development**
   - Run: `npm run dev`
   - Vite dev server runs with HMR (Hot Module Replacement)
   - Code changes reflect instantly
   - TypeScript checked automatically

2. **Production Build**
   - Run: `npm run build`
   - Vite reads `vite.config.ts`:
     - `base: '/Aegis-Academics/'` → All assets prepended with this path
     - `build.outDir: 'dist'` → Output goes to `dist/` folder
     - `build.emptyOutDir: true` → Cleans old `dist/` before rebuilding
   - Output: Optimized, minified static files

3. **Automated Deployment (GitHub Actions)**
   - Workflow: `.github/workflows/deploy.yml`
   - Trigger: Every push to `main` branch
   - Steps:
     - Checkout code
     - Setup Node 18
     - Install dependencies (`npm ci`)
     - Run linting (`npm run lint`)
     - Build project (`npm run build`)
     - Upload `dist/` folder to GitHub Pages
     - Deploy to `https://lohith-raj-90.github.io/Aegis-Academics/`

---

## Configuration Files Explained

### 1. `vite.config.ts` - Build Configuration

```typescript
export default defineConfig({
  base: '/Aegis-Academics/',  // ← Critical for GitHub Pages subfolder
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') }  // Path alias for imports
  },
  build: {
    outDir: 'dist',            // Output directory
    emptyOutDir: true,         // Clean before rebuild
    sourcemap: false,          // Set to true for debugging
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
```

**Key Points:**
- `base` is absolutely essential - without it, assets load from wrong paths
- `plugins` includes React JSX support and Tailwind CSS support
- `build` configuration optimizes for production

### 2. `package.json` - Scripts & Dependencies

```json
{
  "scripts": {
    "dev": "tsx server.ts",           // Dev server (local only)
    "build": "vite build",            // Build for GitHub Pages
    "build:server": "...",            // Separate script for backend
    "preview": "vite preview",        // Preview production build locally
    "start": "node dist/server.cjs",  // Start server (not used on GitHub Pages)
    "lint": "tsc --noEmit"            // Type checking
  }
}
```

**Changes Made:**
- Separated `build` and `build:server` scripts
- `build` now only builds frontend (for GitHub Pages)
- `build:server` available for future backend deployment

### 3. `.github/workflows/deploy.yml` - Automated Deployment

```yaml
on:
  push:
    branches: [main]      # Trigger on pushes to main
  workflow_dispatch:      # Manual trigger option

jobs:
  build:
    - Checkout code
    - Setup Node 18 environment
    - Install dependencies with npm ci (locked versions)
    - Run linting for type safety
    - Build with npm run build
    - Upload dist/ artifact to GitHub Pages

  deploy:
    - Takes build artifact
    - Deploys to GitHub Pages
    - Sets environment URL
```

**Advantages:**
- Fully automated - push to main = automatic deployment
- Includes type checking before deployment
- Reproducible builds (npm ci)
- Manual trigger option via GitHub UI

### 4. `tsconfig.json` - TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",              // Modern JavaScript
    "module": "ESNext",              // Latest module syntax
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",              // React 17+ JSX
    "moduleResolution": "bundler",   // Vite's module resolution
    "isolatedModules": true,         // Each file is isolated
    "noEmit": true                   // tsc doesn't emit files (Vite does)
  }
}
```

---

## Step-by-Step Deployment Process

### Phase 1: Local Setup ✓

```bash
# Already done - your project structure is ready
```

### Phase 2: Configure GitHub Pages

1. **Go to repository settings:**
   - GitHub → Your repo → Settings → Pages

2. **Choose deployment source:**
   - Option A (Recommended): "GitHub Actions"
     - Automatically uses workflow from `.github/workflows/`
     - More flexible and professional
   
   - Option B (Alternative): "Deploy from a branch"
     - Branch: `main`
     - Folder: `/dist`
     - **Note:** You must manually push `dist/` folder to GitHub

3. **Enable Pages**
   - Should show: "Your site is live at https://lohith-raj-90.github.io/Aegis-Academics/"

### Phase 3: Deploy (First Time)

```bash
# 1. Commit workflow file
git add .github/workflows/deploy.yml

# 2. Commit configuration changes
git add vite.config.ts package.json

# 3. Push to main branch
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

### Phase 4: Monitor Deployment

1. **GitHub Actions Tab:**
   - Go to repository → Actions
   - Watch workflow run in real-time
   - Should see: build ✓ → deploy ✓

2. **Verify Deployment:**
   - Visit: https://lohith-raj-90.github.io/Aegis-Academics/
   - Check browser Console (F12) for errors
   - Verify assets load (Network tab)

### Phase 5: Automatic Future Deployments

```bash
# Every push to main automatically triggers deployment
git add .
git commit -m "Update feature"
git push origin main
# → GitHub Actions runs automatically
# → Site updates in ~1-2 minutes
```

---

## What Gets Built

When `npm run build` executes, Vite creates:

```
dist/
├── index.html                    # Entry point (modified with base path)
├── assets/
│   ├── main-abc123.js           # Your React app (minified)
│   ├── index-xyz789.css         # Tailwind CSS (generated from your styles)
│   └── vendor-def456.js         # React, DOM, other deps (minified)
└── [other static files from public/]
```

### Key Transformations:

1. **`src/main.tsx`**
   ```typescript
   // Before
   <script type="module" src="/src/main.tsx"></script>
   
   // After (in dist/index.html)
   <script type="module" src="/Aegis-Academics/assets/main-abc123.js"></script>
   ```

2. **CSS**
   ```css
   /* Tailwind directives compiled to actual CSS */
   @tailwind base;     →  actual base styles
   @tailwind components; → actual component styles
   @tailwind utilities;  → actual utility styles
   ```

3. **Imports**
   ```typescript
   // All these are bundled into single files
   import React from 'react';
   import components from './components';
   import styles from './index.css';
   ```

---

## Troubleshooting Checklist

- [ ] `vite.config.ts` has `base: '/Aegis-Academics/'` with trailing slash
- [ ] `package.json` `build` script is just `vite build`
- [ ] `.github/workflows/deploy.yml` exists
- [ ] `.gitignore` includes `dist/` and `node_modules/`
- [ ] GitHub Pages enabled in Settings → Pages
- [ ] Workflow file is committed and pushed to `main`
- [ ] GitHub Actions shows successful build
- [ ] Site URL shows: `https://lohith-raj-90.github.io/Aegis-Academics/`
- [ ] Browser has no 404 errors in Console
- [ ] JavaScript files load with correct path prefix

---

## Common Issues & Fixes

### Issue: Blank Page After Deployment

**Check:**
1. Browser console (F12) for JavaScript errors
2. Network tab → check if files have 404 status
3. Verify `base` path in `vite.config.ts`
4. Hard refresh: Ctrl+Shift+R

### Issue: 404 for Static Assets

**Likely Cause:** Missing `base: '/Aegis-Academics/'`

**Fix:**
```typescript
// vite.config.ts
export default defineConfig({
  base: '/Aegis-Academics/',  // Add this
  // ...
});
```

### Issue: GitHub Actions Workflow Not Running

**Check:**
1. File path: `.github/workflows/deploy.yml` (exact path)
2. File is committed and pushed to `main`
3. Repository has Actions enabled (Settings → Actions)

### Issue: Old Cached Version Showing

**Solutions:**
1. Hard refresh in browser: Ctrl+Shift+R
2. Clear browser cache completely
3. Try private/incognito window
4. Wait 5-10 minutes for cache to expire

---

## Performance Optimization (Optional)

### Enable Source Maps for Debugging

```typescript
// vite.config.ts
build: {
  sourcemap: true,  // Helps debug production issues
}
```

**Trade-off:** Larger build output, but full TypeScript errors visible in browser

### Lazy Loading Routes

```typescript
// src/App.tsx
const DashboardView = lazy(() => import('./components/DashboardView'));
// Reduces initial bundle size
```

### Bundle Analysis

```bash
# Install analyzer
npm install --save-dev vite-plugin-visualizer

# Then add to vite.config.ts and run build
# See bundle composition
```

---

## Deployment to Other Platforms (Future)

### If You Want Backend Later

**Vercel** (Recommended for Next.js)
- Supports TypeScript React directly
- Serverless backend (same deployment)
- Free tier available

**Netlify** (Similar to Vercel)
- Great GitHub Pages alternative
- Built-in CI/CD with GitHub
- Good for frontend-only projects

**Railway / Heroku**
- For full-stack (frontend + Express backend)
- Different deployment process
- Paid tier required for production

---

## Maintenance

### Keep Dependencies Updated

```bash
npm update
npm audit fix
```

### Regular Testing

```bash
# Before each deployment
npm run lint      # Type check
npm run build     # Ensure build succeeds
npm run preview   # Test locally
```

### Monitor GitHub Actions

- Check Actions tab regularly
- Fix any failing workflows immediately
- Review build times and cache efficiency

---

## Summary

| Component | Purpose | Status |
|-----------|---------|--------|
| `vite.config.ts` | Build configuration with base path | ✅ Updated |
| `package.json` | Build scripts separated | ✅ Updated |
| `.github/workflows/deploy.yml` | Automated deployment | ✅ Created |
| GitHub Pages Settings | Enable GitHub Actions deployment | ⏳ Manual setup needed |
| `npm run build` | Local build testing | Ready to use |
| `npm run preview` | Test production build | Ready to use |

**Next Steps:**
1. Commit and push all changes
2. Go to Settings → Pages and ensure GitHub Actions is selected
3. Watch workflow in Actions tab
4. Site should be live within 1-2 minutes!

