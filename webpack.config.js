import path from 'path';
import packageJson from './package.json';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import StatsPlugin from 'stats-webpack-plugin';
import UnusedFilesWebpackPlugin from 'unused-files-webpack-plugin';
import AssetsPlugin from 'assets-webpack-plugin';
import ServiceWorkerWepbackPlugin from 'serviceworker-webpack-plugin';
import autoprefixer from 'autoprefixer';

function getUnusedIgnorePlatform(platform) {
  const platformsToIgnore = [
    'android',
    'browser',
    'cordova',
    'server',
  ].filter((platformCurrent) => {
    return platformCurrent !== platform;
  });

  const ignorePaths = [];

  platformsToIgnore.forEach((platformCurrent) => {
    ignorePaths.push(`src/**/*.${platformCurrent}.js`);
  });

  return ignorePaths;
}

function getExtensionsWithPlatform(platform) {
  const newExtensions = [];

  if (platform === 'android' || platform === 'ios') {
    newExtensions.push('.cordova.js');
  }

  newExtensions.push(`.${platform}.js`);

  return newExtensions;
}

export default function(options) {
  const webpackConfig = {
    output: {
      path: options.outputPath,
      publicPath: '/',
      filename: '[name].[hash].js',
      sourceMapFilename: '[name].[hash].map.js',
      chunkFilename: '[id].chunk.[chunkhash].js',
    },
    entry: [
      './src/app',
    ],
    resolve: {
      extensions: getExtensionsWithPlatform(options.config.platform).concat(['', '.js']),
      root: path.join(__dirname, 'src'),
    },
    plugins: [
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
          test: /\.(jpe?g|png|gif|svg)$/,
          loader: 'image-webpack',
          query: {
            optimizationLevel: 7,
            pngquant: {
              quality: '65-90',
              speed: 4,
            },
            svgo: {
              plugins: [{
                convertPathData: {
                  floatPrecision: 0,
                },
              }],
            },
          },
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
        },
      ],
    },
    postcss: [
      autoprefixer({browsers: ['last 2 versions']}),
    ],
  };

  if (options.config.enableStats) {
    webpackConfig.profile = true;
    webpackConfig.plugins.push(new StatsPlugin('stats.json', {
      source: false,
      exclude: [/node_modules[\\\/]react/],
    }));
  }

  if (options.config.environment === 'development') {
    webpackConfig.devtool = 'eval';
    webpackConfig.module.loaders = webpackConfig.module.loaders.concat([
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
    ]);

    if (options.config.platform === 'browser') {
      const ip = require('ip');

      webpackConfig.output.filename = 'browser.js';
      webpackConfig.entry = [
        `webpack-dev-server/client?http://${ip.address()}:${options.port}`, // WebpackDevServer
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        './src/app',
      ];
      webpackConfig.plugins = webpackConfig.plugins.concat([
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new UnusedFilesWebpackPlugin({
          failOnUnused: false,
          pattern: 'src/**/*.*',
          globOptions: {
            ignore: [
              'src/**/*.test.js',
              'src/**/*.xcf',
              'src/server/**/*',
              'src/index.cordova.html',
              'src/index.cordova.js',
              'src/index.server.html',
              'src/modules/loadCSS/getLoadCSS.js',
            ].concat(getUnusedIgnorePlatform(options.config.platform)),
          },
        }),
      ]);
    }
  } else if (options.config.environment === 'production') {
    // webpackConfig.devtool = 'source-map'; // Needed for sentry
    webpackConfig.module.loaders = webpackConfig.module.loaders.concat([
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader!postcss-loader'
        ),
      },
    ]);
    webpackConfig.plugins = webpackConfig.plugins.concat([
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true,
          // unsafe: true,
          // unsafe_comps: true,
          // pure_getters: true,
        },
        output: {
          comments: false,
        },
      }),
      new ExtractTextPlugin('[name].[contenthash].css'),
    ]);

    if (options.config.platform === 'server') {
      webpackConfig.output.filename = 'server.js';

      Object.assign(webpackConfig, {
        devtool: 'inline-source-map',
        target: 'node',
        node: {
          __dirname: false,
        },
        entry: [
          './src/app.server',
        ],
        externals: {
          'express': 'commonjs express',
          'pouchdb': 'commonjs pouchdb',
          'uglify-js': 'commonjs uglify-js',
        },
        plugins: webpackConfig.plugins.concat([
          new webpack.BannerPlugin('require("source-map-support").install();',
            {
              raw: true,
              entryOnly: false,
            }),
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
