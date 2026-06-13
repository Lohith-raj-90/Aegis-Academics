# Aegis Academics: Quick Deployment Reference

## TL;DR - The Changes Made

✅ **vite.config.ts** - Added `base: '/Aegis-Academics/'`  
✅ **package.json** - Split build scripts (frontend-only now)  
✅ **.github/workflows/deploy.yml** - Created automated deployment workflow  

## Deployment Commands

```bash
# Test build locally
npm run build

# Preview the production build
npm run preview

# Deploy (commit and push to main)
git push origin main
# → Workflow triggers automatically
# → Site updates in 1-2 minutes
```

## What Each File Does

### vite.config.ts
- **`base: '/Aegis-Academics/'`** - Makes assets load from correct GitHub Pages subfolder path
- **`plugins`** - Handles React JSX and Tailwind CSS
- **`build.outDir: 'dist'`** - Creates `dist/` folder with static files

### package.json Scripts
- **`npm run dev`** - Local development server
- **`npm run build`** - Build for GitHub Pages (frontend only)
- **`npm run preview`** - Test the production build locally
- **`npm run lint`** - Type check your code

### .github/workflows/deploy.yml
- **Trigger** - Runs when you push to `main` branch
- **Jobs** - Builds project, then deploys to GitHub Pages
- **Result** - Your site updates automatically

## Deployment Checklist

- [ ] Commit all changes
- [ ] Push to `main` branch
- [ ] Watch GitHub Actions (Actions tab)
- [ ] Wait for workflow to complete (✅ green checkmark)
- [ ] Visit `https://lohith-raj-90.github.io/Aegis-Academics/`

## Browser Shows Blank Page?

### First: Clear Cache
```
Ctrl+Shift+Delete (Windows)
→ Clear browsing data
→ Hard refresh: Ctrl+Shift+R
```

### Then: Check Console
```
F12 → Console tab
Look for errors like:
  404 /assets/main-xyz.js
  → Means base path is wrong
```

### Verify Configuration
1. Check `vite.config.ts` has: `base: '/Aegis-Academics/'`
2. Check package.json build script is: `"build": "vite build"`
3. Rebuild locally: `npm run build`
4. Run: `npm run preview`
5. Push changes to GitHub

## GitHub Pages Settings

1. Go to repository **Settings**
2. Scroll to **Pages** section
3. Under "Build and deployment":
   - Source: Choose **"GitHub Actions"** (recommended)
   - OR: Set branch to `main`, folder to `/dist`
4. Should show: *"Your site is live at https://lohith-raj-90.github.io/Aegis-Academics/"*

## Monitoring Deployments

1. Go to repository → **Actions** tab
2. See all workflow runs
3. Click latest run to see:
   - Build logs
   - Deploy status
   - Any errors

## Future Deployments

```bash
# Every push to main auto-deploys
git add .
git commit -m "Your message"
git push origin main
# ✅ Automatically deployed in 1-2 minutes
```

## Testing Production Build Locally

```bash
npm run build    # Creates dist/ folder
npm run preview  # Opens http://localhost:4173/Aegis-Academics/
# Test everything works before pushing
```

## File Structure After Build

```
dist/
├── index.html              # Entry point
├── assets/
│   ├── main-xyz.js        # Your React app
│   ├── index-abc.css      # Tailwind styles
│   └── vendor-def.js      # React + dependencies
```

## TypeScript to JavaScript Process

1. **Transpile** - TypeScript → JavaScript
2. **Bundle** - Combine all imports into single files
3. **Minify** - Remove unnecessary code
4. **Optimize** - Tree-shake unused code
5. **Output** - Create `dist/` with static files ready for GitHub Pages

## Why It Was Blank Before

❌ No `base` path → Assets loaded from wrong URL  
❌ Build script included backend → Can't run on GitHub Pages  
❌ No GitHub Actions workflow → Manual setup needed  

## Why It Works Now

✅ `base: '/Aegis-Academics/'` → Correct asset paths  
✅ Frontend-only build → Static files for GitHub Pages  
✅ GitHub Actions → Automatic deployment  

## Useful Links

- **Troubleshooting Guide** - See `GITHUB_PAGES_TROUBLESHOOTING.md`
- **Detailed Config** - See `DEPLOYMENT_CONFIG.md`
- **Vite Docs** - https://vitejs.dev/config/
- **GitHub Pages Docs** - https://docs.github.com/en/pages
- **GitHub Actions** - https://docs.github.com/en/actions

## Need Backend API Later?

GitHub Pages is frontend-only. For a backend API, consider:
- **Vercel** (easy, free tier)
- **Railway** (simple full-stack)
- **Render** (good for Express)

For now, frontend-only works great!

