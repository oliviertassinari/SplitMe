'use strict';

var envify = require('envify/custom');
var uglifyify = require('uglifyify');
var autoprefix = require('less-plugin-autoprefix');
var cleanCss = require('less-plugin-clean-css');
var reactify = require('reactify');

// Tasks runner
module.exports = function(grunt) {
  require('time-grunt')(grunt); // Display the elapsed execution time of grunt tasks
  require('jit-grunt')(grunt, { // Just In Time plugin loader for grunt
    jshint: 'grunt-jsxhint',
  });

  grunt.initConfig({
    src: {
      dir: 'src',
      jsx: '**/*.jsx',
      less: '**/*.less',
    },

    build: {
      dir: 'build'
    },

    dist: {
      dir: 'cordova/www'
    },

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: {
      build: [
        '<%= build.dir %>'
      ],

      dist: [
        '<%= dist.dir %>'
      ],
    },

    /**
     * `jshint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in `options`.
     */
    jshint: {
      options: {
        jshintrc: '.jshintrc',
      },
      src: {
        src: '<%= src.dir %>/<%= src.jsx %>',
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
    },

    /**
     * The `copy` task just copies files from A to B.
     */
    copy: {
      build: {
        files: [{
          cwd: '<%= src.dir %>',
          src: ['**/*.png', '**/*.woff'],
          dest: '<%= build.dir %>',
          expand: true
        },
        {
          cwd: 'components/material-design-iconic-font',
          src: [
            'fonts/*.woff',
            'css/*.min.css'
          ],
          dest: '<%= build.dir %>/material-design-iconic-font',
          expand: true
        }]
      },
      dist: {
        files: [{
          cwd: '<%= src.dir %>',
          src: ['**/*.png', '**/*.woff'],
          dest: '<%= dist.dir %>',
          expand: true
        },
        {
          cwd: 'components/material-design-iconic-font',
          src: [
            'fonts/*.woff',
            'css/*.min.css'
          ],
          dest: '<%= dist.dir %>/material-design-iconic-font',
          expand: true
        }]
      },
    },

    connect: {
      server: {
        options: {
          base: '<%= build.dir %>',
          port: 8000,
          hostname: '*',
          livereload: true,
          open: true,
          middleware: function (connect, options) {
            var middlewares = [];

            var path = require('path');
            var url = require('url');

            // RewriteRules support
            middlewares.push(function pushState(req, res, next) {
              var pathname = url.parse(req.url).pathname;
              if (!path.extname(pathname)) {
                req.url = '/';
              }
              next();
            });

            if (!Array.isArray(options.base)) {
                options.base = [options.base];
            }

            var directory = options.directory || options.base[options.base.length - 1];
            options.base.forEach(function (base) {
                // Serve static files.
                middlewares.push(connect.static(base));
            });

            // Make directory browse-able.
            middlewares.push(connect.directory(directory));

            return middlewares;
          }
        }
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     * But we don't need the same thing to happen for all the files.
     */
    watch: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true,
        livereloadOnError: false, // Livereload only be triggered if all tasks completed successfully
      },
      appJs: {
        files: '<%= build.dir %>/app.js',
        tasks: []
      },
      index: {
        files: '<%= src.dir %>/index.html',
        tasks: 'index:build'
      },
      less: {
        files: '<%= src.dir %>/<%= src.less %>',
        tasks: 'less:build',
      },
    },

    index: {
      build: {
        indexSrc: '<%= src.dir %>/index.html',
        indexDest: '<%= build.dir %>/index.html',
        src: [
          '<%= build.dir %>/**/*.css',
          '<%= build.dir %>/**/*.js',
        ],
        remove: '<%= build.dir %>',
      },
      dist: {
        indexSrc: '<%= src.dir %>/index.html',
        indexDest: '<%= dist.dir %>/index.html',
        src: [
          '<%= dist.dir %>/**/*.css',
          '<%= dist.dir %>/**/*.js',
        ],
        remove: '<%= dist.dir %>/',
        url: [
          'cordova.js',
        ],
      },
    },

    browserify: {
      options: {
        transform: [
          reactify,
        ],
        browserifyOptions: {
          // fullPaths: true,
          extensions: ['.jsx'],
        },
      },
      build: {
        src: '<%= src.dir %>/app.jsx',
        dest: '<%= build.dir %>/app.js'
      },
      watch: {
        options: {
          watch: true,
        },
        src: '<%= src.dir %>/app.jsx',
        dest: '<%= build.dir %>/app.js'
      },
      dist: {
        options: {
          transform: [
            reactify,
            [envify({NODE_ENV: 'production'}), {
              global: true,
            }],
            [uglifyify, {
              global: true,
              mangle: {
                toplevel: true
              },
            }]
          ],
          plugin: ['bundle-collapser/plugin']
        },
        src: '<%= src.dir %>/app.jsx',
        dest: '<%= dist.dir %>/app.js'
      },
    },

    less: {
      build: {
        options: {
          plugins: [
            new autoprefix({
              browsers: ["last 2 versions"],
              cascade: false,
            }),
          ],
        },
        files: {
          '<%= build.dir %>/material-ui.css': '<%= src.dir %>/<%= src.less %>'
        }
      },
      dist: {
        options: {
          plugins: [
            new autoprefix({
              browsers: ["last 2 versions"],
              cascade: false,
            }),
            new cleanCss({
            })
          ],
        },
        files: {
          '<%= dist.dir %>/material-ui.css': '<%= src.dir %>/<%= src.less %>'
        }
      },
    },
    webdriver: {
      options: {
        desiredCapabilities: {
          browserName: 'chrome'
        }
      },
      feature: {
        tests: ['test/feature/*.js'],
      },
      deleteExpense:{
        tests: ['test/feature/deleteExpense.js'],
      },
      editExpense:{
        tests: ['test/feature/editExpense.js'],
      },
    },
  });

  /**
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * ation.
   */
  grunt.registerMultiTask('index', 'Process index template', function() {
    var remove = this.data.remove;

    var filesSrc = this.filesSrc.map(function (file) {
      return file.replace(remove, '');
    });

    if (this.data.url) {
      filesSrc = filesSrc.concat(this.data.url);
    }

    function filter(files, regex) {
      return files.filter(function(file) {
        return file.match(regex);
      });
    }

    var scripts = filter(filesSrc, /\.js$/);
    var styles = filter(filesSrc, /\.css$/);

    grunt.file.copy(this.data.indexSrc, this.data.indexDest, {
      process: function(contents) {
        return grunt.template.process(contents, {
          data: {
            scripts: scripts,
            styles: styles
          }
        });
      }
    });
  });

  grunt.registerTask('dev', [
    'build', 'browserify:watch', 'connect:server', 'watch',
  ]);

  grunt.registerTask('build', [
    'clean:build',
    'less:build',
    'browserify:build',
    'copy:build',
    'index:build',
  ]);

  grunt.registerTask('dist', [
    'jshint',
    'clean:dist',
    'less:dist',
    'browserify:dist',
    'copy:dist',
    'index:dist',
  ]);

  grunt.registerTask('default', ['build', 'dist']);
};
