// @flow weak
/* eslint-disable no-console */

import minimist from 'minimist';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import fse from 'fs-extra';
import ProgressPlugin from 'webpack/lib/ProgressPlugin';
import webpackConfig from './webpack.config';

const PORT_DEV_WEBPACK = 8000;
const PORT_DEV_EXPRESS = 8080;

const argv = minimist(process.argv.slice(2));

let config;

try {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  config = require(`./config/${argv.config}`);
} catch (err) {
  config = {
    platform: '',
  };
}

if (argv.dev === true) {
  const compiler = webpack(
    webpackConfig({
      configName: argv.config,
      config,
      port: PORT_DEV_WEBPACK,
      outputPath: __dirname,
    }),
  );

  compiler.apply(
    new ProgressPlugin((percentage, msg) => {
      console.log(`${Math.floor(percentage * 100)}%`, msg);
    }),
  );

  const server = new WebpackDevServer(compiler, {
    // webpack-dev-server options
    hot: true,
    historyApiFallback: true,

    // webpack-dev-middleware options
    stats: {
      // Remove built modules information.
      modules: false,
      // Remove built modules information to chunk information.
      chunkModules: false,
      colors: true,
    },
    disableHostCheck: true, // For security checks, no need here.
    contentBase: './server/public',
    proxy: {
      '**': `http://local.splitme.net:${PORT_DEV_EXPRESS}`,
    },
  });

  server.listen(PORT_DEV_WEBPACK, undefined, () => {});
} else {
  let outputPath;

  if (config.platform === 'android' || config.platform === 'ios') {
    outputPath = 'cordova/www';
  } else if (config.platform === 'browser') {
    outputPath = 'server/static';
  } else {
    outputPath = 'server/local';
  }

  fse.emptyDirSync(`${outputPath}`);

  const compiler = webpack(
    webpackConfig({
      configName: argv.config,
      config,
      outputPath,
    }),
  );

  compiler.apply(
    new ProgressPlugin((percentage, msg) => {
      console.log(`${Math.floor(percentage * 100)}%`, msg);
    }),
  );

  compiler.run((err, stats) => {
    if (err) {
      throw new Error(err);
    }

    console.log(
      stats.toString({
        colors: true,
        hash: false,
        timings: false,
        assets: true,
        chunks: false,
        chunkModules: false,
        modules: false,
        children: true,
      }),
    );

    if (stats.hasErrors()) {
      throw new Error('Webpack failed');
    }

    if (config.platform === 'browser') {
      fse.copySync(`${outputPath}/sw.js`, 'server/public/sw.js');
    }
  });
}
