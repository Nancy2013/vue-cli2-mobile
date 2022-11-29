/*
 * @Author: your name
 * @Date: 2019-06-26 17:37:54
 * @LastEditTime: 2021-12-08 10:52:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-mobile-template\build\alias.js
 */
const path = require('path');
const { build } = require('../config');

const srcRoot = path.resolve(__dirname, '../src');

module.exports = () => ({
  vue$: build.vueModule,
  '@': srcRoot,
  configPath: '@/config',
  commonPath: '@/common',
  componentsPath: '@/components',
  filterPath: '@/filter',
  routerPath: '@/router',
  stylesPath: '@/assets',
  storePath: '@/store',
  viewsPath: '@/page',
  servicePath: '@/service',
  localePath: '@/locale',
  utilsPath: '@/utils',
});
