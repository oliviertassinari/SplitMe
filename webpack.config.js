'use strict';

var path = require('path');
var packageJson = require('./package.json');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StatsPlugin = require('stats-webpack-plugin');
var UnusedFilesWebpackPlugin = require('unused-files-webpack-plugin');

module.exports = function(options) {
  var config = {
    output: {
      path: path.join(__dirname, 'cordova/www'), // No used by webpack dev server
      publicPath: '',
      filename: 'app.js',
    },
    resolve: {
      extensions: ['', '.js', '.jsx'],
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
        CONFIG_NAME: JSON.stringify(options.configName),
        'cordova.platformId': JSON.stringify(options.config.platform), // Fix for facebook cordova
        VERSION: JSON.stringify(packageJson.version),
        'process.env': {
          NODE_ENV: JSON.stringify(options.config.environment),
        },
      }),
    ],
    module: {
      noParse: /lie\.js$|\/levelup\//,
    },
    devtool: (options.config.environment === 'development') ? 'eval' : null,
  };

  if (options.config.enableStats) {
    config.profile = true;
    config.plugins.push(new StatsPlugin('stats.json', {
      chunkModules: true,
      exclude: [/node_modules[\\\/]react/],
    }));
  }

  if (options.config.environment === 'development') {
    var ip = require('ip');

    config.entry = [
      'webpack-dev-server/client?http://' + ip.address() + ':8000', // WebpackDevServer
      'webpack/hot/only-dev-server',
      './src/app.jsx',
    ];

    config.plugins = config.plugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new UnusedFilesWebpackPlugin({
        pattern: 'src/**/*.*',
        globOptions: {
          ignore: [
            'src/**/*.test.js',
          ],
        },
      }),
    ]);

    config.module.loaders = [
      {
        test: /\.(js|jsx)$/,
        loader: 'react-hot-loader',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
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
    config.entry = [
      './src/app.jsx',
    ];

    config.plugins = config.plugins.concat([
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

    config.module.loaders = [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
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

  return config;
};
