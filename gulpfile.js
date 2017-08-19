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
var basePaths = {
  src: 'src/',
  dest: 'dist/'
};
// Styles folders and files
var styles = {
  src: {
    path      : basePaths.src + 'less/',
    mainFile  : basePaths.src + 'less/main.less',
    allFiles  : basePaths.src + 'less/**/*.less'
  },
  dest: {
    path      : basePaths.dest + 'css/',
    files     : basePaths.dest + 'css/*.+(css|map)'
  }
};
// Scripts folders and files
var scripts = {
  user: {
    src: {
      path      : basePaths.src + 'js/user/',
      files     : basePaths.src + 'js/user/*.js'
    },
    dest: {
      path      : basePaths.dest + 'js/',
      files     : basePaths.dest + 'js/*.js',
      filename  : 'user.js'
    }
  },
  vendor: {
    src: {
      path      : basePaths.src + 'js/vendor/',
      files     : basePaths.src + 'js/vendor/*.js'
    },
    dest: {
      path      : basePaths.dest + 'js/',
      files     : basePaths.dest + 'js/*.js',
      filename  : 'vendor.js'
    }
  }
};
// HTML folders and files
var html = {
  src: {
    path      : basePaths.src + 'site/',
    pages     : basePaths.src + 'site/pages/*.+(html|njk)',
    files     : basePaths.src + 'site/**/*.+(html|njk)',
    templates : basePaths.src + 'site/templates'
  },
  dest: {
    path      : './',
    files     : '*.html'
  }
};
// Image folders and files
var images = {
  src: {
    path      : basePaths.src + 'images/',
    files     : basePaths.src + 'images/*.{png,jpg,gif,svg}'
  },
  dest: {
    path      : basePaths.dest + 'images/',
    files     : basePaths.dest + 'images/*.{png,jpg,gif,svg}'
  }
};
// Watch variables
var watch = {
  styles    : styles.src.allFiles,
  scripts   : scripts.user.src.files,
  images    : images.src.files,
  html      : html.src.files
};

// Browsers you care about for autoprefixing.
// Browserlist https://github.com/ai/browserslist
const AUTOPREFIXER_BROWSERS = [
  'android >= 4',
  'bb >= 10',
  'chrome >= 34',
  'ff >= 30',
  'ie >= 9',
  'ie_mob >= 10',
  'ios >= 7',
  'opera >= 23',
  'safari >= 7',
];
// End of project variables

/**
 * Load Plugins.
 *
 * Load gulp plugins and assigning them semantic names.
 */
var gulp         = require('gulp');                  // Gulp of-course
var gutil        = require('gulp-util');             // Utility functions for gulp plugins

// CSS related plugins.
var less         = require('gulp-less');             // Gulp pluign for Sass compilation.
var cssmin       = require('gulp-cssmin');           // Minifies CSS files.
var autoprefixer = require('gulp-autoprefixer');     // Autoprefixing magic.
var sourcemaps   = require('gulp-sourcemaps');       // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file.

// JS related plugins.
var jshint       = require('gulp-jshint');           // JSHint plugin for gulp
var concat       = require('gulp-concat');           // Concatenates JS files
var uglify       = require('gulp-uglify');           // Minifies JS files

// HTML template engine
var htmlRender   = require('gulp-nunjucks-render');  // Render Nunjucks templates
var processhtml  = require('gulp-processhtml');      // Process html files at build time to modify them depending on the release environment

// Image realted plugins.
var imagemin     = require('gulp-imagemin');         // Minify PNG, JPEG, GIF and SVG images with imagemin.

// Github related plugins
var fs           = require('fs');
var semver       = require('semver');
var bump         = require('gulp-bump');
var prompt       = require('gulp-prompt');
var replace      = require('gulp-replace');

// Utility related plugins.
var browserSync  = require('browser-sync').create(); // Reloads browser and injects CSS. Time-saving synchronised browser testing.
var del          = require('del');                   // Delete files and folders
var filter       = require('gulp-filter');           // Helps work on a subset of the original files by filtering them using globbing.
var gulpSequence = require('gulp-sequence');         // Run a series of gulp tasks in order
var gulpif       = require('gulp-if');               // A ternary gulp plugin: conditionally control the flow of vinyl objects.
var lazypipe     = require('lazypipe');              // Lazypipe allows to create an immutable, lazily-initialized pipeline.
var notify       = require('gulp-notify');           // Sends message notification to you
var plumber      = require('gulp-plumber');          // Prevent pipe breaking caused by errors from gulp plugins
var reload       = browserSync.reload;               // For manual browser reload.
var rename       = require('gulp-rename');           // Renames files E.g. style.css -> style.min.css
var size         = require('gulp-size');             // Logs out the total size of files in the stream and optionally the individual file-sizes

var config = {
  production: !!gutil.env.production, // Two exclamations turn undefined into a proper false.
  sourceMaps:  !gutil.env.production
};

/**
 * get version from package.json
 */
function getPackageJsonVersion() {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
}

/**
 * Notify Errors
 */
function errorLog(error) {
  var lineNumber = (error.line) ? 'Line ' + error.line + ' -- ' : '';
  var column     = (error.column) ? 'Col ' + error.column : '';

  notify({
    title: 'Task [' + error.plugin + '] Failed',
    message: lineNumber + '' + column
  }).write(error); //Error Notification

  // Inspect the error object
  // console.log(error);

  // Pretty error reporting
  var report = '';
  var chalk = gutil.colors.white.bgRed;

  report += '\n';
  report += chalk('TASK:') + ' [' + error.plugin + ']\n';
  report += chalk('PROB:') + ' ' + error.message + '\n';
  if (error.lineNumber) { report += chalk('LINE:') + ' ' + error.lineNumber + '\n'; }
  if (error.column) { report += chalk('COL:') + '  ' + error.column + '\n'; }
  if (error.fileName)   { report += chalk('FILE:') + ' ' + error.fileName + '\n'; }
  console.error(report);

  this.emit('end');
};

/**
 * Datestamp for cache busting
 */
var getDate = function() {
  var myDate = new Date();

  var myYear    = myDate.getFullYear().toString();
  var myMonth   = ('0' + (myDate.getMonth() + 1)).slice(-2);
  var myDay     = ('0' + myDate.getDate()).slice(-2);
  var mySeconds = myDate.getSeconds().toString();

  var dateStamp = myYear + myMonth + myDay + mySeconds;

  return dateStamp;
};

/**
 * Github workflow
 *
 * Task: bump version
 */
gulp.task( 'bump:version', function (callback) {
  var currentVersion = getPackageJsonVersion();
  gulp.src('/', {read: false})
    .pipe(prompt.prompt({
      type: 'list',
      name: 'bump',
      message: 'What type of bump would you like to do?',
      choices: ['patch', 'minor', 'major', 'prerelease']
    },
    function (res) {
      var selectedChoice = res.bump;
      var newVer = semver.inc(currentVersion, selectedChoice);

      bumpFiles(newVer, callback);
    }))
});
function bumpFiles(newVer, callback) {

  gulp.src(['./package.json'])
    .pipe(plumber({errorHandler: errorLog}))
    .pipe(bump({version: newVer}))
    .pipe(gulp.dest('./'));

  callback();
};

/**
 * Task: Cleanup
 *
 * Cleanups dest files
 */
gulp.task('clean:css', function() {
  return del([styles.dest.files]);
});
gulp.task('clean:html', function() {
  return del([html.dest.files]);
});
gulp.task('clean:js', function() {
  return del([scripts.vendor.dest.files, scripts.user.dest.files]);
});
gulp.task('clean:all', gulpSequence('clean:html', 'clean:css', 'clean:js'));

/**
 * Task: `styles`.
 *
 * Compiles Less, Autoprefixes it and Minifies CSS.
 *
 */
 gulp.task('styles', ['clean:css'], function() {
  var minifyCss = lazypipe()
  .pipe( rename, {suffix: '.min'})
  .pipe( cssmin, {keepSpecialComments: false});

  return gulp.src( styles.src.mainFile )
    .pipe( plumber( {errorHandler: errorLog}) )
    .pipe( gulpif( config.sourceMaps, sourcemaps.init() ) )

    .pipe( less() )

    .pipe( gulpif( config.sourceMaps, sourcemaps.write({ includeContent: false }) ) ) // By default the source maps include the source code. Pass false to use the original files.
    .pipe( gulpif( config.sourceMaps, sourcemaps.init({ loadMaps: true }) ) )         // Set to true to load existing maps for source files.

    .pipe( autoprefixer( AUTOPREFIXER_BROWSERS ) )

    .pipe( gulpif( config.sourceMaps, sourcemaps.write('.') ) )

    .pipe( gulpif( config.production, minifyCss() ) )

    .pipe( gulp.dest( styles.dest.path ) )
    .pipe( filter( '**/*.css' ) )                                                     // Filtering stream to only css files
    .pipe( browserSync.stream() )                                                     // Injects CSS into browser

    .pipe( size({
      showFiles: true
    }) );
});


/**
  * Task: `scripts`.
  *
  * Concatenate and uglify custom scripts.
  *
  */
gulp.task( 'scripts', ['clean:js'], function() {
  var uglifyScripts = lazypipe()
  .pipe( rename, {suffix: '.min'})
  .pipe( uglify );

  gulp.src( scripts.vendor.src.files )
    .pipe( plumber({errorHandler: errorLog}) )

    .pipe( concat( scripts.vendor.dest.filename ) )
    .pipe( uglifyScripts() )

    .pipe( gulp.dest( scripts.vendor.dest.path ) )

    .pipe( size({
      showFiles: true
    }) );

  gulp.src( scripts.user.src.files )
    .pipe( plumber({errorHandler: errorLog}) )

    .pipe( jshint('.jshintrc') )
    .pipe( jshint.reporter('jshint-stylish') )

    .pipe( concat( scripts.user.dest.filename ) )
    .pipe( gulpif( config.production, uglifyScripts() ) )

    .pipe( gulp.dest( scripts.user.dest.path ) )

    .pipe( size({
      showFiles: true
    }) );

});


/**
 * Task: render HTML template
 */
gulp.task( 'render:html', function() {
  var date = getDate();
  var cacheBust = lazypipe()
    .pipe( replace, /(dist)(.*)(\.)(css|js)/g, '$1$2$3$4?' + date );

  return gulp.src( html.src.pages )
    .pipe( plumber({errorHandler: errorLog}) )
    .pipe( htmlRender({
      path: html.src.templates
    }))
    .pipe( gulpif( config.production, processhtml() ) )
    .pipe( gulpif( config.production, cacheBust() ) )
    .pipe( gulp.dest( html.dest.path ))
    .pipe( size({
      showFiles: true
    }) );
});

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
gulp.task( 'image:compress', function() {
  return gulp.src( images.src.files )

    .pipe( imagemin( {
      optimizationLevel: 5, // 0-7 low-high
      progressive: true,
      interlaced: true,
      svgoPlugins: [{removeViewBox: false}]
    }))

    .pipe(gulp.dest( images.dest.path ));
});


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
gulp.task( 'browser-sync', function() {
  browserSync.init( {

    // built-in static server for basic HTML/JS/CSS websites
    server: true,

    // Will not attempt to determine your network status, assumes you're ONLINE
    online: true,

    // Open the site in Chrome
    browser: "chrome.exe",

    // `true` Automatically open the browser with BrowserSync live server.
    // `false` Stop the browser from automatically opening.
    open: false,

    // Console log connections
    logConnections: false,

    // The small pop-over notifications in the browser are not always needed/wanted
    notify: true,
  });
});


/**
 * Default Gulp task
 */
gulp.task( 'default', gulpSequence('clean:all', 'styles', 'scripts', 'render:html'));

/**
 * Production task
 */
gulp.task( 'build:prod', gulpSequence('clean:all', 'bump:version', 'styles', 'scripts', 'render:html'));


/**
 * Run all the tasks sequentially
 * Use this task for development
 */
gulp.task( 'serve', gulpSequence('render:html', 'styles', 'scripts', 'watch'));

/**
  * Watch Tasks.
  *
  * Watches for file changes and runs specific tasks.
  */
gulp.task( 'watch', ['browser-sync'], function() {
  gulp.watch( watch.styles, [ 'styles' ] );    // Run LESS task on file changes.
  gulp.watch( watch.html, [ 'watch:html' ] );  // Render files and reload on HTML file changes.
  gulp.watch( watch.scripts, [ 'watch:js' ] ); // Reload on customJS file changes.
  gulp.watch( watch.images, [ 'watch:img' ] ); // Reload on image file changes.
});

// reloading browsers
gulp.task('watch:html', ['render:html'], function (done) {
    browserSync.reload();
    done();
});
gulp.task('watch:js', ['scripts'], function (done) {
    browserSync.reload();
    done();
});
gulp.task('watch:img', ['image:compress'], function (done) {
    browserSync.reload();
    done();
});
