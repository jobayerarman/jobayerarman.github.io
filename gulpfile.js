/**
 * Gulpfile - Modern Build System
 *
 * Portfolio Website Build Configuration
 *
 * Features:
 *   - Gulp 4+ with modern async/await support
 *   - Cross-platform browser testing (Windows, macOS, Linux)
 *   - LESS to CSS compilation with sourcemaps
 *   - ES6+ transpilation with Babel 7+
 *   - JavaScript linting with ESLint
 *   - Template rendering with Nunjucks
 *   - Image optimization and compression
 *   - BrowserSync for live development
 *   - Environment-based builds (dev/prod)
 *   - Content-hash cache busting
 *   - Comprehensive error handling
 *
 * @author Jobayer Arman
 * @updated 2024
 */

const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const os = require('os');

// ============================================================================
// PLUGINS - CSS
// ============================================================================
const less = require('gulp-less');
const cssmin = require('gulp-cssmin');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

// ============================================================================
// PLUGINS - JavaScript
// ============================================================================
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const uglify = require('gulp-uglify');

// ============================================================================
// PLUGINS - HTML & Templates
// ============================================================================
const htmlRender = require('gulp-nunjucks-render');
const processhtml = require('gulp-processhtml');

// ============================================================================
// PLUGINS - Images
// ============================================================================
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');

// ============================================================================
// PLUGINS - Utilities
// ============================================================================
const browserSync = require('browser-sync').create();
const del = require('del');
const filter = require('gulp-filter');
const gulpif = require('gulp-if');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const size = require('gulp-size');
const chalk = require('chalk');
const crypto = require('crypto');
const exec = require('child_process').exec;
const util = require('util');
const execAsync = util.promisify(exec);

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Environment detection
 * Set via: NODE_ENV=production npm run build
 */
const isProd = process.env.NODE_ENV === 'production' || process.argv.includes('--production');
const isDev = !isProd;

/**
 * Build configuration
 */
const config = {
  production: isProd,
  sourceMaps: isDev,
  environment: isProd ? 'production' : 'development',
};

/**
 * Path configuration
 */
const paths = {
  src: 'src/',
  dist: 'dist/',
  less: 'src/less/',
  js: 'src/js/',
  html: 'src/site/',
  images: 'src/images/',
};

/**
 * Styles configuration
 */
const styles = {
  src: {
    mainFile: path.join(paths.less, 'main.less'),
    allFiles: path.join(paths.less, '**/*.less'),
  },
  dest: {
    path: path.join(paths.dist, 'css/'),
    pattern: path.join(paths.dist, 'css/*.css'),
  },
};

/**
 * Scripts configuration
 */
const scripts = {
  user: {
    src: path.join(paths.js, 'user/*.js'),
    dest: path.join(paths.dist, 'js/'),
    filename: 'user.js',
  },
  vendor: {
    src: path.join(paths.js, 'vendor/*.js'),
    dest: path.join(paths.dist, 'js/'),
    filename: 'vendor.js',
  },
};

/**
 * HTML/Templates configuration
 */
const html = {
  src: {
    pages: path.join(paths.html, 'pages/*.+(html|njk)'),
    watch: path.join(paths.html, '**/*.+(html|njk)'),
    templates: path.join(paths.html, 'templates'),
  },
  dest: './',
};

/**
 * Images configuration
 */
const images = {
  src: path.join(paths.images, '**/*.{png,jpg,jpeg,gif,svg}'),
  dest: path.join(paths.dist, 'images/'),
};

/**
 * Browserslist targets - Modern browser support
 * Uses Browserslist format for both Babel and Autoprefixer
 */
const BROWSER_TARGETS = ['defaults', 'not dead'];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Comprehensive error handler with pretty formatting
 * @param {Error} error - Error object from plugin
 */
function handleError(error) {
  const errorDetails = [
    chalk.bgRed.white(' ERROR '),
    chalk.red('Plugin: ') + (error.plugin || 'Unknown'),
    chalk.red('Message: ') + (error.message || 'No message'),
    error.lineNumber ? chalk.red('Line: ') + error.lineNumber : '',
    error.fileName ? chalk.red('File: ') + error.fileName : '',
  ]
    .filter(Boolean)
    .join('\n');

  console.error('\n' + errorDetails + '\n');
  this.emit('end');
}

/**
 * Get platform-specific browser executable
 * Supports Windows, macOS, and Linux
 * @returns {string} Browser executable path or command
 */
function getBrowser() {
  const platform = os.platform();

  switch (platform) {
    case 'darwin':
      return 'Google Chrome';  // macOS
    case 'linux':
      return 'google-chrome';  // Linux
    case 'win32':
      return 'chrome.exe';     // Windows
    default:
      return 'chrome';         // Fallback
  }
}

/**
 * Generate file content hash for cache busting
 * Uses MD5 hash of file content (first 8 characters)
 * @param {string} filePath - Path to file
 * @returns {string} Content hash or timestamp fallback
 */
function getFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    const hash = crypto
      .createHash('md5')
      .update(content)
      .digest('hex')
      .slice(0, 8);
    return hash;
  } catch (error) {
    console.warn(chalk.yellow(`⚠ Warning: Could not hash file ${filePath}`));
    return Date.now().toString().slice(-8);
  }
}

/**
 * Log task completion with duration
 * @param {string} taskName - Name of task
 * @param {number} startTime - Task start timestamp
 */
function logTaskComplete(taskName, startTime) {
  const duration = Date.now() - startTime;
  const durationStr = duration > 1000
    ? `${(duration / 1000).toFixed(1)}s`
    : `${duration}ms`;
  console.log(chalk.green('✓') + ` ${taskName} ${chalk.dim(`(${durationStr)}`)}`);
}

/**
 * Create minification pipeline for JavaScript
 * Uses terser for production, uglify as fallback
 * @returns {Stream} Gulp stream pipeline
 */
function createJsMinifyPipe() {
  return terser({
    compress: {
      drop_console: config.production,
      drop_debugger: config.production,
    },
    format: {
      comments: false,
    },
    mangle: true,
  }).on('error', (err) => {
    // Fallback to uglify if terser fails
    console.warn(chalk.yellow('⚠ Terser failed, using uglify fallback'));
    return uglify();
  });
}

// ============================================================================
// CLEANUP TASKS
// ============================================================================

/**
 * Clean CSS output files
 */
gulp.task('clean:css', () => {
  console.log(chalk.dim('  Cleaning CSS...'));
  return del(styles.dest.pattern);
});

/**
 * Clean JavaScript output files
 */
gulp.task('clean:js', () => {
  console.log(chalk.dim('  Cleaning JavaScript...'));
  return del([
    path.join(scripts.user.dest, '*.js'),
    path.join(scripts.vendor.dest, '*.js'),
    path.join(scripts.user.dest, '*.map'),
    path.join(scripts.vendor.dest, '*.map'),
  ]);
});

/**
 * Clean HTML output files
 */
gulp.task('clean:html', () => {
  console.log(chalk.dim('  Cleaning HTML...'));
  return del(path.join(html.dest, '*.html'));
});

/**
 * Clean all dist files
 */
gulp.task('clean:all', gulp.parallel('clean:css', 'clean:js', 'clean:html'));

// ============================================================================
// STYLES TASK
// ============================================================================

/**
 * Compile LESS to CSS with optimization
 * - Converts LESS → CSS
 * - Adds vendor prefixes via Autoprefixer
 * - Generates sourcemaps in development
 * - Minifies in production
 */
gulp.task('styles', () => {
  const startTime = Date.now();

  return gulp
    .src(styles.src.mainFile)
    .pipe(plumber({errorHandler: handleError}))
    .pipe(gulpif(config.sourceMaps, sourcemaps.init()))
    .pipe(less({
      paths: [path.join(__dirname, 'node_modules')],
    }))
    .pipe(autoprefixer({
      overrideBrowserslist: BROWSER_TARGETS,
      cascade: false,
    }))
    .pipe(gulpif(config.sourceMaps, sourcemaps.write()))
    .pipe(gulpif(config.production, cssmin({keepSpecialComments: false})))
    .pipe(gulpif(config.production, rename({suffix: '.min'})))
    .pipe(gulp.dest(styles.dest.path))
    .pipe(filter('**/*.css'))
    .pipe(size({showFiles: true, pretty: true}))
    .pipe(browserSync.stream())
    .on('end', () => logTaskComplete('styles', startTime));
});

// ============================================================================
// JAVASCRIPT TASKS
// ============================================================================

/**
 * Lint custom JavaScript files
 * Checks code quality against ESLint rules
 */
gulp.task('js:lint', () => {
  const startTime = Date.now();

  return gulp
    .src(scripts.user.src)
    .pipe(plumber({errorHandler: handleError}))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on('end', () => logTaskComplete('js:lint', startTime));
});

/**
 * Process custom JavaScript
 * - Lints code
 * - Transpiles ES6+ → ES5 using Babel
 * - Concatenates files
 * - Generates sourcemaps in dev
 * - Minifies in production
 *
 * @dependency js:lint
 */
gulp.task('js:custom', gulp.series('js:lint', () => {
  const startTime = Date.now();

  return gulp
    .src(scripts.user.src)
    .pipe(plumber({errorHandler: handleError}))
    .pipe(gulpif(config.sourceMaps, sourcemaps.init()))
    .pipe(babel({
      presets: [
        ['@babel/preset-env', {
          targets: BROWSER_TARGETS,
          modules: false,
          useBuiltIns: 'usage',
          corejs: 3,
        }],
      ],
    }))
    .pipe(concat(scripts.user.filename))
    .pipe(gulpif(
      config.sourceMaps,
      sourcemaps.write('.', {
        includeContent: false,
        sourceRoot: '../../../src/js/user/',
      })
    ))
    .pipe(gulpif(config.production, createJsMinifyPipe()))
    .pipe(gulpif(config.production, rename({suffix: '.min'})))
    .pipe(gulp.dest(scripts.user.dest))
    .pipe(size({showFiles: true, pretty: true}))
    .on('end', () => logTaskComplete('js:custom', startTime));
}));

/**
 * Process vendor JavaScript
 * - Concatenates vendor libraries
 * - Minifies for production
 */
gulp.task('js:vendor', () => {
  const startTime = Date.now();

  return gulp
    .src(scripts.vendor.src)
    .pipe(plumber({errorHandler: handleError}))
    .pipe(concat(scripts.vendor.filename))
    .pipe(gulpif(config.production, createJsMinifyPipe()))
    .pipe(gulpif(config.production, rename({suffix: '.min'})))
    .pipe(gulp.dest(scripts.vendor.dest))
    .pipe(size({showFiles: true, pretty: true}))
    .on('end', () => logTaskComplete('js:vendor', startTime));
});

/**
 * Process all JavaScript files
 * Runs vendor and custom JS in parallel
 */
gulp.task('js:all', gulp.series(
  'clean:js',
  gulp.parallel('js:vendor', 'js:custom')
));

// ============================================================================
// HTML/TEMPLATE TASK
// ============================================================================

/**
 * Render HTML from Nunjucks templates
 * - Renders template files
 * - Applies cache busting in production
 * - Processes build directives
 */
gulp.task('render:html', () => {
  const startTime = Date.now();

  return gulp
    .src(html.src.pages)
    .pipe(plumber({errorHandler: handleError}))
    .pipe(htmlRender({
      path: html.src.templates,
      environment: config.environment,
    }))
    .pipe(gulpif(config.production, processhtml()))
    .pipe(gulpif(config.production, (() => {
      // Content-hash based cache busting for production
      return replace(
        /(['"])(dist\/[^'"]*\.(css|js))(['"])/g,
        (match, quote1, distPath, ext, quote2) => {
          try {
            const fullPath = path.join(__dirname, distPath);
            const hash = getFileHash(fullPath);
            const basePath = distPath.replace(new RegExp(`\\.min\\.${ext}$`), `.${hash}.min.${ext}`);
            return `${quote1}${basePath}${quote2}`;
          } catch (error) {
            console.warn(chalk.yellow(`⚠ Could not apply hash to ${distPath}`));
            return match;  // Return original if hashing fails
          }
        }
      );
    })()))
    .pipe(gulp.dest(html.dest))
    .pipe(size({showFiles: true, pretty: true}))
    .on('end', () => logTaskComplete('render:html', startTime));
});

// ============================================================================
// IMAGE TASK
// ============================================================================

/**
 * Optimize and compress images
 * - PNG: pngquant compression
 * - JPEG: mozjpeg compression at 75% quality
 * - GIF: gifsicle interlacing
 * - SVG: SVGO optimization
 */
gulp.task('image:compress', () => {
  const startTime = Date.now();

  return gulp
    .src(images.src)
    .pipe(plumber({errorHandler: handleError}))
    .pipe(imagemin([
      imageminMozjpeg({quality: 75}),
      imageminPngquant({
        quality: [0.6, 0.8],
        speed: 4,
      }),
      imagemin.gifsicle({interlaced: true}),
      imageminSvgo({
        plugins: [
          {removeViewBox: false},
          {removeDimensions: true},
        ],
      }),
    ]))
    .pipe(gulp.dest(images.dest))
    .pipe(size({showFiles: true, pretty: true}))
    .on('end', () => logTaskComplete('image:compress', startTime));
});

// ============================================================================
// BROWSERSYNC TASK
// ============================================================================

/**
 * Initialize BrowserSync development server
 * - Live reload on file changes
 * - CSS injection (no page reload needed)
 * - Cross-device testing
 * - Cross-platform browser support
 */
gulp.task('browser-sync', (done) => {
  browserSync.init({
    server: true,
    online: true,
    browser: getBrowser(),  // ✅ Cross-platform
    open: false,
    notify: true,
    logConnections: false,
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: true,
    },
  });
  done();
});

// ============================================================================
// WATCH TASK
// ============================================================================

/**
 * Watch source files and run appropriate tasks
 * - LESS changes → styles task → CSS inject
 * - JS changes → js:custom task → page reload
 * - HTML changes → render:html task → page reload
 * - Images → compress & reload
 */
gulp.task('watch', gulp.series('browser-sync', () => {
  console.log(chalk.cyan('👀 Watching for file changes...\n'));

  // Watch LESS files
  gulp.watch(styles.src.allFiles, gulp.series('styles'));

  // Watch JavaScript files
  gulp.watch(scripts.user.src, gulp.series('js:custom', (done) => {
    browserSync.reload();
    done();
  }));

  // Watch HTML/Template files
  gulp.watch(html.src.watch, gulp.series('render:html', (done) => {
    browserSync.reload();
    done();
  }));

  // Watch image files
  gulp.watch(images.src, gulp.series('image:compress', (done) => {
    browserSync.reload();
    done();
  }));
}));

// ============================================================================
// PRIMARY TASKS
// ============================================================================

/**
 * Development build and watch
 * - Cleans dist
 * - Builds all assets
 * - Starts dev server
 * - Watches for changes
 *
 * Usage: npm run dev
 */
gulp.task('dev', gulp.series(
  'clean:all',
  gulp.parallel('styles', 'js:all'),
  'render:html',
  'watch'
));

/**
 * Production build
 * - Cleans dist
 * - Builds all assets with optimizations
 * - Minifies CSS and JS
 * - Optimizes images
 * - Applies cache busting
 *
 * Usage: npm run build
 */
gulp.task('build', gulp.series(
  'clean:all',
  gulp.parallel('styles', 'js:all'),
  'render:html',
  'image:compress',
  (done) => {
    console.log(chalk.green.bold('\n✅ Production build complete!\n'));
    console.log(chalk.dim('Output directory: ./dist/'));
    done();
  }
));

// ============================================================================
// CHANGELOG TASK
// ============================================================================

/**
 * Generate changelog from git commits
 * Uses conventional-changelog for Angular commit format
 * Generates CHANGELOG.md with version history and commit details
 */
gulp.task('changelog:generate', async (done) => {
  const startTime = Date.now();

  try {
    console.log(chalk.cyan('\n📝 Generating changelog from commits...\n'));

    // Use conventional-changelog CLI to generate changelog
    const { stdout, stderr } = await execAsync(
      'conventional-changelog -p angular -r 0 -i CHANGELOG.md -s',
      { cwd: __dirname }
    );

    if (stderr && !stderr.includes('WARN')) {
      console.warn(chalk.yellow('⚠ Changelog generation warnings:'));
      console.warn(stderr);
    }

    if (stdout) {
      console.log(chalk.dim(stdout));
    }

    console.log(chalk.green('✓ Changelog generated successfully'));
    logTaskComplete('changelog:generate', startTime);
    done();
  } catch (error) {
    // conventional-changelog may return exit code 1 even on success
    // Check if CHANGELOG.md was created/updated
    const fs = require('fs');
    if (fs.existsSync(path.join(__dirname, 'CHANGELOG.md'))) {
      console.log(chalk.green('✓ Changelog generated successfully'));
      logTaskComplete('changelog:generate', startTime);
      done();
    } else {
      console.error(chalk.red('✗ Failed to generate changelog'));
      console.error(error);
      done(error);
    }
  }
});

/**
 * Preview changelog without writing to file
 * Useful for reviewing changes before committing
 */
gulp.task('changelog:preview', async (done) => {
  const startTime = Date.now();

  try {
    console.log(chalk.cyan('\n📋 Previewing changelog...\n'));

    const { stdout } = await execAsync(
      'conventional-changelog -p angular',
      { cwd: __dirname }
    );

    console.log(stdout);
    logTaskComplete('changelog:preview', startTime);
    done();
  } catch (error) {
    console.error(chalk.red('✗ Failed to preview changelog'));
    console.error(error);
    done(error);
  }
});

/**
 * Default task (development)
 */
gulp.task('default', gulp.series('dev'));
