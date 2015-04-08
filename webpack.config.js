'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8000', // WebpackDevServer
    'webpack/hot/only-dev-server',
    './src/app.jsx',
  ],
  output: {
    path: path.join(__dirname, 'build'),
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
        NODE_ENV: JSON.stringify('development'),
      }
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['react-hot-loader', 'jsx-loader?harmony'],
      }, {
        test: /\.less?$/,
        loaders: ['style-loader', 'css-loader', 'less-loader'],
      }, {
        test: /\.woff?$/,
        loaders: ['url-loader?limit=100000'],
      },
    ],
  }
};
