/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-26 17:37:54
 * @LastEditTime: 2019-06-26 17:37:54
 * @LastEditors: your name
 */
import qs from 'qs';
import global from './global';

const { toString } = Object.prototype;

// ip检测
export function ipRegExp(ip = '') {
  const pattIpAndPort = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
  const pattIp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  return pattIp.test(ip) || pattIpAndPort.test(ip);
}

export function paramsSerializer(params = {}) {
  return qs.stringify(params, {
    arrayFormat: 'brackets'
  });
}

export function isPlainObject(obj) {
  return toString.call(obj) === '[object Object]';
}
