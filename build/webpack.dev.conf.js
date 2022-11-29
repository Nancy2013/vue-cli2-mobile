/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-27 09:23:59
 * @LastEditTime: 2022-06-27 14:20:29
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 */
'use strict';
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const appPackage = require('../package.json');
const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);
const { iotPlatform, supportCustomScene } = appPackage;
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true,
    }),
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: path.posix.join(config.dev.assetsPublicPath, 'index.html'),
        },
      ],
    },
    // inline: false,
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    disableHostCheck: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      platform: iotPlatform,
      chunks: ['app'],
    }),
    // copy custom static assets
    supportCustomScene &&
      iotPlatform === 'dna' &&
      new HtmlWebpackPlugin({
        filename: 'custom.html',
        template: 'index.html',
        inject: true,
        platform: iotPlatform,
        chunks: ['scene'],
      }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*'],
      },
    ]),
    new FriendlyErrorsPlugin(),
  ].filter(Boolean),
});
// module.exports = devWebpackConfig;
module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port;
      // add port to devServer config
      devWebpackConfig.devServer.port = port;
      /*   const url = `http://test.open-iot.tmall.com:${port}`;
      const listUrl = `https://ailabs-iot.aligenie.com/2364/1.0.3/dist/index.html#/?debugUrl=${url}`; */
      const listUrl = `http://localhost:${port}`;
      const messages = [
        `listUrl is running here: ${listUrl}`,
        `Your application is running here: ${listUrl}`,
      ];
      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages,
          },
          onErrors: config.dev.notifyOnErrors
            ? utils.createNotifierCallback()
            : undefined,
          clearConsole: false,
        })
      );
      devWebpackConfig.plugins.push(new OpenBrowserPlugin({ url: listUrl }));

      resolve(devWebpackConfig);
    }
  });
});
