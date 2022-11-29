/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-03 09:46:19
 * @LastEditTime: 2019-10-18 14:47:12
 * @LastEditors: Please set LastEditors
 */
import axios from 'axios';
import Toast from 'vant/lib/toast';
import global from 'commonPath/global';
import { REQ_TIME_OUT } from 'configPath/index';
import { paramsSerializer } from 'commonPath/utils';

import {
  ajaxFulFilledHandle,
  ajaxRejectedHandle
} from './ajaxErrorHandle';

let axiosInstance;

// 创建axiso实例
export function createAxiosInstance(config) {
  axiosInstance = axios.create(config);
  const reqInterceptors = [];

const rspInterceptors = [{
  // 错误处理
  fulfilled: rsp => ajaxFulFilledHandle(rsp.data, { type: 'ajax', options: { rsp } }),
  rejected: ajaxRejectedHandle
}];


  function addInterceports(interceptors = [], type = 'request') {
    interceptors.forEach(interceptor => axiosInstance.interceptors[type]
      .use(interceptor.fulfilled, interceptor.rejected));
}

addInterceports(reqInterceptors, 'request');
addInterceports(rspInterceptors, 'response');
  return axiosInstance;
}


export default createAxiosInstance;
