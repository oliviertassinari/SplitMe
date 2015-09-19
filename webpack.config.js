'use strict';

const path = require('path');
const packageJson = require('./package.json');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const UnusedFilesWebpackPlugin = require('unused-files-webpack-plugin');

function getUnusedIgnorePlatform(ignorePaths, platform) {
  const platformsToIgnore = [
    'browser',
    'android',
  ].filter(function(platformCurrent) {
    return platformCurrent !== platform;
  });

  const newIgnorePaths = [];

  platformsToIgnore.forEach(function(platformCurrent) {
    newIgnorePaths.push('src/**/*.' + platformCurrent + '.js');
    newIgnorePaths.push('src/**/*.' + platformCurrent + '.jsx');
  });

  return ignorePaths.concat(newIgnorePaths);
};

function getExtensionsWithPlatform(extensions, platform) {
  const newExtensions = [];

  extensions.forEach(function(extension) {
    if (extension !== '') {
      newExtensions.push('.' + platform + extension);
    }
  });

  return newExtensions.concat(extensions);
}

module.exports = function(options) {
  const webpackConfig = {
    output: {
      path: path.join(__dirname, 'cordova/www'), // No used by webpack dev server
      publicPath: '',
      filename: 'app.js',
    },
    externals: [
      'cordova/exec',
    ],
    resolve: {
      extensions: getExtensionsWithPlatform(['', '.js', '.jsx'], options.config.platform),
      alias: {
        'facebookConnectPlugin': path.join(__dirname,
          'cordova/plugins/com.phonegap.plugins.facebookconnect/facebookConnectPlugin.js'),
      },
      root: path.join(__dirname, 'src'),
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src/index.html'),
        minify: {
          removeComments: true,
          collapseWhitespace: true,
        },

        // Custom properties
        platform: options.config.platform,
      }),
      new webpack.DefinePlugin({
        PLATFORM: JSON.stringify(options.config.platform),
        CONFIG_NAME: JSON.stringify(options.configName),
        'cordova.platformId': JSON.stringify(options.config.platform), // Fix for facebook cordova
        VERSION: JSON.stringify(packageJson.version),
        'process.env': {
          NODE_ENV: JSON.stringify(options.config.environment),
        },
      }),
    ],
    module: {
      noParse: /lie\.js$|\/levelup\//, // pouchdb
    },
    devtool: (options.config.environment === 'development') ? 'eval' : null,
  };

  if (options.config.enableStats) {
    webpackConfig.profile = true;
    webpackConfig.plugins.push(new StatsPlugin('stats.json', {
      chunkModules: true,
      exclude: [/node_modules[\\\/]react/],
    }));
  }

  if (options.config.environment === 'development') {
    const ip = require('ip');

    webpackConfig.entry = [
      'webpack-dev-server/client?http://' + ip.address() + ':8000', // WebpackDevServer
      'webpack/hot/only-dev-server',
      './src/app.jsx',
    ];

    webpackConfig.plugins = webpackConfig.plugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new UnusedFilesWebpackPlugin({
        failOnUnused: options.config.failOnUnusedFile,
        pattern: 'src/**/*.*',
        globOptions: {
          ignore: getUnusedIgnorePlatform([
            'src/**/*.test.js',
          ], options.config.platform),
        },
      }),
    ]);

    webpackConfig.module.loaders = [
      {
        test: /\.(js|jsx)$/,
        loader: 'react-hot-loader',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          optional: ['runtime'],
        },
      },
      {
        test: /\.less$/,
        loaders: [
          'style-loader',
          'css-loader',
          'autoprefixer-loader?{browsers:["last 2 versions"]}',
          'less-loader',
        ],
      },
      {
        test: /\.woff$/,
        loader: 'url-loader?limit=100000',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ];
  } else if (options.config.environment === 'production') {
    webpackConfig.entry = [
      './src/app.jsx',
    ];

    webpackConfig.plugins = webpackConfig.plugins.concat([
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false,
        },
        output: {
          comments: false,
        },
      }),
      new ExtractTextPlugin('app.css'),
    ]);

    webpackConfig.module.loaders = [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          optional: ['runtime'],
        },
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader!autoprefixer-loader?{browsers:["last 2 versions"]}!less-loader'
        ),
      },
      {
        test: /\.woff$/,
        loader: 'url-loader?limit=100000',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ];
  }

  return webpackConfig;
};
