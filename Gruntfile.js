'use strict';

var autoprefix = require('less-plugin-autoprefix');
var cleanCss = require('less-plugin-clean-css');
var webpack = require('webpack');

var webpackConfig = require('./webpack.config.js');
var webpackProductionConfig = require('./webpack-production.config.js');

// Tasks runner
module.exports = function(grunt) {
  require('time-grunt')(grunt); // Display the elapsed execution time of grunt tasks
  require('jit-grunt')(grunt, { // Just In Time plugin loader for grunt
    jshint: 'grunt-jsxhint',
    'webpack-dev-server': 'grunt-webpack',
  });

  grunt.initConfig({
    src: {
      dir: 'src',
      js: '**/*.js',
      jsx: '**/*.jsx',
    },

    build: {
      dir: 'build'
    },

    dist: {
      dir: 'cordova/www'
    },

    locale: {
      dir: 'src/locale',
      json: '*.json',
    },

    /**
     * The directories to delete.
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
        src: [
          '<%= src.dir %>/<%= src.js %>',
          '<%= src.dir %>/<%= src.jsx %>',
        ],
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
    },

    connect: {
      server: {
        options: {
          base: '<%= dist.dir %>',
          port: 8001,
          open: true,
          hostname: '*',
          keepalive: true,
        }
      }
    },

    /**
     * The `copy` task just copies files from A to B.
     */
    copy: {
      build: {
        files: [{
          cwd: '<%= locale.dir %>',
          src: '<%= locale.json %>',
          dest: '<%= build.dir %>/locale',
          expand: true
        }, {
          cwd: 'node_modules/moment/locale',
          src: '*.js',
          dest: '<%= build.dir %>/locale/moment',
          expand: true,
        }]
      },
      dist: {
        files: [{
          cwd: '<%= locale.dir %>',
          src: '<%= locale.json %>',
          dest: '<%= dist.dir %>/locale',
          expand: true
        }]
      },
    },

    uglify: {
      dist: {
        files: [{
          cwd: 'node_modules/moment/locale',
          src: '*.js',
          dest: '<%= dist.dir %>/locale/moment',
          expand: true,
        }]
      }
    },

    index: {
      build: {
        indexSrc: '<%= src.dir %>/index.html',
        indexDest: '<%= build.dir %>/index.html',
        src: [
          '<%= build.dir %>/**/*.css',
        ],
        remove: '<%= build.dir %>',
        url: [
          'app.js',
        ],
      },
      dist: {
        indexSrc: '<%= src.dir %>/index.html',
        indexDest: '<%= dist.dir %>/index.html',
        src: [
          '<%= dist.dir %>/**/*.css',
        ],
        remove: '<%= dist.dir %>/',
        url: [
          'app.js',
          'cordova.js',
        ],
      },
    },

    webpack: {
      options: webpackProductionConfig,
      dist: {
      },
    },

    'webpack-dev-server': {
      options: {
        webpack: webpackConfig,
        contentBase: './build',
        port: 8000,
        hot: true,
        historyApiFallback: true,
      },
      server: {
        keepAlive: true,
      }
    },

    less: {
      build: {
        options: {
          plugins: [
            new autoprefix({
              browsers: ['last 2 versions'],
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
              browsers: ['last 2 versions'],
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
      addExpense:{
        tests: ['test/feature/addExpense.js'],
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

  grunt.registerTask('build', [
    'jshint',
    'clean:build',
    'copy:build',
    'index:build',
    'webpack-dev-server:server',
  ]);

  grunt.registerTask('dist', [
    'jshint',
    'clean:dist',
    'copy:dist',
    'webpack:dist',
    'index:dist',
    'uglify:dist',
  ]);

  grunt.registerTask('default', ['build', 'dist']);
};
