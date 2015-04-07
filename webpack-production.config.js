'use strict';

var path = require('path');
var webpack = require('webpack');

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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['jsx-loader?harmony'],
      }, {
        test: /\.less?$/,
        loaders: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  }
};
