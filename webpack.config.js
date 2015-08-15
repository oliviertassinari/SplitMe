'use strict';

var path = require('path');
var packageJson = require('./package.json');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
      new webpack.NoErrorsPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src/index.html'),
        minify: {
          removeComments: true,
          collapseWhitespace: true,
        },

        // Custom properties
        environment: options.environment,
      }),
      new webpack.DefinePlugin({
        'cordova.platformId': JSON.stringify('browser'),
        VERSION: JSON.stringify(packageJson.version),
        'process.env': {
          NODE_ENV: JSON.stringify(options.environment),
        },
      }),
    ],
    module: {
      noParse: /lie\.js$|\/levelup\//,
    },
    devtool: (options.environment === 'development') ? 'eval' : null,
  };

  if (options.environment === 'development') {
    config.entry = [
      'webpack-dev-server/client?http://0.0.0.0:8000', // WebpackDevServer
      'webpack/hot/only-dev-server',
      './src/app.jsx',
    ];

    config.plugins = config.plugins.concat([
      new webpack.HotModuleReplacementPlugin(),
    ]);

    config.module.loaders = [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['react-hot-loader', 'babel-loader'],
      },
      {
        test: /\.less?$/,
        loaders: [
          'style-loader',
          'css-loader',
          'autoprefixer-loader?{browsers:["last 2 versions"]}',
          'less-loader',
        ],
      },
      {
        test: /\.woff?$/,
        loader: 'url-loader?limit=100000',
      },
    ];
  } else if (options.environment === 'production') {
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
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.less?$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader!autoprefixer-loader?{browsers:["last 2 versions"]}!less-loader'
        ),
      },
      {
        test: /\.woff?$/,
        loader: 'url-loader?limit=100000',
      },
    ];
  }

  return config;
};
