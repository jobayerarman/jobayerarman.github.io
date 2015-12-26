module.exports = function(grunt) {

  // Load the plugins
  require('load-grunt-tasks')(grunt);

  // constants for various paths and files to be used by the task configuration

  /* Source Directories */
  // Source Base
  var SRC_DIR         = 'src/';

  // Source Directory
  var SRC_DIR_JS      = SRC_DIR + 'js/';
  var SRC_DIR_CSS     = SRC_DIR + 'css/';
  var SRC_DIR_LESS    = SRC_DIR + 'less/';

  // Source Files
  var SRC_FILES_JS    = SRC_DIR_JS   + '*.js';
  var SRC_FILES_CSS   = SRC_DIR_CSS  + '*.css';
  var SRC_FILES_LESS  = SRC_DIR_LESS + '*.less';

  // Browser prefix for Autoprefixing
  var AP_BROWSERS = [
    'Android >= 4',
    'Chrome >= 35',
    'Firefox >= 35',
    'Explorer >= 7',
    'iOS >= 6',
    'Opera >= 20',
    'Safari >= 9'
  ];

  /* Output Directories */
  // Destination Base
  var BUILD_DIR       = 'dist/';

  // Stylesheet Sources
  var BUILD_DIR_CSS   = BUILD_DIR     + 'css/';
  var BUILD_FILE_CSS  = BUILD_DIR_CSS + 'style.min.css';
  var BUILD_FILES_CSS = BUILD_DIR_CSS + '*.css';

  // JavaScripts Sources
  var BUILD_DIR_JS    = BUILD_DIR     + 'js/';
  var BUILD_FILE_JS   = BUILD_DIR_JS  + 'script.js';
  var BUILD_FILES_JS  = BUILD_DIR_JS  + '*.js';


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Shows tasks completion notification
    notify: {
      html: {
        options: {
          title: 'HTML',
          message: 'HTML files build success'
        }
      },
      css: {
        options: {
          title: 'CSS',
          message: 'Running CSSFlow'
        }
      },
      copy: {
        options: {
          title: 'CSS Copy to dist folder',
          message: 'CSS files copied to dist'
        }
      },
      js: {
        options: {
          title: 'JavaScript',
          message: 'JavaScript concated successfully'
        }
      },
    },

    // clean each destination before output
    clean: {
      css: [SRC_FILES_CSS],
      js : [BUILD_FILES_JS]
    },

    // all in one processor of the LESS to CSS
    cssflow: {
      options: {
        preprocessor: 'less',
        autoprefixer: {
          browsers: AP_BROWSERS
        }
      },
      build: {
        files: {
          'src/css/style.css': 'src/less/main.less'
        }
      }
    },

    // copy CSS from source directory to dist folder
    copy: {
      build: {
        cwd: SRC_DIR_CSS,
        src: ['*.css'],
        dest: BUILD_DIR_CSS,
        expand: true
      }
    },

    // only process LESS to CSS
    less: {
      build: {
        files: {
          'src/css/style.css': SRC_FILES_LESS
        }
      }
    },

    uncss: {
      build: {
        files: [
          { src: 'index.html', dest: 'dist/css/style.uncss.css' }
        ],
        options: {
          ignoreSheets: [/fonts.googleapis/]
        }
      }
    },

    // Minifies or compress CSS
    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      build: {
        files: {
          'dist/css/style.min.css': 'src/css/style.css'
        }
      },
      dist: {
        files: {
          'dist/css/style.uncss.css': 'dist/css/style.uncss.css'
        }
      }
    },

    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        curly: true,
        globals: {
          jQuery: true
        }
      },
      beforeconcat: [SRC_FILES_JS],
      afterconcat: [BUILD_FILE_JS]
    },

    concat: {
      options: {
        seperator: ";"
      },
      build: {
        src: [SRC_FILES_JS],
        dest: BUILD_FILE_JS
      }
    },

    uglify: {
      build: {
        files: {
          'dist/js/script.min.js': 'dist/js/script.js'
        }
      }
    },

    watch: {
      styles: {
        options: {
          spawn: false
        },
        files: ['src/less/*.less', 'src/less/**/*.less'],
        tasks: ['notify:css', 'cssflow', 'copy', 'notify:copy']
      },
      scripts: {
        options: {
          spawn: false
        },
        files: ['src/js//*.js'],
        tasks: ['jshint:beforeconcat', 'clean:js', 'concat', 'notify:js', 'uglify', 'jshint:afterconcat']
      }
    }
  });

  //Default Task(s)
  grunt.registerTask('default', ['clean:css', 'cssflow', 'copy', 'watch']);

  grunt.registerTask('cleancss', ['uncss', 'cssmin:dist']);
};
