/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-03 09:46:19
 * @LastEditTime: 2021-12-13 14:22:08
 * @LastEditors: Please set LastEditors
 */
/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';
import '@babel/polyfill';
import App from './App';
import router from 'routerPath/index';
import store from 'storePath/index';
import i18n from 'localePath/index';
import 'stylesPath/style';
import global from 'commonPath/global';
import libs from './libs';

// px 转 vm
import viewportUnitsBuggyfill from 'viewport-units-buggyfill';
var hacks = require('viewport-units-buggyfill/viewport-units-buggyfill.hacks');
viewportUnitsBuggyfill.init({
  hacks,
});
libs(Vue);
Vue.use(Vuex);
Vue.prototype.GLOBAL = global; // 挂载到全局变量到Vue实例上面
new Vue({
  store,
  router,
  i18n,
  ...App,
}).$mount('#app');
