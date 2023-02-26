/**
 * Gulpfile for front-end developing with Bootstrap.
 *
 * Implements:
 *      1. Live reloads browser with BrowserSync.
 *      2. CSS: Less to CSS conversion, error catching, Autoprefixing,
 *         CSS minification.
 *      3. JS: Concatenates & uglifies Custom JS files.
 *      4. Images: Compresses PNG, JPEG, GIF and SVG images.
 *      5. Watches files for changes in CSS or JS and HTML.
 *      6. InjectCSS instead of reloading browser page.
 *
 * @author Jobayer Arman (@JobayerArman)
 */

/**
 * Configuration.
 *
 * Project Configuration for gulp tasks.
 *
 * Edit the variables as per your project requirements.
 */
// Project root folders
const basePaths = {
  src: 'src/',
  dest: 'dist/'
};
// Styles folders and files
const styleFiles = {
  src: {
    path: basePaths.src + 'less/',
    mainFile: basePaths.src + 'less/main.less',
    allFiles: basePaths.src + 'less/**/*.less'
  },
  dest: {
    path: basePaths.dest + 'css/',
    files: basePaths.dest + 'css/*.+(css|map)'
  }
};
// Scripts folders and files
const scriptFiles = {
  user: {
    src: {
      path: basePaths.src + 'js/user/',
      files: basePaths.src + 'js/user/*.js'
    },
    dest: {
      path: basePaths.dest + 'js/',
      files: basePaths.dest + 'js/*.+(js|map)',
      filename: 'user.js'
    }
  },
  vendor: {
    src: {
      path: basePaths.src + 'js/vendor/',
      files: basePaths.src + 'js/vendor/*.js'
    },
    dest: {
      path: basePaths.dest + 'js/',
      files: basePaths.dest + 'js/*.+(js|map)',
      filename: 'vendor.js'
    }
  }
};
// HTML folders and files
const htmlFiles = {
  src: {
    path: basePaths.src + 'site/',
    pages: basePaths.src + 'site/pages/*.+(html|njk)',
    files: basePaths.src + 'site/**/*.+(html|njk)',
    templates: basePaths.src + 'site/templates'
  },
  dest: {
    path: './',
    files: '*.html'
  }
};
// Image folders and files
const imageFiles = {
  src: {
    path: basePaths.src + 'images/',
    files: basePaths.src + 'images/*.{png,jpg,gif,svg}'
  },
  dest: {
    path: basePaths.dest + 'images/',
    files: basePaths.dest + 'images/*.{png,jpg,gif,svg}'
  }
};
// Watch variables
const watchFiles = {
  styles: styleFiles.src.allFiles,
  scripts: scriptFiles.user.src.files,
  images: imageFiles.src.files,
  html: htmlFiles.src.files
};

// Browsers you care about for autoprefixing.
// Browserlist https://github.com/ai/browserslist
const AUTOPREFIXER_BROWSERS = [
  'defaults'
];
// End of project variables

/**
 * Load Plugins.
 *
 * Load gulp plugins and assigning them semantic names.
 */
const { src, dest, parallel, series, watch } = require('gulp');                  // Importing all the Gulp-related packages we want to use
const gutil                                  = require('gulp-util');             // Utility functions for gulp plugins

// CSS related plugins.
const less                                   = require('gulp-less');             // Gulp pluign for Sass compilation.
const cssnano                                = require('cssnano');               // CSSnano is a modular compression tool
const postcss                                = require('gulp-postcss');          // PostCSS is a tool for transforming CSS with JavaScript plugins
const autoprefixer                           = require('gulp-autoprefixer');     // Autoprefixing magic.
const sourcemaps                             = require('gulp-sourcemaps');       // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file.

// JS related plugins.
const babel                                  = require('gulp-babel');            // Next-gen JavaScript, with Babel
const eslint                                 = require('gulp-eslint');           // ESLint plugin for gulp
const concat                                 = require('gulp-concat');           // Concatenates JS files
const uglify                                 = require('gulp-uglify');           // Minifies JS files

// HTML template engine
const htmlRender                             = require('gulp-nunjucks-render');  // Render Nunjucks templates
const processhtml                            = require('gulp-processhtml');      // Process html files at build time to modify them depending on the release environment

// Image realted plugins.
const imagemin                               = require('gulp-imagemin');         // Minify PNG, JPEG, GIF and SVG images with imagemin.

// Github related plugins
const fs                                     = require('fs');
const semver                                 = require('semver');
const bump                                   = require('gulp-bump');
const prompt                                 = require('gulp-prompt');
const replace                                = require('gulp-replace');

// Utility related plugins.
const browserSync                            = require('browser-sync').create(); // Reloads browser and injects CSS. Time-saving synchronised browser testing.
const del                                    = require('del');                   // Delete files and folders
const filter                                 = require('gulp-filter');           // Helps work on a subset of the original files by filtering them using globbing.
const gulpif                                 = require('gulp-if');               // A ternary gulp plugin: conditionally control the flow of vinyl objects.
const lazypipe                               = require('lazypipe');              // Lazypipe allows to create an immutable, lazily-initialized pipeline.
const plumber                                = require('gulp-plumber');          // Prevent pipe breaking caused by errors from gulp plugins
const rename                                 = require('gulp-rename');           // Renames files E.g. style.css -> style.min.css
const size                                   = require('gulp-size');             // Logs out the total size of files in the stream and optionally the individual file-sizes

const config = {
  production: !!gutil.env.production, // Two exclamations turn undefined into a proper false.
  sourceMaps: !gutil.env.production
};

/**
 * get version from package.json
 */
const getPackageJsonVersion = () => {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
};

/**
 * Notify Errors
 */
const errorLog = (error) => {
  // Pretty error reporting
  let report = '\n';
  const chalk = gutil.colors.white.bgRed;

  report += chalk('TASK:') + ' [' + error.plugin + ']\n';
  report += chalk('ERRR:') + ' ' + error.message + '\n';
  if (error.lineNumber) { report += chalk('LINE:') + ' ' + error.lineNumber + '\n'; }
  if (error.column) { report += chalk('COL:') + '  ' + error.column + '\n'; }
  if (error.fileName) { report += chalk('FILE:') + ' ' + error.fileName + '\n'; }

  console.error(report);

  gutil.beep(); // System beep (backup)
};

/**
 * Datestamp for cache busting
 */
const getDate = () => {
  const myDate = new Date();

  const myYear = myDate.getFullYear().toString();
  const myMonth = ('0' + (myDate.getMonth() + 1)).slice(-2);
  const myDay = ('0' + myDate.getDate()).slice(-2);
  const mySeconds = myDate.getSeconds().toString();

  const dateStamp = myYear + myMonth + myDay + mySeconds;

  return dateStamp;
};

/**
 * Github workflow
 *
 * Task: bump version
 */
const updatePackageFile = (newVer, callback) => {
  return src('./package.json')
    .pipe(plumber({ errorHandler: errorLog }))
    .pipe(bump({ version: newVer }))
    .pipe(dest('./'))
    .on('end', callback);
};
const bumpVersion = async () => {
  const currentVersion = getPackageJsonVersion();
  const res = await prompt({
    type: 'list',
    name: 'bump',
    message: 'What type of bump would you like to do?',
    choices: ['patch', 'minor', 'major', 'prerelease']
  });
  const selectedChoice = res.bump;
  const newVer = semver.inc(currentVersion, selectedChoice);

  updatePackageFile(newVer, () => { });
};

/**
 * Task: Cleanup
 *
 * Cleanups dest files
 */
const cleanCss = () => {
  return del([styleFiles.dest.files]);
};
const cleanJs = () => {
  return del([scriptFiles.vendor.dest.files, scriptFiles.user.dest.files]);
};
const cleanHtml = () => {
  return del([htmlFiles.dest.files]);
};
const cleanTask = parallel(cleanHtml, cleanCss, cleanJs);

/**
 * Task: `styles`.
 *
 * Compiles Less, Autoprefixes it and Minifies CSS.
 *
 */
const buildStyles = (done) => {
  const plugins = [cssnano({ preset: 'default' })];

  return src(styleFiles.src.mainFile)
    .pipe(plumber({ errorHandler: errorLog }))
    .pipe(gulpif(config.sourceMaps, sourcemaps.init()))

    .pipe(less())

    .pipe(gulpif(config.sourceMaps, sourcemaps.write({ includeContent: false }))) // By default the source maps include the source code. Pass false to use the original files.
    .pipe(gulpif(config.sourceMaps, sourcemaps.init({ loadMaps: true })))         // Set to true to load existing maps for source files.

    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))

    .pipe(gulpif(config.sourceMaps, sourcemaps.write('.')))

    .pipe(gulpif(config.production, postcss(plugins)))
    .pipe(gulpif(config.production, rename({ suffix: '.min' })))

    .pipe(dest(styleFiles.dest.path))

    .pipe(filter('**/*.css'))                                                     // Filtering stream to only css files
    .pipe(browserSync.stream())                                                     // Injects CSS into browser

    .pipe(size({ showFiles: true }));
  done();
};
const buildStylesTask = series(cleanCss, buildStyles);

/**
  * Task: `scripts`.
  *
  * Concatenate and uglify custom scripts.
  *
  */
const jsLint = (done) => {
  return src(scriptFiles.user.src.files)
    .pipe(plumber({ errorHandler: errorLog }))
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
  done();
};
const jsUser = (done) => {
  let uglifyScripts = lazypipe().pipe(rename, { suffix: '.min' }).pipe(uglify);
  src(scriptFiles.user.src.files)
    .pipe(plumber({ errorHandler: errorLog }))
    .pipe(babel({ presets: ['babel-preset-es2015'] }))
    .pipe(concat(scriptFiles.user.dest.filename))
    .pipe(gulpif(config.production, uglifyScripts()))
    .pipe(dest(scriptFiles.user.dest.path))
    .pipe(size({ showFiles: true }));
  done();
};
const buildUserScripts = series(jsLint, jsUser);

const buildVendorScripts = (done) => {
  let uglifyScripts = lazypipe().pipe(rename, { suffix: '.min' }).pipe(uglify);
  src(scriptFiles.vendor.src.files)
    .pipe(plumber({ errorHandler: errorLog }))
    .pipe(concat(scriptFiles.vendor.dest.filename))
    .pipe(uglifyScripts())
    .pipe(dest(scriptFiles.vendor.dest.path))
    .pipe(size({ showFiles: true }));
  done();
};

/**
 * Task: render HTML template
 */
const renderHtmlTask = (done) => {
  let date = getDate();
  let cacheBust = lazypipe()
    .pipe(replace, /(dist)(.*)(\.)(css|js)/g, '$1$2$3$4?' + date);

  return src(htmlFiles.src.pages)
    .pipe(plumber({ errorHandler: errorLog }))
    .pipe(htmlRender({
      path: htmlFiles.src.templates
    }))
    .pipe(gulpif(config.production, processhtml()))
    .pipe(gulpif(config.production, cacheBust()))
    .pipe(dest(htmlFiles.dest.path))
    .pipe(size({ showFiles: true }));
  done();
};

/**
  * Task: `images`.
  *
  * Compresses PNG, JPEG, GIF and SVG images.
  *
  * This task does the following:
  *     1. Gets the images from src folder
  *     2. Compresses PNG, JPEG, GIF and SVG images
  *     3. Generates and saves the optimized images in dist folder
  *
  */
const compressImageTask = (done) => {
  return src(imageFiles.src.files)

    .pipe(imagemin({
      optimizationLevel: 5, // 0-7 low-high
      progressive: true,
      interlaced: true,
      svgoPlugins: [{ removeViewBox: false }]
    }))

    .pipe(dest(imageFiles.dest.path));
  done();
};


/**
 * Task: `browser-sync`.
 *
 * Live Reloads, CSS injections, Localhost tunneling.
 *
 * This task does the following:
 *    1. Sets the project URL
 *    2. Sets inject CSS
 *    3. You may want to stop the browser from openning automatically
 */
// browserSync
const browserSyncTask = (done) => {
  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync.init({
    // built-in static server for basic HTML/JS/CSS websites
    server: true,

    // Will not attempt to determine your network status, assumes you're ONLINE
    online: true,

    // open the proxied app in chrome
    browser: ['google-chrome'],

    // `true` Automatically open the browser with BrowserSync live server.
    // `false` Stop the browser from automatically opening.
    open: false,

    // Console log connections
    logLevel: 'info',

    // The small pop-over notifications in the browser are not always needed/wanted
    notify: true,
  });
  done();
};

/**
 * Task: BrowserSync reload
 */
const browserReload = (done) => {
  return browserSync.reload;
  done();
};

/**
 * Task: Watch for file modification at specific paths and run respective tasks accordingly
 */
const devWatch = () => {
  watch(watchFiles.styles, buildStylesTask);
  watch(watchFiles.html, renderHtmlTask).on('change', browserReload());
  watch(watchFiles.scripts, buildUserScripts).on('change', browserReload());
  watch(watchFiles.images, compressImageTask).on('change', browserReload());
};


exports.cleanAll      = cleanTask;
exports.buildStyles   = buildStylesTask;
exports.buildScripts  = buildUserScripts;
exports.buildVendors  = buildVendorScripts;
exports.renderHtml    = renderHtmlTask;
exports.compressImage = compressImageTask;
exports.browserSync   = browserSyncTask;

/**
 * Run all the tasks sequentially
 * Use this task for development
*/
exports.serve = series(cleanTask, parallel(renderHtmlTask, buildStylesTask, buildVendorScripts, buildUserScripts), browserSyncTask, devWatch);

/**
 * browserSyncTask task
 */
exports.sync = series(browserSyncTask, devWatch);

/**
 * Production task
 */
exports.buildProd = series(cleanTask, parallel(buildStylesTask, buildVendorScripts, buildUserScripts, renderHtmlTask), bumpVersion);

/**
 * Default Gulp task
 */
exports.default = series(cleanTask, parallel(buildStylesTask, buildUserScripts, buildVendorScripts, renderHtmlTask));
