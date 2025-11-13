# Changelog Quick Reference

**One-page guide for automated changelog generation**

---

## Install (Already Done ✅)

```bash
npm install --save-dev conventional-changelog-cli conventional-changelog-angular
```

---

## Quick Commands

```bash
# Generate changelog
npm run changelog

# Preview first
npm run changelog:preview

# With Gulp
gulp changelog:generate
```

---

## Commit Format

```bash
# Features
git commit -m "feat(scope): description"

# Bug fixes
git commit -m "fix(scope): description"

# Not shown in changelog
git commit -m "chore: description"
git commit -m "docs: description"
git commit -m "test: description"

# Breaking changes
git commit -m "feat!: description

BREAKING CHANGE: explanation"
```

---

## Release Workflow

```bash
# 1. Work normally
git commit -m "feat: add feature"
git commit -m "fix: resolve bug"

# 2. Preview changes
npm run changelog:preview

# 3. Generate changelog
npm run changelog

# 4. Commit and tag
git add CHANGELOG.md
git commit -m "chore(release): update changelog v5.4.0"
git tag -a v5.4.0 -m "Release v5.4.0"
git push origin --tags
```

---

## Available npm Scripts

| Command | Purpose |
|---------|---------|
| `npm run changelog` | Generate/update CHANGELOG.md |
| `npm run changelog:preview` | Preview without writing |
| `npm run changelog:cli` | Direct CLI access |
| `npm run changelog:init` | Initialize fresh changelog |

---

## Available Gulp Tasks

| Task | Purpose |
|------|---------|
| `gulp changelog:generate` | Generate with timing |
| `gulp changelog:preview` | Preview with logging |

---

## Types in Changelog

| Type | Shows? | Example |
|------|--------|---------|
| `feat:` | ✅ Yes | `feat: add feature` |
| `fix:` | ✅ Yes | `fix: resolve bug` |
| `perf:` | ✅ Yes | `perf: optimize code` |
| `chore:` | ❌ No | `chore: update deps` |
| `docs:` | ❌ No | `docs: update readme` |
| `style:` | ❌ No | `style: format code` |
| `test:` | ❌ No | `test: add tests` |
| `ci:` | ❌ No | `ci: update workflow` |

---

## Files

| File | Purpose |
|------|---------|
| `CHANGELOG.md` | Generated changelog (auto-updated) |
| `.changelogrc.json` | Configuration |
| `CHANGELOG_GUIDE.md` | Complete user guide |
| `CHANGELOG_IMPLEMENTATION.md` | Technical details |

---

## Examples

### Good Commits

```bash
# Feature
git commit -m "feat(build): add cache busting"

# Bug fix
git commit -m "fix(script): resolve memory leak"

# Multiple lines
git commit -m "feat(nav): add sticky header

Makes header stick to top on scroll.
Improves navigation accessibility."

# Breaking change
git commit -m "feat!: upgrade Gulp to v4

BREAKING CHANGE: Old syntax no longer supported.
Use gulp.series() instead of arrays."
```

### Bad Commits

```bash
# ❌ No type
git commit -m "fixed bug"

# ❌ Wrong type
git commit -m "update: added feature"

# ❌ Too vague
git commit -m "updates"

# ❌ Not imperative
git commit -m "feat: added new feature"  # Use "add" not "added"
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No changes | Ensure commit type is `feat:` or `fix:` |
| Too many commits | Use `chore:` for maintenance commits |
| Command not found | Run `npm install` first |
| Undoing generation | The file is just CHANGELOG.md - edit manually if needed |

---

## Tips

1. **Use scopes** - Helps organize by component
   - `feat(build)` - Build system
   - `feat(script)` - JavaScript
   - `feat(style)` - CSS/LESS

2. **Good commit subjects**
   - Imperative: "add" not "added" or "adds"
   - Lowercase first letter
   - No period at end
   - ~50 characters max

3. **Breaking changes**
   - Use `feat!:` or `fix!:` to mark breaking
   - Explain in commit body with `BREAKING CHANGE:`
   - Always increment major version

4. **Review before committing**
   - `npm run changelog:preview` shows what will be added
   - Allows fixing bad commits before they're logged

---

## Complete Guide

For detailed information, see:
- **CHANGELOG_GUIDE.md** - Full documentation
- **CHANGELOG_IMPLEMENTATION.md** - Technical details
- **CHANGELOG.md** - Current changelog

---

**Last Updated**: 2025-11-13
