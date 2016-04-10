import path from 'path';
import packageJson from './package.json';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import StatsPlugin from 'stats-webpack-plugin';
import UnusedFilesWebpackPlugin from 'unused-files-webpack-plugin';
import AssetsPlugin from 'assets-webpack-plugin';

function getUnusedIgnorePlatform(ignorePaths, platform) {
  const platformsToIgnore = [
    'android',
    'browser',
    'server',
  ].filter((platformCurrent) => {
    return platformCurrent !== platform;
  });

  const newIgnorePaths = [];

  platformsToIgnore.forEach((platformCurrent) => {
    newIgnorePaths.push(`src/**/*.${platformCurrent}.js`);
  });

  return ignorePaths.concat(newIgnorePaths);
}

function getExtensionsWithPlatform(extensions, platform) {
  const newExtensions = [];

  extensions.forEach((extension) => {
    if (extension !== '') {
      newExtensions.push(`.${platform}${extension}`);
    }
  });

  return newExtensions.concat(extensions);
}

export default function(options) {
  const webpackConfig = {
    output: {
      path: options.outputPath,
      publicPath: '/',
      filename: '[name].[hash].js',
      chunkFilename: '[id].chunk.[chunkhash].js',
    },
    entry: [
      './src/app',
    ],
    resolve: {
      extensions: getExtensionsWithPlatform(['', '.js'], options.config.platform),
      root: path.join(__dirname, 'src'),
    },
    plugins: [
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
          loader: 'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          loader: 'image-webpack',
          query: {
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
          'autoprefixer-loader?{browsers:["last 2 versions"]}',
        ],
      },
    ]);

    if (options.config.platform === 'browser') {
      const ip = require('ip');

      webpackConfig.output.filename = 'browser.js';
      webpackConfig.entry = [
        `webpack-dev-server/client?http://${ip.address()}:${options.port}`, // WebpackDevServer
        'webpack/hot/only-dev-server',
        './src/app',
      ];
      webpackConfig.plugins = webpackConfig.plugins.concat([
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new UnusedFilesWebpackPlugin({
          failOnUnused: false,
          pattern: 'src/**/*.*',
          globOptions: {
            ignore: getUnusedIgnorePlatform([
              'src/**/*.test.js',
              'src/**/*.xcf',
              'src/server/**/*',
              'src/index.android.html',
              'src/index.android.js',
              'src/index.server.html',
              'src/sw.js',
              'src/serviceWorker.js',
            ], options.config.platform),
          },
        }),
      ]);
    }
  } else if (options.config.environment === 'production') {
    webpackConfig.devtool = null;
    webpackConfig.module.loaders = webpackConfig.module.loaders.concat([
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader!autoprefixer-loader?{browsers:["last 2 versions"]}'
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

  if (options.config.platform === 'android') {
    webpackConfig.output.publicPath = '';
    webpackConfig.plugins = webpackConfig.plugins.concat([
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src/index.android.js'),
        minify: {
          removeComments: true,
          collapseWhitespace: true,
        },

        // Custom properties
        config: options.config,
        version: packageJson.version,
      }),
    ]);
  }

  return webpackConfig;
}
