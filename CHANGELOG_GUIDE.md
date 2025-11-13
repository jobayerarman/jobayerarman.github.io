# Changelog Generation Guide

**Automated Changelog from Git Commits**

---

## Overview

This project uses **conventional-changelog** to automatically generate `CHANGELOG.md` from git commits following the Angular commit convention. Every commit you make automatically contributes to the changelog.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Commit Convention](#commit-convention)
3. [Available Commands](#available-commands)
4. [How It Works](#how-it-works)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)
7. [Configuration](#configuration)

---

## Quick Start

### Generate/Update Changelog

```bash
npm run changelog
# or
gulp changelog:generate
```

This reads all commits since the last version and updates `CHANGELOG.md`.

### Preview Changes Before Writing

```bash
npm run changelog:preview
# or
gulp changelog:preview
```

See what will be added to the changelog without modifying the file.

### Initialize Fresh Changelog

```bash
npm run changelog:init
```

Generates complete changelog from all git history (use only once initially).

---

## Commit Convention

The changelog is generated from **Angular-style commits**. Follow this format:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description | Shows In Changelog |
|------|-------------|-------------------|
| **feat** | New feature | ✅ Features section |
| **fix** | Bug fix | ✅ Bug Fixes section |
| **docs** | Documentation only | ❌ Not shown |
| **style** | Code style (no logic change) | ❌ Not shown |
| **refactor** | Code refactoring | ❌ Not shown (use `feat` if significant) |
| **perf** | Performance improvement | ✅ Features section |
| **test** | Tests | ❌ Not shown |
| **chore** | Build, dependencies | ❌ Not shown |
| **ci** | CI/CD configuration | ❌ Not shown |

### Scope

Optional. Name of module/component being changed:

```bash
git commit -m "feat(build): add changelog generation"
#         scope ↑
```

### Subject

- Use imperative, present tense: "add" not "added" or "adds"
- Don't capitalize first letter
- No period at the end
- Max 50 characters

```bash
git commit -m "feat: implement dark mode toggle in settings"
#               ↑ Good: imperative, lowercase, concise
```

### Body (Optional)

Detailed description of the change. Wrap at 72 characters.

```bash
git commit -m "feat(script): refactor with ES6 classes

Improves code maintainability and adds comprehensive error handling.
Changes monolithic object to 9 modular classes following single
responsibility principle."
```

### Footer (Optional)

Used for:
- **Breaking changes**: `BREAKING CHANGE: description`
- **Issue references**: `Closes #123` or `Fixes #456`

```bash
git commit -m "feat!: upgrade Gulp to version 4

BREAKING CHANGE: Gulp 3 array syntax no longer supported.
Use gulp.series() and gulp.parallel() instead.

Closes #99"
```

---

## Available Commands

### npm Scripts

| Command | Description | Output |
|---------|-------------|--------|
| `npm run changelog` | Generate/update CHANGELOG.md | File updated |
| `npm run changelog:preview` | Preview changes without writing | Console output |
| `npm run changelog:cli` | Direct conventional-changelog CLI | File updated |
| `npm run changelog:init` | Initialize fresh changelog | File created |

### Gulp Tasks

| Task | Description |
|------|-------------|
| `gulp changelog:generate` | Generate changelog with timing info |
| `gulp changelog:preview` | Preview changelog with task logging |

### Examples

```bash
# Work on feature, commit with proper type
git commit -m "feat: add image optimization to build system"

# Before release, preview what will be added
npm run changelog:preview

# Generate/update the changelog
npm run changelog

# Commit the changelog
git add CHANGELOG.md
git commit -m "chore(release): update changelog for version 5.4.0"
```

---

## How It Works

### Commit Parsing

1. **Reads git history** - Scans all commits since last tagged version
2. **Parses commit messages** - Extracts type, scope, subject, body
3. **Groups commits** - Organizes by type (feat, fix, perf, etc.)
4. **Generates sections** - Creates changelog sections with proper formatting
5. **Creates links** - Adds GitHub commit and PR links automatically

### Changelog Structure

```markdown
# 5.4.0 (2025-11-20)

### Features
- **build:** Add changelog generation ([abc123](https://github.com/.../abc123))
- **script:** Improve ES6 class organization ([def456](https://github.com/.../def456))

### Bug Fixes
- **eslint:** Fix ScrollMagic undefined error ([ghi789](https://github.com/.../ghi789))

### BREAKING CHANGES
- Gulp 3 array syntax no longer supported

### Commits
- 1a2b3c4: feat(build): add changelog
- 5d6e7f8: fix(eslint): scroll magic error
```

---

## Best Practices

### 1. **Consistent Commit Messages**

```bash
# ✅ Good
git commit -m "feat(styles): add dark mode support"
git commit -m "fix(navigation): resolve mobile menu toggle issue"
git commit -m "chore: update dependencies to latest versions"

# ❌ Avoid
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "WIP: work in progress"
```

### 2. **Use Scopes for Clarity**

```bash
# ✅ Good - Clear which component changed
git commit -m "feat(header): make navbar sticky on scroll"
git commit -m "fix(skills): progress bar animation not triggering"

# ❌ Avoid - Unclear
git commit -m "feat: fixed navbar and skills and images"
```

### 3. **One Logical Change Per Commit**

```bash
# ✅ Good - Each commit is focused
git commit -m "feat(build): add image optimization"
git commit -m "fix(script): remove unused variables"

# ❌ Avoid - Too much in one commit
git commit -m "feat: added changelog, fixed bugs, updated deps, refactored code"
```

### 4. **Breaking Changes Must Be Marked**

```bash
# ✅ For breaking changes, use ! or BREAKING CHANGE
git commit -m "feat!: migrate from Gulp 3 to Gulp 4"

# Or in body:
git commit -m "chore: update build system

BREAKING CHANGE: Gulp 3 no longer supported.
Migration guide: see MIGRATION.md"
```

### 5. **Generate Changelog Before Releases**

```bash
# 1. Complete all features and fixes
git commit -m "feat: add new feature"
git commit -m "fix: resolve issue"

# 2. Preview what will be added
npm run changelog:preview

# 3. Generate changelog
npm run changelog

# 4. Review changes
git diff CHANGELOG.md

# 5. Commit changelog
git commit -m "chore(release): update changelog for version 5.4.0"

# 6. Tag release
git tag -a v5.4.0 -m "Release version 5.4.0"
```

---

## Troubleshooting

### Issue: Changelog not being generated

**Solution**: Ensure commits follow Angular convention:
```bash
# ❌ This won't appear
git commit -m "fixed this thing"

# ✅ Use proper type
git commit -m "fix: resolve this issue"
```

### Issue: All commits showing in changelog

**Solution**: Use `chore:` type for non-user-facing changes:
```bash
# ❌ Shows up in changelog
git commit -m "docs: fix typo in readme"

# ✅ Hidden from changelog (documentation is implicit)
git commit -m "chore: fix typo in readme"
```

### Issue: Changelog shows old commits I don't want

**Solution**: Use `--from` and `--to` flags:
```bash
# Changelog for specific commit range
conventional-changelog -p angular --from abc123def --to xyz789abc
```

### Issue: Command not found: conventional-changelog

**Solution**: Ensure packages are installed:
```bash
npm install
npm install --save-dev conventional-changelog-cli conventional-changelog-angular
```

---

## Configuration

### Configuration File: `.changelogrc.json`

Located in project root. Key settings:

```json
{
  "preset": "angular",           // Commit format (angular)
  "commitUrlFormat": "https://...", // GitHub link format
  "compareUrlFormat": "https://...", // Version comparison links
  "issueUrlFormat": "https://...",   // Issue references
  "releaseCommitMessageFormat": "chore(release): {{currentTag}}"
}
```

### Modify for Your Project

Only if needed:

```json
{
  "commitUrlFormat": "https://github.com/YOUR-USERNAME/YOUR-REPO/commit/{{hash}}",
  "compareUrlFormat": "https://github.com/YOUR-USERNAME/YOUR-REPO/compare/{{previousTag}}...{{currentTag}}",
  "issueUrlFormat": "https://github.com/YOUR-USERNAME/YOUR-REPO/issues/{{id}}"
}
```

---

## Integration with Release Process

### Release Workflow

```bash
# 1. Complete features and fixes
git commit -m "feat(nav): add sticky header"
git commit -m "fix(scroll): resolve scroll to top bug"

# 2. Bump version in package.json
# Change "version": "5.3.0" to "version": "5.4.0"

# 3. Generate changelog for new version
npm run changelog

# 4. Commit and tag
git add CHANGELOG.md package.json
git commit -m "chore(release): release version 5.4.0"
git tag -a v5.4.0 -m "Release version 5.4.0"

# 5. Push
git push origin main --tags
```

### CI/CD Integration (GitHub Actions Example)

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2

      - name: Generate Changelog
        run: npm run changelog

      - name: Commit Changelog
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add CHANGELOG.md
          git commit -m "chore(release): update changelog"
          git push
```

---

## Examples

### Example 1: Feature Commit

```bash
git commit -m "feat(build): add content-hash cache busting

Implements MD5-based cache busting for production builds.
Queries now only change when file content changes, enabling
long-term caching strategies (365-day expiration)."
```

**Changelog output:**
```
### Features

* **build:** add content-hash cache busting ([abc123](link))
```

### Example 2: Bug Fix Commit

```bash
git commit -m "fix(eslint): resolve ScrollMagic is not defined error

Adds ScrollMagic to ESLint globals configuration to prevent
false positive undefined variable warnings.

Fixes #45"
```

**Changelog output:**
```
### Bug Fixes

* **eslint:** resolve ScrollMagic is not defined error ([def456](link))

Fixes #45
```

### Example 3: Breaking Change Commit

```bash
git commit -m "feat!: migrate from Gulp 3 to Gulp 4

Complete rewrite of gulpfile.js with modern async/await support.
Gulp 3 array syntax no longer supported.

BREAKING CHANGE: gulp.task('name', ['dep1', 'dep2'], fn)
is no longer valid. Use gulp.series() and gulp.parallel()
instead.

Migration guide: see UPGRADE.md"
```

**Changelog output:**
```
### BREAKING CHANGES

* **feat:** migrate from Gulp 3 to Gulp 4

gulp.task('name', ['dep1', 'dep2'], fn) is no longer valid.
Use gulp.series() and gulp.parallel() instead.
```

---

## Resources

- [Angular Commit Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog)
- [Semantic Versioning](https://semver.org/)

---

## Quick Reference

```bash
# View help
npm run changelog -- --help

# Generate changelog for unreleased changes
npm run changelog

# Preview first
npm run changelog:preview

# Just conventional-changelog CLI
npm run changelog:cli

# Initialize from scratch
npm run changelog:init

# Gulp version with timing
gulp changelog:generate

# Preview with Gulp
gulp changelog:preview
```

---

**Last Updated**: 2025-11-13
**Version**: 5.3.0+
**Maintainer**: Jobayer Arman
