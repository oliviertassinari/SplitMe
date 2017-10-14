// @flow weak

import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import StatsPlugin from 'stats-webpack-plugin';
import ForceCaseSensitivityPlugin from 'force-case-sensitivity-webpack-plugin';
import AssetsPlugin from 'assets-webpack-plugin';
import ServiceWorkerWepbackPlugin from 'serviceworker-webpack-plugin';
import autoprefixer from 'autoprefixer';
import packageJson from './package.json';

const ENABLE_STATS = false;

function getExtensionsWithPlatform(platform) {
  const newExtensions = [];

  if (platform === 'android' || platform === 'ios') {
    newExtensions.push('.cordova.js');
  }

  newExtensions.push(`.${platform}.js`);

  return newExtensions;
}

export default function(options) {
  let webpackConfig = {
    profile: false,
    devtool: '',
    output: {
      path: options.outputPath,
      publicPath: '/',
      pathinfo: false,
      filename: '[name].[hash].js',
      sourceMapFilename: '[name].[hash].map.js',
      chunkFilename: '[id].chunk.[chunkhash].js',
    },
    entry: ['./src/app'],
    resolve: {
      extensions: getExtensionsWithPlatform(options.config.platform).concat(['', '.js']),
      root: path.join(__dirname, 'src'),
    },
    plugins: [
      // Prevent naming issues.
      new ForceCaseSensitivityPlugin(),
      // Prevent moment from loading all the locales
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        'process.env.PLATFORM': JSON.stringify(options.config.platform),
        'process.env.CONFIG_NAME': JSON.stringify(options.configName),
        'process.env.VERSION': JSON.stringify(packageJson.version),
        'process.env.NODE_ENV': JSON.stringify(options.config.environment),
      }),
    ],
    module: {
      // Needed for the nano dependency with server side
      noParse: /node_modules\/json-schema\/lib\/validate\.js/,
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules\/(?!material-ui)/,
          query: {
            cacheDirectory: false,
          },
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
        },
        {
          test: /\.woff$/,
          loader: 'url-loader?limit=100000',
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          loader: 'file-loader', // Hash name by default
        },
        {
          test: /\.svg$/,
          loader: 'image-webpack-loader',
          query: {
            svgo: {
              plugins: [
                {
                  convertPathData: {
                    floatPrecision: 2,
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
    postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
  };

  // http://chrisbateman.github.io/webpack-visualizer/
  // https://webpack.github.io/analyse/
  if (ENABLE_STATS) {
    webpackConfig.profile = true;
    webpackConfig.plugins.push(
      new StatsPlugin('stats.json', {
        source: false,
      }),
    );
  }

  if (options.config.environment === 'development') {
    // * filename */ comments to generated require()s in the output.
    webpackConfig.output.pathinfo = true;

    webpackConfig.devtool = 'eval';
    webpackConfig.module.loaders = webpackConfig.module.loaders.concat([
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ]);

    if (options.config.platform === 'browser') {
      const ip = require('ip');

      webpackConfig.output.filename = 'browser.js';
      webpackConfig.entry = [
        'react-hot-loader/patch',
        `webpack-dev-server/client?http://${ip.address()}:${options.port}`, // WebpackDevServer
        'webpack/hot/only-dev-server',
        './src/app',
      ];
      webpackConfig.plugins = webpackConfig.plugins.concat([
        new webpack.HotModuleReplacementPlugin(),
      ]);
    }
  } else if (options.config.environment === 'production') {
    // webpackConfig.devtool = 'source-map'; // Needed for sentry
    webpackConfig.module.loaders = webpackConfig.module.loaders.concat([
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader'),
      },
    ]);
    webpackConfig.plugins = webpackConfig.plugins.concat([
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true,
        },
        output: {
          comments: false,
        },
      }),
      new ExtractTextPlugin('[name].[contenthash].css'),
    ]);

    if (options.config.platform === 'server') {
      webpackConfig.output.filename = 'server.js';

      webpackConfig = Object.assign({}, webpackConfig, {
        devtool: 'inline-source-map',
        target: 'node',
        node: {
          __dirname: false,
        },
        entry: ['./src/app.server'],
        externals: {
          express: 'commonjs express',
          'uglify-js': 'commonjs uglify-js',
          bindings: true,
        },
        plugins: webpackConfig.plugins.concat([
          new webpack.BannerPlugin('require("source-map-support").install();', {
            raw: true,
            entryOnly: false,
          }),
          new webpack.ContextReplacementPlugin(/bindings$/, /^$/),
        ]),
      });
    } else if (options.config.platform === 'browser') {
      webpackConfig.plugins = webpackConfig.plugins.concat([
        new AssetsPlugin({
          filename: `${options.outputPath}/assets.json`,
          prettyPrint: true,
        }),
      ]);
    }
  }

  if (options.config.platform === 'android' || options.config.platform === 'ios') {
    webpackConfig.output.publicPath = '';
    webpackConfig.plugins = webpackConfig.plugins.concat([
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src/index.cordova.js'),
        minify: {
          removeComments: true,
          collapseWhitespace: true,
        },
        inject: false,
      }),
    ]);
  }

  if (options.config.platform === 'browser') {
    webpackConfig.plugins = webpackConfig.plugins.concat([
      new ServiceWorkerWepbackPlugin({
        entry: path.join(__dirname, 'src/sw.js'),
        publicPath: '/',
        relativePaths: false,
      }),
    ]);
  }

  return webpackConfig;
}
