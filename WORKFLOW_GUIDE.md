# Development Workflow Guide

**Complete guide for building, developing, and deploying the portfolio website**

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Development Workflow](#development-workflow)
3. [Build Process](#build-process)
4. [Available Commands](#available-commands)
5. [File Structure](#file-structure)
6. [Development Best Practices](#development-best-practices)
7. [Troubleshooting](#troubleshooting)
8. [Deployment](#deployment)
9. [CI/CD Setup (Optional)](#cicd-setup-optional)

---

## Quick Start

### Prerequisites

```bash
# Node.js 14+ and npm 6+
node --version    # Should be v14 or higher
npm --version     # Should be 6 or higher
```

### Initial Setup (First Time Only)

```bash
# 1. Clone repository
git clone https://github.com/jobayerarman/jobayerarman.github.io.git
cd jobayerarman.github.io

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Browser should open to http://localhost:3000
```

### Start Development (Every Day)

```bash
npm run dev
```

Browser will open automatically with live reload enabled.

---

## Development Workflow

### Day-to-Day Development Cycle

```
1. Start Dev Server
   npm run dev
   ↓
2. Make Changes
   Edit src/js, src/less, src/site
   ↓
3. Auto-Compile
   Gulp watches files and compiles
   ↓
4. Live Reload
   Browser automatically refreshes
   ↓
5. Iterate
   Repeat steps 2-4
   ↓
6. Commit Changes
   git add .
   git commit -m "..."
   ↓
7. Stop Dev Server
   Ctrl+C
```

### Typical Workflow Example

#### Scenario: Adding a New Skill

```bash
# Start dev server
npm run dev

# Edit skill progress bar in HTML
vim src/site/pages/index.njk

# Add LESS styles for new skill
vim src/less/4-sections/_skills.less

# Add JavaScript animation config
vim src/js/user/script.js  # Update CONFIG.TYPING_STRINGS or similar

# Changes compile automatically
# Browser reloads automatically
# Test in browser at http://localhost:3000

# When satisfied, stop dev server
Ctrl+C

# Commit changes
git add src/
git commit -m "feat(skills): add new skill with animation"
git push origin main
```

---

## Build Process

### Development Build

Used for local development with sourcemaps and unminified assets.

```bash
npm run dev
# or
NODE_ENV=development gulp dev
```

**What it does:**
1. ✅ Cleans `/dist` directory
2. ✅ Compiles LESS → CSS with sourcemaps
3. ✅ Transpiles JavaScript with sourcemaps
4. ✅ Renders HTML from templates
5. ✅ Starts BrowserSync dev server
6. ✅ Watches for file changes
7. ✅ Injects CSS changes without page reload

**Output:**
- `dist/css/main.css` (unminified, with sourcemaps)
- `dist/js/user.js` (unminified, with sourcemaps)
- `dist/js/vendor.js` (minified)
- `index.html` (rendered from templates)

**Sourcemaps:**
- `dist/css/main.css.map` (for debugging CSS)
- `dist/js/user.js.map` (for debugging JavaScript)

### Production Build

Used for deployment with minification and cache busting.

```bash
npm run build
# or
NODE_ENV=production gulp build
```

**What it does:**
1. ✅ Cleans `/dist` directory
2. ✅ Compiles LESS → CSS
3. ✅ **Minifies CSS** with cleaner output
4. ✅ Transpiles JavaScript with **Terser minification**
5. ✅ **Removes console.log()** from production code
6. ✅ **Removes debug statements**
7. ✅ **Optimizes images** (PNG, JPEG, GIF, SVG)
8. ✅ Renders HTML with **content-hash cache busting**
9. ✅ **Generates .min files** (instead of .js files)

**Output:**
- `dist/css/main.min.css` (minified, no sourcemaps)
- `dist/js/user.[hash].min.js` (minified, with content hash)
- `dist/js/vendor.[hash].min.js` (minified, with content hash)
- `index.html` (with hashed asset paths)

**Cache Control:**
- Files with content hash: Can use `Cache-Control: max-age=31536000` (1 year)
- This enables long-term caching since content hash changes only when file changes

### Build Performance Comparison

```
Development Build:    ~2 seconds (unminified, sourcemaps)
Production Build:     ~5 seconds (minified, optimized)
```

---

## Available Commands

### Main Commands

| Command | Purpose | Environment |
|---------|---------|-------------|
| `npm run dev` | Start development server with live reload | development |
| `npm run build` | Create production build | production |
| `npm run serve` | Alias for `npm run dev` | development |
| `npm run watch` | Watch files without browser sync | development |

### Utility Commands

| Command | Purpose |
|---------|---------|
| `npm run styles` | Compile LESS to CSS only |
| `npm run js` | Process JavaScript only |
| `npm run images` | Optimize images only |
| `npm run clean` | Delete all compiled files in `/dist` |
| `npm run lint` | Check JavaScript code quality |

### Gulp Commands (Advanced)

You can also run Gulp tasks directly:

```bash
# Run specific task
gulp styles              # Compile LESS
gulp js:all             # Process all JavaScript
gulp render:html        # Render HTML templates
gulp image:compress     # Optimize images
gulp browser-sync       # Start BrowserSync server
gulp watch              # Watch for file changes

# Clean commands
gulp clean:all          # Delete all dist files
gulp clean:css          # Delete CSS files
gulp clean:js           # Delete JS files
gulp clean:html         # Delete HTML files
```

---

## File Structure

### Source Files (`src/`)

```
src/
├── js/
│   ├── user/
│   │   └── script.js          ← Custom application code (REFACTORED)
│   │       ├── CONFIG         ← All configuration values
│   │       ├── Utils          ← Reusable utilities
│   │       └── Classes        ← 9 modular ES6 classes
│   └── vendor/
│       ├── ScrollMagic.js     ← Scroll animations
│       ├── TweenMax.js        ← Animation library
│       ├── Velocity.js        ← Advanced animations
│       ├── Velocity.ui.js     ← Velocity UI pack
│       ├── typed.js           ← Text typing effect
│       └── debug.addIndicators.js ← ScrollMagic debug
├── less/
│   ├── main.less              ← LESS entry point
│   ├── 1-components/          ← Base components (fonts, reset)
│   ├── 2-variables/           ← Design variables (colors, sizes)
│   ├── 3-basics/              ← Base styles (typography, buttons)
│   └── 4-sections/            ← Page sections (header, skills, etc.)
└── site/
    ├── pages/
    │   └── index.njk          ← Main page template
    └── templates/
        ├── layout.njk         ← Master layout template
        └── sections/          ← Reusable sections
```

### Compiled Output (`dist/`)

```
dist/
├── css/
│   ├── main.css              ← Dev: unminified
│   ├── main.min.css          ← Prod: minified (with hash)
│   └── main.min.css.map      ← Dev only: sourcemap
├── js/
│   ├── user.js               ← Dev: unminified
│   ├── user.[hash].min.js    ← Prod: minified with hash
│   ├── user.min.js.map       ← Dev only: sourcemap
│   ├── vendor.js             ← Vendor files
│   └── vendor.[hash].min.js  ← Prod: minified with hash
└── images/
    └── (optimized images)
```

### Configuration Files

```
Root/
├── .eslintrc.json             ← JavaScript linting rules
├── .editorconfig              ← Editor settings (indent, encoding)
├── .gitignore                 ← Git ignore patterns
├── gulpfile.js                ← Build system configuration (REFACTORED)
├── package.json               ← Dependencies and scripts (UPDATED)
├── package-lock.json          ← Locked dependency versions
├── .babelrc (implicit)        ← Babel config (in gulpfile now)
└── browserslist               ← Browser targets for Autoprefixer
```

---

## Development Best Practices

### 1. Code Style

**JavaScript:**
- Follow ESLint rules (enforced automatically)
- Use ES6+ syntax (const/let, arrow functions, classes)
- Add JSDoc comments for public methods
- Keep functions focused (single responsibility)

**Example:**
```javascript
/**
 * Safe DOM query with error handling
 * @param {string} selector - CSS selector
 * @returns {jQuery|null} jQuery element or null
 */
function querySelector(selector) {
  if (!selector) {
    console.warn('Invalid selector');
    return null;
  }
  return $(selector);
}
```

**CSS/LESS:**
- Follow existing LESS structure (4-tier organization)
- Use variables from `2-variables/` for colors and sizes
- Add sourcemaps for easier debugging
- Use mobile-first approach

**Example:**
```less
// Good: Uses variables
.button {
  color: @color-primary;
  padding: @spacing-md;
}

// Avoid: Hardcoded values
.button {
  color: #007bff;
  padding: 12px;
}
```

**HTML/Templates:**
- Use semantic HTML5 elements
- Add alt text to images
- Use Nunjucks template inheritance
- Keep markup simple and clean

### 2. Commits

Follow Angular-style commit conventions:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `style`: Style changes (formatting, missing semicolons)
- `docs`: Documentation changes
- `chore`: Maintenance, dependency updates
- `test`: Adding tests

**Examples:**
```bash
git commit -m "feat(skills): add new skill animation"
git commit -m "fix(nav): correct mobile menu toggle"
git commit -m "refactor(script.js): modularize animation code"
git commit -m "docs(README): add setup instructions"
git commit -m "chore(deps): update Gulp to 4.0.2"
```

### 3. Asset Naming Conventions

**Images:**
- Use descriptive lowercase names: `profile-photo.jpg`
- Group by type: `portfolio/project-1.jpg`
- Optimize before committing

**CSS Classes:**
- Use hyphenated names: `.navbar-main`, `.skill-bar`
- Follow BEM-inspired naming
- Avoid overly specific selectors

**JavaScript:**
- Use camelCase: `scrollToTop()`, `configSettings`
- Use UPPER_SNAKE_CASE for constants: `ANIMATION_DURATION`
- Use PascalCase for classes: `ScrollController`

### 4. Testing Changes Locally

Before pushing to production:

```bash
# 1. Run production build
npm run build

# 2. Test compiled files
# - Check dist/css/ files are minified
# - Check dist/js/ files are minified with hashes
# - Check images are optimized
# - Check index.html has correct asset paths

# 3. Test in browser
# - Open index.html in browser
# - Test all interactive features
# - Check animations work smoothly
# - Test on mobile devices

# 4. Commit and push
git add .
git commit -m "chore: production build ready"
git push origin main
```

---

## Troubleshooting

### Issue: Dev server won't start

**Error:** `Cannot find module 'gulp'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Verify installation
npm list gulp
```

### Issue: Changes not compiling

**Error:** Files not updating in `/dist`

**Solution:**
```bash
# 1. Stop dev server (Ctrl+C)
# 2. Clean output
npm run clean

# 3. Start dev server again
npm run dev

# 4. Make sure you edited src/ files (not dist/)
```

### Issue: BrowserSync not opening browser

**Error:** Browser window doesn't open automatically

**Solution:**
```bash
# BrowserSync server is running, just open manually
# Visit http://localhost:3000 in your browser

# To disable browser opening:
# Edit gulpfile.js, change: browser: getBrowser()
# To: browser: null (or remove it)
```

### Issue: CSS sourcemaps not working

**Error:** CSS debugger shows minified file instead of .less file

**Solution:**
```bash
# Make sure you're in development mode
NODE_ENV=development npm run dev

# Check devtools:
# 1. Open DevTools (F12)
# 2. Go to Sources tab
# 3. Look for .less files in file tree
# 4. If missing, refresh page (Ctrl+Shift+R)
```

### Issue: ESLint errors

**Error:** `npm run lint` shows code quality errors

**Solution:**
```bash
# Review errors
npm run lint

# Fix common issues automatically
# (ESLint can fix some issues)
# Then manually fix remaining errors

# Verify fix
npm run lint  # Should show no errors
```

### Issue: Port 3000 already in use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Option 1: Kill process on port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 2: Use different port
# Edit gulpfile.js, in browser-sync task:
port: 3001  // Use different port
```

---

## Deployment

### GitHub Pages Deployment

This site is hosted on GitHub Pages. Deployment is automatic:

```bash
# 1. Make changes and test locally
npm run dev

# 2. Build for production
npm run build

# 3. Commit both src/ and dist/ files
git add src/ dist/ package.json
git commit -m "feat: add new feature"

# 4. Push to main branch
git push origin main

# 5. GitHub Pages automatically deploys
# Visit: https://jobayerarman.github.io
```

### Important: Commit `dist/` Files

Unlike typical development, this repository includes compiled files in `dist/`:

```bash
# Good: Include compiled files
git add src/ dist/
git commit -m "feat: new feature with compiled output"

# Bad: Don't ignore dist/ in .gitignore
# (This would prevent deployment)
```

### Deployment Checklist

Before pushing to production:

- [ ] All changes committed locally
- [ ] `npm run lint` passes (no errors)
- [ ] `npm run build` completes successfully
- [ ] Tested in browser at http://localhost:3000
- [ ] Tested on mobile devices
- [ ] Asset hashes visible in dist/js/ and dist/css/
- [ ] All images optimized (check dist/images/)
- [ ] No console errors in DevTools
- [ ] Links work correctly
- [ ] Animations perform smoothly

---

## CI/CD Setup (Optional)

### GitHub Actions Example

To automate builds, create `.github/workflows/build.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm ci

      - name: Lint code
        run: npm run lint

      - name: Build project
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

This automatically:
- Installs dependencies
- Lints code
- Builds project
- Deploys to GitHub Pages

---

## Performance Monitoring

### Build Time Monitoring

Check build times regularly:

```bash
# Time development build
time npm run dev

# Time production build
time npm run build
```

**Target times:**
- Dev build: < 3 seconds
- Prod build: < 6 seconds

### Asset Size Monitoring

```bash
# Check compiled file sizes
ls -lh dist/css/
ls -lh dist/js/

# Expected sizes:
# main.min.css: ~20 KB
# user.min.js: ~3 KB
# vendor.min.js: ~185 KB
```

### Image Optimization Check

```bash
# Check image compression ratio
ls -lh src/images/
ls -lh dist/images/

# Expected compression: 15-30% reduction
```

---

## Updating Dependencies

### Check for Updates

```bash
# See available updates
npm outdated

# Update specific package
npm install package-name@latest

# Update all packages
npm update
```

### Update Babel (Example)

```bash
# Update Babel to latest
npm install --save-dev @babel/core@latest @babel/preset-env@latest

# Verify in package.json
cat package.json | grep babel

# Test build
npm run build
```

---

## Team Collaboration

### For Team Members

1. **Clone repository:**
   ```bash
   git clone https://github.com/jobayerarman/jobayerarman.github.io.git
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make changes and test:**
   ```bash
   npm run dev
   # Make your changes
   ```

5. **Commit with clear messages:**
   ```bash
   git add src/
   git commit -m "feat(component): description"
   ```

6. **Push and create Pull Request:**
   ```bash
   git push origin feature/your-feature-name
   # Create PR on GitHub
   ```

### Code Review Checklist

Before merging PRs:

- [ ] Code follows ESLint rules
- [ ] No console errors or warnings
- [ ] Sourcemaps work correctly
- [ ] Production build succeeds
- [ ] Asset sizes reasonable
- [ ] Commit messages follow conventions
- [ ] No breaking changes to existing features

---

## Resources

### Documentation
- `PROJECT_DETAILS.md` - Project structure and upgrades
- `gulpfile.js` - Inline comments for each task
- `src/js/user/script.js` - Inline JSDoc comments
- `.eslintrc.json` - ESLint rules explanation

### External Resources
- [Gulp 4 Documentation](https://gulpjs.com/)
- [Babel Documentation](https://babeljs.io/)
- [LESS Documentation](https://lesscss.org/)
- [BrowserSync Documentation](https://browsersync.io/)
- [ESLint Rules](https://eslint.org/docs/rules/)

---

## Support

For questions or issues:

1. Check this guide and `PROJECT_DETAILS.md`
2. Review inline comments in source files
3. Check ESLint configuration (`.eslintrc.json`)
4. Review recent commits for examples
5. Consult team members or maintainer

---

**Last Updated:** 2024-11-13
**Version:** 5.3.0+
**Status:** Production Ready
