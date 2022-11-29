/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-03 09:46:19
 * @LastEditTime: 2022-10-13 16:16:19
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 */
'use strict';
const path = require('path');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');
const getAlias = require('./alias');
const appPackage = require('../package.json');
function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay,
  },
});

const { iotPlatform, supportCustomScene } = appPackage;
const isRunOnDevServer = process.env.NODE_ENV !== 'production'; //是否在浏览器中运行

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: Object.assign(
    {},
    {
      app: './src/main.js',
    },
    supportCustomScene && iotPlatform === 'dna'
      ? {
          // 场景
          scene: './src/custom-scene/scene.js',
        }
      : undefined
  ),
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath:
      process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath,
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      ...getAlias(),
      // broadlink-jssdk
      // mock:  path.resolve(path.resolve(__dirname, '../src'), '.mock', iotPlatform)
      // npm:   path.resolve(require.resolve('broadlink-jssdk'), '../', iotPlatform)
      // local: path.resolve(path.resolve(__dirname, '../src'), 'broadlink-jssdk', iotPlatform)
      adapter: isRunOnDevServer
        ? path.resolve(path.resolve(__dirname, '../src'), '.mock', iotPlatform)
        : path.resolve(
            path.resolve(__dirname, '../src'),
            'broadlink-jssdk',
            iotPlatform
          ),
    },
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('test'),
          resolve('node_modules/webpack-dev-server/client'),
        ],
      },
      {
        test: /\.(js|mjs)$/,
        exclude: /@babel(?:\/|\\{1,2})runtime/,
        loader: require.resolve('babel-loader'),
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            'transform-vue-jsx',
            '@babel/plugin-proposal-class-properties',
          ],
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
          // name: 'static/img/[name].[hash:7].[ext]'
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[ext]'),
          // name: 'static/fonts/[name].[ext]'
        },
      },
    ],
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};
