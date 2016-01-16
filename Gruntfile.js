'use strict';

const webpackConfig = require('./webpack.config.js');

const PORT_DEV_WEBPACK = 8000;
const PORT_DEV_EXPRESS = 8080;

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

  let outputPath;

  if (config.platform === 'android') {
    outputPath = 'cordova/www';
  } else if (config.platform === 'browser') {
    outputPath = 'server/static';
  } else {
    outputPath = 'server/local';
  }

  grunt.initConfig({
    /**
     * The directories to delete.
     */
    clean: {
      release: [
        outputPath + '/**/*.*',
        '!*/.gitkeep',
      ],
    },

    /**
     * `eslint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in `options`.
     */
    eslint: {
      options: {
        fix: config.eslintFix || false,
      },
      src: {
        src: [
          'src/**/*.js',
          'src/**/*.jsx',
        ],
      },
      test: {
        src: [
          'test/**/*.js',
        ],
      },
      build: {
        src: [
          'Gruntfile.js',
          'webpack.config.js',
        ],
      },
    },

    'webpack-dev-server': {
      options: {
        webpack: webpackConfig({
          configName: configName,
          config: config,
          port: PORT_DEV_WEBPACK,
        }),
        contentBase: './server/public',
        port: PORT_DEV_WEBPACK,
        hot: true,
        historyApiFallback: true,
        proxy: {
          '*': `http://local.splitme.net:${PORT_DEV_EXPRESS}`,
        },
      },
      server: {
        keepAlive: true,
      },
    },

    webpack: {
      options: webpackConfig({
        configName: configName,
        config: config,
        outputPath: outputPath,
      }),
      release: {
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

  grunt.registerTask('development', [
    'eslint',
    'webpack-dev-server:server',
  ]);

  grunt.registerTask('release', [
    'eslint',
    'clean:release',
    'webpack:release',
  ]);

  grunt.registerTask('default', [
    'release',
  ]);
};
