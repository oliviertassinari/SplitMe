// @flow weak

const path = require('path');

module.exports = {
  output: {
    // YOU NEED TO SET libraryTarget: 'commonjs2'
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.js', '.browser.js'],
    modules: [path.join(__dirname, 'src'), 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'image-webpack-loader',
        query: {
          svgo: {
            plugins: [
              {
                convertPathData: {
                  floatPrecision: 0,
                },
              },
            ],
          },
        },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },
};
