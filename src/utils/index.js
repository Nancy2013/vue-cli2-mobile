/*
 * @Author: your name
 * @Date: 2020-11-26 16:24:58
 * @LastEditTime: 2022-10-13 16:23:31
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: utils function
 * @FilePath: \curtain\src\panel\utils.js
 */
import Toast from 'vant/lib/toast';
import Dialog from 'vant/lib/dialog';
import CryptoJS from 'crypto-js';
import sdk from '@/broadlink-jssdk';
import getErrorString from './error-strings';
import { statusBarHeight, ratio } from './device';
/**
 * @description: 加载图片
 * @param {*}
 * @return {*} 图片的对象
 */
const importImgs = () => {
  const context = require.context(
    './../assets/images/',
    false,
    /\.(png|jpe?g|svg|gif)$/
  );
  const imgs = context.keys().reduce((items, key) => {
    const img = context(key);
    const name = key.replace(/(^\.\/|\.(png|jpe?g|svg|gif)$)/g, '');
    items[name] = img;
    return items;
  }, []);
  return imgs;
};

// 获取时间数组
const getTimeArray = (flag = 'h') => {
  let arr = [];
  if (flag === 'h') {
    arr = Array.from(Array(24), (item, index) => index);
  } else {
    arr = Array.from(Array(60), (item, index) => index);
  }

  return arr;
};

// 打开模态框前调用
const fixedBody = () => {
  const scrollTop =
    document.body.scrollTop || document.documentElement.scrollTop;
  document.body.style.cssText += `position:fixed;top:-${scrollTop}px;`;
};

// 关闭模态框后调用
const looseBody = () => {
  const { body } = document;
  body.style.position = 'static';
  const { top } = body.style;
  document.documentElement.scrollTop = -parseInt(top);
  document.body.scrollTop = document.documentElement.scrollTop;
  body.style.top = '';
};

// 判断图片类型
const isImage = url => {
  if (url) {
    const match = url.match(/\.(png|jpe?g|svg|gif)$/);
    return match;
  }
  return false;
};

// 判断视频类型
const isVideo = url => {
  if (url) {
    const match = url.match(/\.(mp4)$/);
    return match;
  }
  return false;
};

/*eslint-disable*/
const allSettled =
  Promise.allSettled ||
  (promises =>
    Promise.all(
      promises.map(p =>
        p
          .then(value => ({
            status: 'fulfilled',
            value,
          }))
          .catch(reason => ({
            status: 'rejected',
            reason,
          }))
      )
    ));

//  错误提示
const notifyError = (e, modal) => {
  const message =
    getErrorString(e.code) || e.msg || e.message || 'unknown error';

  if (modal) {
    Dialog.alert({ message });
  } else {
    const msg = `${e.code}: ${message}`;
    Toast(msg);
  }
  console.error(e);
};

// url转换
const parseUrl = url => {
  const pattern = /(\w+)=(\w+)/gi;
  const parames = {};
  url.replace(pattern, (match, ...arg) => {
    parames[arg[0]] = arg[1];
    return arg[1];
  });
  return parames;
};

const setCookies = key => {
  // 设置设备cookies
  const cookieObj = {
    aeskey: key || '',
    terminalid: 1,
  };
  const src = CryptoJS.enc.Utf8.parse(JSON.stringify(cookieObj));
  const base64string = CryptoJS.enc.Base64.stringify(src);
  return base64string;
};

const combine = function({ params = [], vals = [] }) {
  // 格式化上报
  if (Array.isArray(params) && Array.isArray(vals)) {
    const result = {};
    params.forEach(function(v, i) {
      result[v] = vals[i][0].val;
    });
    return result;
  } else {
    console.error('_combine error !');
    return {};
  }
};

const split = function(status = {}) {
  // 格式化下发
  const params = [],
    vals = [];

  let keys = Object.keys(status);
  for (let i = 0; i < keys.length; ++i) {
    params.push(keys[i]);
    vals.push([{ val: status[keys[i]], idx: 1 }]);
  }

  return { params, vals };
};

// 标准摄氏转华氏
const centigradeToFahrenheit = function(val) {
  let temp = val;
  if (Math.abs(val) >= 160) {
    temp = temp / 10;
  }
  const fah = (32 + temp * 1.8).toFixed(1);
  return (fah * 10) / 10;
};

// 标准华氏转摄氏
const fahrenheitToCentigrade = function(val) {
  let temp = val;
  if (Math.abs(val) >= 160) {
    temp = temp / 10;
  }
  let cen = ((temp - 32) / 1.8 || 0).toFixed(1);
  return (cen * 10) / 10;
};

// 随机消息
const randomMsg = function(key, id) {
  const msg = `${key}_${id}${Date.parse(new Date())}`;
  return msg;
};

/**
 * @description: 查询设备状态栏高度
 * @param {*} async
 * @return {*} 状态栏高度
 */
const getStatusBar = async () => {
  const { platformSDK } = sdk;
  const setting = await platformSDK.callNative('getSystemSettings');
  let height = 0;
  if (setting && setting.statusBarHeight > 0) {
    height = setting.statusBarHeight / ratio;
  }
  const statusBar = height || statusBarHeight;

  return statusBar;
};

export {
  importImgs,
  getTimeArray,
  fixedBody,
  looseBody,
  isImage,
  isVideo,
  allSettled,
  notifyError,
  parseUrl,
  setCookies,
  combine,
  split,
  centigradeToFahrenheit,
  fahrenheitToCentigrade,
  randomMsg,
  getStatusBar,
};
