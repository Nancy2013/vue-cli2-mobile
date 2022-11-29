/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-03 09:46:19
 * @LastEditTime: 2022-04-08 10:20:41
 * @LastEditors: Please set LastEditors
 */
/**
 * ajax 错误处理
 * @see 具体参数文档 - https://github.com/mzabriskie/axios#response-schema
 */
import { DEFAULT_ERR_MSG } from 'commonPath/config';
import Toast from 'vant/lib/toast';

export function ajaxFulFilledHandle(data = {}, config) {
  return new Promise((resolve, reject) => {
    console.log(data);
    const { status } = data;
    let errMsg = data.msg || DEFAULT_ERR_MSG;
    if (status === 0) {
      // 返回成功
      resolve(data);
    } else {
      if (errMsg.length > 100) {
        errMsg = `${errMsg.slice(0, 100)}...`;
      }
      Toast(errMsg);
      reject(data);
    }
  });
}

export function ajaxRejectedHandle(err) {
  console.error('ajax err', err);
  const { response = {} } = err;
  Toast(response.statusText || DEFAULT_ERR_MSG);
  return Promise.reject(err);
}
