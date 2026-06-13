# 🚀 Aegis Academics: Step-by-Step Deployment Instructions

## Summary of Changes Made

Your project has been configured for GitHub Pages deployment with:

✅ **Base path configuration** - Assets now load from correct subfolder location  
✅ **Frontend-only build** - Optimized for static hosting  
✅ **Automated deployment** - GitHub Actions handles everything  

---

## Phase 1: Commit Configuration Changes (5 minutes)

### Step 1: Review Changes
```bash
git status
```
You should see:
- `vite.config.ts` (modified)
- `package.json` (modified)
- `.github/workflows/deploy.yml` (new)
- `GITHUB_PAGES_TROUBLESHOOTING.md` (new)
- `DEPLOYMENT_CONFIG.md` (new)
- `QUICK_REFERENCE.md` (new)
- `IMPLEMENTATION_SUMMARY.md` (new)

### Step 2: Commit All Changes
```bash
git add .
git commit -m "Configure GitHub Pages deployment with base path and GitHub Actions"
```

### Step 3: Push to GitHub
```bash
git push origin main
```

---

## Phase 2: Enable GitHub Pages (3 minutes)

### Step 1: Go to Repository Settings
1. Navigate to your GitHub repository
2. Click **Settings** (top navigation)
3. Scroll down to **Pages** section (left sidebar)

### Step 2: Configure Deployment Source
**Recommended Approach: GitHub Actions**
- Source: Select **"GitHub Actions"**
- This automatically uses `.github/workflows/deploy.yml`
- Click Save

**Alternative Approach: Deploy from branch**
- Source: Select **"Deploy from a branch"**
- Branch: `main`
- Folder: `/dist`
- Click Save

### Step 3: Verify Pages is Enabled
You should see a message like:
> "Your site is live at https://lohith-raj-90.github.io/Aegis-Academics/"

---

## Phase 3: Monitor Deployment (2-5 minutes)

### Step 1: Go to Actions Tab
1. In your repository, click **Actions** tab (top navigation)
2. You should see the workflow running

### Step 2: Watch the Workflow
The workflow has two jobs that run in sequence:

**Job 1: Build**
- ✅ Checkout code
- ✅ Setup Node.js 18
- ✅ Install dependencies
- ✅ Run type checking (lint)
- ✅ Build project (creates `dist/`)
- ✅ Upload artifact

**Job 2: Deploy**
- ✅ Download artifact
- ✅ Deploy to GitHub Pages
- ✅ Site goes live

Look for: ✅ Green checkmarks = Success

### Step 3: Check Deployment Status
Click on the workflow run to see:
- Detailed logs
- Build output
- Deployment status
- Any errors (if they occur)

---

## Phase 4: Verify Your Site (1 minute)

### Step 1: Visit Your Live Site
Open in browser:
```
https://lohith-raj-90.github.io/Aegis-Academics/
```

### Step 2: Check Page Loads
- Does it show content? (Not blank page)
- Do you see the Aegis logo/header?
- Can you interact with the UI?

### Step 3: Open Developer Console
Press **F12** and check:
```
Console tab:
  - Look for RED errors like:
    ❌ 404 /assets/main.js
    ❌ Cannot find React
  - Should show NO errors (maybe some warnings)

Network tab:
  - Look at asset files
  - Should ALL be 200 (green)
  - File URLs should include: /Aegis-Academics/assets/
```

### Step 4: Test Features
- Click navigation buttons
- Try interactive features
- Verify no JavaScript errors in console

---

## Phase 5: Future Updates (Automatic!)

After the initial setup, deployment is completely automatic:

```bash
# Make code changes
# ... edit files in src/ ...

# Commit and push
git add .
git commit -m "Update feature XYZ"
git push origin main

# ✅ Automatically deployed in 1-2 minutes!
# No manual steps needed
```

---

## Troubleshooting

### 1. Page Still Shows Blank

**Fix Step 1: Hard refresh browser**
- Windows: `Ctrl+Shift+R`
- Mac: `Cmd+Shift+R`
- Wait 10 seconds
- Try again

**Fix Step 2: Check console errors (F12)**
- Look for 404 errors
- If error shows: `404 /assets/main.js`
  - Means `base` path is missing
  - Check `vite.config.ts` has: `base: '/Aegis-Academics/'`

**Fix Step 3: Verify workflow succeeded**
- Go to Actions tab
- Latest workflow should have ✅ (green checkmark)
- If ❌ (red), click to see error logs

**Fix Step 4: Test locally**
```bash
npm run build          # Build locally
npm run preview        # Test the build
# Should see: http://localhost:4173/Aegis-Academics/
```

### 2. Workflow Shows Error

1. Go to Actions tab
2. Click the failed workflow
3. Click the failed job (usually "build")
4. Scroll through logs to find error
5. Common errors:
   - `error TS2307: Cannot find module` → Import path issue
   - `npm ERR!` → Dependency issue, try `npm install` locally
   - `esbuild` error → Only in `build:server`, not critical for GitHub Pages

### 3. Continuous Blank Page After 10 Minutes

Try these in order:

**Option A: Clear all browser cache**
```
F12 → Application → Clear site data → Close and reopen browser
```

**Option B: Try incognito/private window**
- No extensions, no cache
- Tests clean environment

**Option C: Try different browser**
- Chrome, Firefox, Safari, Edge
- Rules out browser-specific issues

**Option D: Test production build locally**
```bash
npm run build
npm run preview
# Should work locally before pushing to GitHub
```

---

## Verification Checklist

### Before Pushing ✓

- [ ] `vite.config.ts` contains `base: '/Aegis-Academics/'`
- [ ] `package.json` has separate `build` and `build:server`
- [ ] `.github/workflows/deploy.yml` exists
- [ ] All changes committed to git
- [ ] No uncommitted files

### After Pushing ✓

- [ ] GitHub Actions workflow started (Actions tab)
- [ ] Workflow completed within 2-3 minutes
- [ ] Both jobs show ✅ (green)
- [ ] GitHub Pages shows your site URL
- [ ] Site loads without errors
- [ ] No 404 errors in console
- [ ] All interactive features work

---

## Key Files & Their Roles

| File | Purpose | Status |
|------|---------|--------|
| `vite.config.ts` | Build config with base path | ✅ Updated |
| `package.json` | npm scripts | ✅ Updated |
| `.github/workflows/deploy.yml` | Automation workflow | ✅ Created |
| `index.html` | Entry point | ✅ Unchanged |
| `src/main.tsx` | React entry | ✅ Unchanged |
| `.gitignore` | Exclude dist/ | ✅ Already configured |

---

## Commands Reference

```bash
# Development
npm run dev         # Local dev server with hot reload

# Building
npm run build       # Build for GitHub Pages (MAIN)
npm run build:server # Build backend (optional)
npm run preview     # Test production build locally

# Maintenance
npm run lint        # Check TypeScript types
npm run clean       # Remove dist/ and build files
npm install         # Install dependencies
npm update          # Update packages
npm audit fix       # Fix security issues
```

---

## Expected Timeline

| Step | Time | Action |
|------|------|--------|
| Commit | 2 min | `git push origin main` |
| GitHub Pages Setup | 2 min | Configure Settings → Pages |
| Workflow Build | 2-3 min | Automatic (watch Actions tab) |
| Site Live | 30 sec | Appears in GitHub Pages settings |
| **Total** | **~5-7 min** | **From push to live site** |

---

## Important Notes

### 1. Trailing Slash in Base Path
```typescript
✅ CORRECT:   base: '/Aegis-Academics/'
❌ WRONG:     base: '/Aegis-Academics'
```
The trailing slash is REQUIRED!

### 2. Only Frontend Deploys to GitHub Pages
- GitHub Pages = static file hosting only
- Cannot run Node.js backend
- Express server (`server.ts`) not deployed
- If you need backend API later, use different hosting

### 3. Dist Folder Not Committed
- `.gitignore` excludes `dist/`
- GitHub Actions builds it automatically
- Never commit `dist/` to repository

### 4. Every Push = Automatic Deployment
- Set it and forget it!
- Just push code changes
- Site updates automatically
- No manual deployment steps

---

## Still Have Questions?

### Read These Documents (in order)

1. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Commands and quick lookup
2. **[GITHUB_PAGES_TROUBLESHOOTING.md](GITHUB_PAGES_TROUBLESHOOTING.md)** - Detailed troubleshooting
3. **[DEPLOYMENT_CONFIG.md](DEPLOYMENT_CONFIG.md)** - Architecture and details
4. **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What changed and why

### External Resources

- **Vite Documentation** - https://vitejs.dev/
- **GitHub Pages Docs** - https://docs.github.com/en/pages
- **GitHub Actions Docs** - https://docs.github.com/en/actions
- **React Documentation** - https://react.dev/

---

## 🎉 You're Ready!

Your Aegis Academics project is now configured for:
- ✅ GitHub Pages subfolder deployment
- ✅ Automatic builds on every push
- ✅ Production-optimized static files
- ✅ Type checking before deployment

**Next Step:** Follow Phase 1 above to commit and push! 🚀

