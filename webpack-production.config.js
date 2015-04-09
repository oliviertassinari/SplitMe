'use strict';

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './src/app.jsx'
  ],
  output: {
    path: path.join(__dirname, 'cordova/www'),
    filename: 'app.js',
  },
  resolve: {
    extensions: [
      '',
      '.js',
      '.jsx',
    ],
    packageMains: ['webpack', 'browser', 'web', 'browserify', 'main'], // remove jam from default
  },
  plugins: [
    new ExtractTextPlugin('app.css'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
      output: {
        comments: false,
      },
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['jsx-loader?harmony'],
      }, {
        test: /\.less?$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader'),
      }, {
        test: /\.woff?$/,
        loaders: ['url-loader?limit=100000'],
      },
    ],
  }
};
