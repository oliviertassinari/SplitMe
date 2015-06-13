'use strict';

var webpackConfig = require('./webpack.config.js');
var webpackProductionConfig = require('./webpack-production.config.js');

// Tasks runner
module.exports = function(grunt) {
  require('time-grunt')(grunt); // Display the elapsed execution time of grunt tasks
  require('jit-grunt')(grunt, { // Just In Time plugin loader for grunt
    'webpack-dev-server': 'grunt-webpack',
  });

  grunt.initConfig({
    src: {
      dir: 'src',
    },
    build: {
      dir: 'build'
    },
    dist: {
      dir: 'cordova/www'
    },
    test: {
      dir: 'test'
    },

    /**
     * The directories to delete.
     */
    clean: {
      dist: [
        '<%= dist.dir %>'
      ],
    },

    /**
     * `eslint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in `options`.
     */
    eslint: {
      src: {
        src: [
          '<%= src.dir %>/**/*.js',
          '<%= src.dir %>/**/*.jsx',
        ],
      },
      test: {
        src: [
          '<%= test.dir %>/**/*.js',
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

    webdriver: {
      options: {
        desiredCapabilities: {
          browserName: 'chrome'
        }
      },
      feature: {
        tests: ['<%= test.dir %>/feature/*.js'],
      },
      addExpense: {
        tests: ['<%= test.dir %>/feature/addExpense.js'],
      },
      deleteExpense: {
        tests: ['<%= test.dir %>/feature/deleteExpense.js'],
      },
      editExpense: {
        tests: ['<%= test.dir %>/feature/editExpense.js'],
      },
      detailAccount: {
        tests: ['<%= test.dir %>/feature/detailAccount.js'],
      },
    },
  });

  grunt.registerTask('build', [
    'eslint',
    'webpack-dev-server:server',
  ]);

  grunt.registerTask('dist', [
    'eslint',
    'clean:dist',
    'webpack:dist',
  ]);

  grunt.registerTask('default', ['build', 'dist']);
};
