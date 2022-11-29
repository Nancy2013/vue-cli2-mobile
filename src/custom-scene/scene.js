/*
 * @Description: 场景设置
 * @Author: your name
 * @Date: 2019-07-03 09:46:19
 * @LastEditTime: 2022-06-17 14:10:55
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 */
/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';
import '@babel/polyfill';
import Scene from './Scene.vue';
// import router from '@/custom-scene/router/index';
import store from '@/custom-scene/store/index';
import i18n from 'localePath/index';
import 'stylesPath/style';
import global from 'commonPath/global';
import libs from '@/libs';

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
  // router,
  i18n,
  ...Scene,
}).$mount('#app');
