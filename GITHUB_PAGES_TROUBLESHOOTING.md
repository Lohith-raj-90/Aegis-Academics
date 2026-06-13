# GitHub Pages Deployment Troubleshooting Guide

## Problem: Blank Page on GitHub Pages

When your TypeScript React project shows a blank page at `https://lohith-raj-90.github.io/Aegis-Academics/`, it's usually due to one or more of these issues:

---

## Root Causes & Solutions

### 1. **Missing Base Path Configuration** ⚠️ CRITICAL

**Problem:** Assets are served from `/` but GitHub Pages serves from `/Aegis-Academics/`

**Symptom:** Browser console shows 404 errors for JavaScript/CSS files
- Expected: `/Aegis-Academics/assets/main-xyz.js`
- Actual: `/assets/main-xyz.js` (fails because repo is a subfolder)

**Solution:** Update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/Aegis-Academics/', // Add this line
  // ... rest of config
});
```

**Why:** This tells Vite to prepend `/Aegis-Academics/` to all asset paths in the generated HTML/JS files.

---

### 2. **Incorrect Build Output**

**Problem:** The build script is bundling the Node.js backend server, which GitHub Pages can't execute.

**Current issue in package.json:**
```json
"build": "vite build && esbuild server.ts --bundle ..."
```

**Solution:** Create a separate build script for GitHub Pages that only builds the frontend:

```json
"build": "vite build",
"build:server": "esbuild server.ts --bundle ..."
```

**Why:** GitHub Pages is a static file host. It cannot run Node.js servers. You only need the Vite build output (HTML, CSS, JS).

---

### 3. **Wrong Deployment Branch/Folder**

**Problem:** GitHub Pages isn't configured to deploy from the correct source

**Check in GitHub:**
1. Go to repository Settings → Pages
2. Verify "Build and deployment" source:
   - Should be: `Deploy from a branch`
   - Branch: `main` (or your main branch)
   - Folder: `/ (root)` or `/dist`

**Note:** If you see `/ (root)`, the built files must be in the root. Better approach: use `/ (root)` with `/dist` subfolder (see GitHub Actions setup below).

---

### 4. **Entry Point Misconfiguration**

**Problem:** `index.html` isn't recognized as the entry point

**Check:** Your `index.html` must:
- Be in the root directory (✓ You have this)
- Have `<div id="root"></div>` (✓ You have this)
- Reference the correct script: `<script type="module" src="/src/main.tsx"></script>`

**Issue with GitHub Pages:** When deployed to a subfolder, the script path should be:
```html
<script type="module" src="/Aegis-Academics/src/main.tsx"></script>
```

**Solution:** Vite's `base` config automatically handles this! With `base: '/Aegis-Academics/'`, all paths are rewritten correctly.

---

### 5. **Stale Browser Cache**

**Problem:** You fixed the config but still see a blank page

**Solution:**
```bash
# Clear browser cache (Ctrl+Shift+Delete in most browsers)
# OR use hard refresh: Ctrl+Shift+R (Windows)
```

---

## TypeScript to Static Assets Build Process

### What Happens When You Run `npm run build`

1. **TypeScript Transpilation**
   - Vite reads your `.tsx` files
   - Converts TypeScript → JavaScript
   - Output: `dist/index.html`, `dist/assets/main-xyz.js`, `dist/assets/style-xyz.css`

2. **Bundling**
   - All imports are resolved
   - Code is minified and optimized
   - Source maps generated (optional)

3. **Output Structure**
   ```
   dist/
   ├── index.html          (Main entry point)
   ├── assets/
   │   ├── main-xyz.js     (Your app JavaScript)
   │   ├── style-xyz.css   (Your styles)
   │   └── vendor-xyz.js   (Dependencies: React, etc.)
   └── [other static assets]
   ```

4. **What vite.config.ts Controls**
   - `base`: Asset path prefix
   - `build.outDir`: Where to put `dist/`
   - `build.emptyOutDir`: Clean `dist/` before rebuilding
   - `plugins`: How to handle JSX, CSS, etc.

---

## Configuration Changes Required

### Step 1: Update `vite.config.ts`

```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Aegis-Academics/', // ← ADD THIS
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false, // Set to true for debugging
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
```

### Step 2: Update `package.json` Build Scripts

```json
{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build",
    "build:server": "esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "preview": "vite preview",
    "clean": "rm -rf dist server.js",
    "lint": "tsc --noEmit"
  }
}
```

### Step 3: Update `.gitignore` (if not already set)

```
node_modules/
dist/
.env
.env.local
.DS_Store
*.db
*.db-shm
*.db-wal
```

---

## GitHub Actions Automated Deployment

### Create `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]  # Change to your default branch
  workflow_dispatch:   # Allow manual deployment

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### How It Works:

1. **Trigger:** Every push to `main` branch
2. **Build:** Installs deps, runs `npm run build`
3. **Output:** Creates `dist/` folder with static files
4. **Deploy:** Uploads `dist/` to GitHub Pages

### Enable in Repository:

1. Go to Settings → Pages
2. Set "Build and deployment":
   - Source: `GitHub Actions` (or if not available, set branch to `main`, folder to `/dist`)
3. Commit the `.github/workflows/deploy.yml` file
4. Push to `main` → Workflow runs automatically

---

## Verification Checklist

After applying the changes, verify:

- [ ] `vite.config.ts` has `base: '/Aegis-Academics/'`
- [ ] `package.json` build script is `vite build` (not bundling server)
- [ ] `.github/workflows/deploy.yml` exists
- [ ] `npm run build` creates `dist/` folder locally
- [ ] `dist/index.html` exists
- [ ] `dist/index.html` contains: `<script ... src="/Aegis-Academics/assets/main-...js"></script>`
- [ ] GitHub Pages is configured to deploy from GitHub Actions (or branch `main`, folder `/dist`)
- [ ] Latest commit is pushed to GitHub
- [ ] GitHub Actions workflow has completed successfully (check Actions tab)
- [ ] Browser DevTools Network tab shows assets loading from correct path

---

## Local Testing Before Deployment

To test the GitHub Pages build locally:

```bash
# Build for production
npm run build

# Preview the build
npm run preview
```

Browser will show something like `http://localhost:4173/Aegis-Academics/`

Verify:
- Page loads (not blank)
- No 404 errors in Console
- Interactive features work

---

## Troubleshooting Browser Console Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `404 for /assets/main-xyz.js` | Missing `base` path | Add `base: '/Aegis-Academics/'` to vite.config.ts |
| `Uncaught SyntaxError` | Old cached JavaScript | Hard refresh: Ctrl+Shift+R |
| `Cannot read properties of null (reading 'innerHTML')` | `<div id="root">` not found | Check `index.html` has correct div |
| `React is not defined` | React import missing | Check `src/main.tsx` imports |

---

## Backend Considerations

**Important:** GitHub Pages cannot run your Express backend (`server.ts`).

### Options:

**Option 1: Static-only deployment (Recommended for GitHub Pages)**
- Deploy only frontend to GitHub Pages
- No backend API calls possible
- Build: `npm run build`

**Option 2: Full-stack deployment to Heroku/Vercel/Railway**
- Deploy frontend + backend together
- Supports API calls
- Different deployment process

**Option 3: Hybrid approach**
- Frontend: GitHub Pages
- Backend: Separate hosting (Heroku, Railway, AWS Lambda)
- Frontend calls backend API at different domain

For now, the frontend-only GitHub Pages deployment assumes no API calls to your Express server.

---

## Common Pitfalls to Avoid

❌ **Don't:** Forget the trailing slash: `base: '/Aegis-Academics'`  
✓ **Do:** Use trailing slash: `base: '/Aegis-Academics/'`

❌ **Don't:** Keep server bundling in the main build script  
✓ **Do:** Create separate `build:server` script

❌ **Don't:** Push `dist/` to GitHub  
✓ **Do:** Let GitHub Actions build and deploy automatically

❌ **Don't:** Use relative paths like `<img src="logo.png">`  
✓ **Do:** Use: `<img src="/Aegis-Academics/logo.png">` or let Vite handle it with imports

---

## Need More Help?

- **Vite Docs:** https://vitejs.dev/config/base.html
- **GitHub Pages Docs:** https://docs.github.com/en/pages
- **GitHub Actions:** https://docs.github.com/en/actions
- **React TypeScript Setup:** https://vitejs.dev/guide/#scaffolding-your-first-vite-project

