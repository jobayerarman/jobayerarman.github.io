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
const paths = {
  // Project root folders
  base: {
    src: 'src/',
    dest: 'dist/'
  },
  // Styles folders and files
  styles: {
    src: 'src/less/',
    mainFile: 'src/less/main.less',
    allFile: 'src/less/**/*.less',
    dest: 'dist/css/',
    destFiles: 'dist/css/*.+(css|map)'
  },
  // Scripts folders and files
  scripts: {
    user: {
      src: 'src/js/user/',
      srcFiles: 'src/js/user/*.js',
      dest: 'dist/js/',
      destFiles: 'dist/js/*.+(js|map)',
      fileName: 'user.js'
    },
    vendor: {
      src: 'src/js/vendor/',
      srcFiles: ['src/js/vendor/TweenMax.js', 'src/js/vendor/ScrollMagic.js', 'src/js/vendor/debug.addIndicators.js', 'src/js/vendor/velocity.js', 'src/js/vendor/velocity.ui.js', 'src/js/vendor/typed.js'],
      dest: 'dist/js/',
      destFiles: 'dist/js/*.+(js|map)',
      fileName: 'vendor.js'
    }
  },
  // HTML folders and files
  html: {
    src: 'src/site/',
    pages: 'src/site/pages/*.+(html|njk)',
    files: 'src/site/**/*.+(html|njk)',
    templates: 'src/site/templates',
    dest: './',
    destFiles: '*.html'
  },
  // Image folders and files
  images: {
    src: 'src/images/',
    srcFiles: 'src/images/*.{png,jpg,gif,svg}',
    dest: 'dist/images/',
    destFiles: 'dist/images/*.{png,jpg,gif,svg}'
  },
  // Watch variables
  watch: {
    styles: 'src/less/**/*.less',
    scripts: 'src/js/user/*.js',
    images: 'src/images/*.{png,jpg,gif,svg}',
    html: 'src/site/**/*.+(html|njk)'
  }
};

// Browsers you care about for autoprefixing.
// Browserlist https://github.com/ai/browserslist
const AUTOPREFIXER_BROWSERS = [
  'last 5 versions', '> 5%'
];
// End of project variables

/**
 * Load Plugins.
 *
 * Load gulp plugins and assigning them semantic names.
 */
const { src, dest, parallel, series, watch } = require('gulp');                  // Importing all the Gulp-related packages we want to use
const argv                                   = require('minimist')(process.argv.slice(2)); // Parses the command line arguments passed to Gulp
const fancyLog                               = require('fancy-log');             // Log things, prefixed with a timestamp

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
  isProduction: argv.production ? true : false,
  sourceMaps: argv.production ? false: true,
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
  const { bgWhite } = fancyLog.colors;
  fancyLog.error(
    `${bgWhite.red(' TASK: ')} [${error.plugin}]\n` +
    `${bgWhite.red(' ERRR: ')} ${error.message}\n` +
    (error.lineNumber ? `${bgWhite.red(' LINE:')} ${error.lineNumber}\n` : '') +
    (error.column ? `${bgWhite.red(' COL: ')} ${error.column}\n` : '') +
    (error.fileName ? `${bgWhite.red(' FILE:')} ${error.fileName}\n` : '')
  );
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
  return del([paths.styles.destFiles]);
};
const cleanJs = () => {
  return del([paths.scripts.vendor.destFiles, paths.scripts.user.destFiles]);
};
const cleanHtml = () => {
  return del([paths.html.destFiles]);
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

  return src(paths.styles.mainFile)
    .pipe(plumber({ errorHandler: errorLog }))
    .pipe(gulpif(config.sourceMaps, sourcemaps.init()))

    .pipe(less())

    .pipe(gulpif(config.sourceMaps, sourcemaps.write({ includeContent: false }))) // By default the source maps include the source code. Pass false to use the original files.
    .pipe(gulpif(config.sourceMaps, sourcemaps.init({ loadMaps: true })))         // Set to true to load existing maps for source files.

    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))

    .pipe(gulpif(config.sourceMaps, sourcemaps.write('.')))

    .pipe(gulpif(config.isProduction, postcss(plugins)))
    .pipe(gulpif(config.isProduction, rename({ suffix: '.min' })))

    .pipe(dest(paths.styles.dest))

    .pipe(filter('**/*.css'))                                                     // Filtering stream to only css files
    .pipe(browserSync.stream())                                                   // Injects CSS into browser

    .pipe(size({ showFiles: true }));
  done();
};
const buildStylesTask = series(cleanCss, buildStyles);

/**
 * Lint JavaScript files using ESLint
 */
const jsLint = (done) => {
  return src(paths.scripts.user.srcFiles)
    .pipe(plumber({ errorHandler: errorLog }))
    .pipe(eslint())
    .pipe(eslint.format())          // eslint.format() outputs the lint results to the console.
    .pipe(eslint.failAfterError()); // To have the process exit with an error code (1) on lint error, return the stream and pipe to failAfterError last.
  done();
};
/**
 * Declares a reusable function to minify JavaScript files with a .min suffix using lazypipe
 */
const uglifyScripts = lazypipe()
  .pipe(rename, { suffix: '.min' })
  .pipe(uglify);
/**
  * Task: `jsUser`.
  * Concatenate and uglify custom scripts.
  */
const jsUser = (done) => {
  src(paths.scripts.user.srcFiles)
    .pipe(plumber({ errorHandler: errorLog }))
    .pipe(babel({ presets: ['babel-preset-es2015'] }))
    .pipe(concat(paths.scripts.user.fileName))
    .pipe(gulpif(config.isProduction, uglifyScripts()))
    .pipe(dest(paths.scripts.user.dest))
    .pipe(size({ showFiles: true }));
  done();
};
const buildUserScripts = series(jsLint, jsUser);
/**
  * Task: `buildVendorScripts`.
  * Concatenate and uglify vendor scripts.
  */
const buildVendorScripts = (done) => {
  src(paths.scripts.vendor.srcFiles)
    .pipe(plumber({ errorHandler: errorLog }))
    .pipe(concat(paths.scripts.vendor.fileName))
    .pipe(uglifyScripts())
    .pipe(dest(paths.scripts.vendor.dest))
    .pipe(size({ showFiles: true }));
  done();
};

/**
 * Task: render HTML template
 */
const renderHtmlTask = (done) => {
  let date = getDate();
  let cacheBust = lazypipe()
    .pipe(replace, /(dist)(.*)(\.)(css|js)/, '$1$2$3$4?' + date);

  return src(paths.html.pages)
    .pipe(plumber({ errorHandler: errorLog }))
    .pipe(htmlRender({
      path: paths.html.templates
    }))
    .pipe(gulpif(config.isProduction, processhtml()))
    .pipe(gulpif(config.isProduction, cacheBust()))
    .pipe(dest(paths.html.dest))
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
const compressImageTask = () => {
  return src(paths.images.srcFiles)
    .pipe(imagemin([
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: false },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(dest(paths.images.dest));
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
  watch(paths.watch.styles, buildStylesTask);
  watch(paths.watch.html, renderHtmlTask).on('change', browserReload());
  watch(paths.watch.scripts, buildUserScripts).on('change', browserReload());
  watch(paths.watch.images, compressImageTask).on('change', browserReload());
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
