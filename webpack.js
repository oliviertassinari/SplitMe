import minimist from 'minimist';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import webpackConfig from './webpack.config';
import ProgressPlugin from 'webpack/lib/ProgressPlugin';
import rimraf from 'rimraf';

const PORT_DEV_WEBPACK = 8000;
const PORT_DEV_EXPRESS = 8080;

const argv = minimist(process.argv.slice(2));

let config;

try {
  config = require(`./config/${argv.config}`);
} catch (err) {
  config = {};
}

if (argv.dev === true) {
  const compiler = webpack(webpackConfig({
    configName: argv.config,
    config: config,
    port: PORT_DEV_WEBPACK,
    outputPath: __dirname,
  }));

  compiler.apply(new ProgressPlugin((percentage, msg) => {
    console.log(`${Math.floor(percentage * 100)}%`, msg);
  }));

  const server = new WebpackDevServer(compiler, {
    // webpack-dev-server options
    hot: true,
    historyApiFallback: true,

    // webpack-dev-middleware options
    quiet: false,
    noInfo: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
    stats: {
      modules: false,
      chunks: false,
      chunkModules: false,
      colors: true,
    },
    contentBase: './server/public',
    proxy: {
      '*': `http://local.splitme.net:${PORT_DEV_EXPRESS}`,
    },
  });

  server.listen(PORT_DEV_WEBPACK, undefined, () => {});
} else {
  let outputPath;

  if (config.platform === 'android') {
    outputPath = 'cordova/www';
  } else if (config.platform === 'browser') {
    outputPath = 'server/static';
  } else {
    outputPath = 'server/local';
  }

  rimraf.sync(`${outputPath}`);

  const compiler = webpack(webpackConfig({
    configName: argv.config,
    config: config,
    outputPath: outputPath,
  }));

  compiler.apply(new ProgressPlugin((percentage, msg) => {
    console.log(`${Math.floor(percentage * 100)}%`, msg);
  }));

  compiler.run((err, stats) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(stats.toString({
      colors: true,
      hash: false,
      timings: false,
      assets: true,
      chunks: false,
      chunkModules: false,
      modules: false,
      children: true,
    }));

    if (stats.hasErrors()) {
      process.exit(1);
    }
  });
}
