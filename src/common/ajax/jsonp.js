/*
 * @Author: your name
 * @Date: 2019-06-26 17:37:54
 * @LastEditTime: 2021-12-08 10:50:17
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue-cli2-mobile\src\common\ajax\jsonp.js
 */
import jsonp from 'jsonp';
import { REQ_TIME_OUT } from 'commonPath/config';
import { paramsSerializer } from 'commonPath/utils';

export default function JSONP(
  url = '',
  params = {},
  {
    jsonpName = false,
    jsonpCallback = false,
    timeout = REQ_TIME_OUT,
    cancelToken = null,
  } = {
    jsonpName: false,
    jsonpCallback: false,
    timeout: REQ_TIME_OUT,
    cancelToken: null,
  }
) {
  const config = {
    param: jsonpName,
    name: jsonpCallback,
    timeout,
  };

  const reqUrl = `${url}${
    url.indexOf('?') !== -1 ? '&' : '?'
  }${paramsSerializer(params)}`;

  return new Promise((resolve, reject) => {
    const cancel = jsonp(reqUrl, config, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ data, options: { url: reqUrl, config } });
    });

    // define cancel
    if (typeof cancelToken === 'function') {
      cancelToken(cancel);
    }
  });
}
