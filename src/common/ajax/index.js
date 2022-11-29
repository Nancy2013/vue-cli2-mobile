import {
  HTTP_METHOD,
  DEFAULT_REQ_METHOD,
  URL_DEFAULT_PREFIXER,
  IS_SERIALIZER_PARAMS,
  REQ_TIME_OUT,
} from 'commonPath/config';
import { paramsSerializer, isPlainObject } from 'commonPath/utils';
import axiosInstance from './axios';
import jsonp from './jsonp';
import { ajaxFulFilledHandle, ajaxRejectedHandle } from './ajaxErrorHandle';

function reqJSONP(url = '', params = {}, opts = {}) {
  return jsonp(url, params, opts).then(
    ({ data, options }) =>
      ajaxFulFilledHandle(data, { type: 'jsonp', options }),
    ajaxRejectedHandle
  );
}

// 设置请求token
function setAxiosCfg() {
  const auth = JSON.parse(sessionStorage.getItem('auth') || '{}');
  const { token, expired } = auth;
  return {
    paramsSerializer,
    timeout: REQ_TIME_OUT,
    headers: {
      interfaceVersion: '1',
      client: 'web',
      timestamp: '1' || `${new Date().getTime()}`,
      sign: '1',
      token,
    },
    validateStatus: status => true,
  };
}

export function getAxiosInstance() {
  return axiosInstance(setAxiosCfg());
}

export const AJAX = {
  get(url = '', params = {}, opts = {}) {
    return getAxiosInstance().get(url, {
      params,
      ...opts,
    });
  },
  post(url = '', params = {}, opts = {}) {
    return getAxiosInstance().post(url, params, {
      ...opts,
    });
  },
  jsonp(url, params, opts) {
    return reqJSONP(url, params, opts);
  },
};

const defaultPrefixer = URL_DEFAULT_PREFIXER;

/**
 * @param {String} path
 * @param {Object} opts
 * @prop {GET|POST} method - 请求类型
 * @prop {String} prefixer - url前缀
 * @prop {Boolean} isSerializerParams - 是否序列化提交数据
 */
export function reqHandle(
  path = '',
  {
    method = DEFAULT_REQ_METHOD,
    prefixer = defaultPrefixer,
    isSerializerParams = IS_SERIALIZER_PARAMS,
    ...props
  } = {
    method: DEFAULT_REQ_METHOD,
    prefixer: defaultPrefixer,
    isSerializerParams: IS_SERIALIZER_PARAMS,
  }
) {
  const reqPath = path.indexOf('/') === 0 ? path.slice(1) : path;
  const reqUrl = /http(s)?:\/\//.test(reqPath)
    ? reqPath
    : `${prefixer}/${reqPath}`;

  return params => {
    let reqParams = params;
    if (
      isSerializerParams &&
      method.toUpperCase() === HTTP_METHOD.POST &&
      (isPlainObject(reqParams) || Array.isArray(reqParams))
    ) {
      reqParams = paramsSerializer(reqParams);
    }
    console.log(JSON.stringify(reqParams));
    return AJAX[method.toLowerCase()](reqUrl, reqParams, {
      ...props,
    });
  };
}
