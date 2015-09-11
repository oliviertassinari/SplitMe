'use strict';

const webpackConfig = require('./webpack.config.js');

// Tasks runner
module.exports = function(grunt) {
  require('time-grunt')(grunt); // Display the elapsed execution time of grunt tasks
  require('jit-grunt')(grunt, { // Just In Time plugin loader for grunt
    'webpack-dev-server': 'grunt-webpack',
  });

  const configName = grunt.option('config');
  let config;

  try {
    config = require('./config/' + configName);
  } catch (err) {
    config = {};
  }

  grunt.initConfig({
    src: {
      dir: 'src',
    },
    build: {
      dir: 'build',
    },
    dist: {
      dir: 'cordova/www',
    },
    test: {
      dir: 'test',
    },

    /**
     * The directories to delete.
     */
    clean: {
      dist: [
        '<%= dist.dir %>',
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
      build: {
        src: ['Gruntfile.js', 'webpack.config.js'],
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
        },
      },
    },

    webpack: {
      options: webpackConfig({
        configName: configName,
        config: config,
      }),
      dist: {
      },
    },

    'webpack-dev-server': {
      options: {
        webpack: webpackConfig({
          configName: configName,
          config: config,
        }),
        contentBase: './build',
        port: 8000,
        hot: true,
        historyApiFallback: true,
      },
      server: {
        keepAlive: true,
      },
    },

    webdriver: {
      options: {
        desiredCapabilities: {
          browserName: 'chrome',
        },
      },
      feature: {
        configFile: './webdriver.config.js',
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

  grunt.registerTask('default', [
    'dist',
  ]);
};
