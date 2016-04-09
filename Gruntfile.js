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
    config = require(`./config/${configName}`);
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
        `${outputPath}/**/*.*`,
        '!*/.gitkeep',
      ],
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

  });

  grunt.registerTask('development', [
    'webpack-dev-server:server',
  ]);

  grunt.registerTask('release', [
    'clean:release',
    'webpack:release',
  ]);
};
