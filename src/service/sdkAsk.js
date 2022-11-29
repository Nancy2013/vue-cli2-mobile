/*
 * @Description: SDK
 * @Author: your name
 * @Date: 2019-05-17 17:02:04
 * @LastEditTime: 2022-10-13 16:23:17
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 */
import sdk from '@/broadlink-jssdk';

const { platformSDK } = sdk;
export default {
  sdkReady: () => sdk.ready(), // SDK加载
  initSDK: () => platformSDK.callNative('init'), // SDK初始化
  hideNavbar: () => platformSDK.navbar.hide(), // 隐藏导航栏
  customNavbar: params => platformSDK.navbar.custom(params), // 设置导航栏
  getSystemSettings: () => platformSDK.callNative('getSystemSettings'), // 系统设置
  closeWebView: () => platformSDK.closeWebView(), // 关闭webview
  openDevicePropertyPage: () => platformSDK.openDevicePropertyPage(), // 设备属性界面
  getAppSettings: () => platformSDK.callNative('getAppSettings'), // 查询app设置
  getDeviceInfo: () => platformSDK.callNative('deviceinfo'), // 查询设备信息
  getUserInfo: () => platformSDK.callNative('getUserInfo'), // 查询用户信息
  getFamilyInfo: () => platformSDK.callNative('getFamilyInfo'), // 查询家庭信息
  getDeviceType: (deviceID, subDeviceID) => {
    // 查询设备类型及环境温度
    const [localTimeout, remoteTimeout, sendCount] = (() => {
      /*eslint-disable*/
      const profile = window.PROFILE || {};
      const [local, remote] = profile.timeout || [3, 5];
      return [local * 1000, remote * 1000, profile.sendcount || 3];
    })();
    //控制请求超时时间
    const time = {
      localTimeout: localTimeout, //本地超时时间
      remoteTimeout: remoteTimeout, //远程超时时间
      sendCount: sendCount, //请求个数
    };
    const command = 'dev_ctrl';
    const params = [
      deviceID,
      subDeviceID,
      {
        did: deviceID,
        srv: window.PROFILE.srvs,
        act: 'get',
        params: ['mode'],
        vals: [[{ val: 0, idx: 1 }]],
      },
      command,
      time,
    ];
    return platformSDK.callNative('devicecontrol', params);
  }, // 查询家庭信息
  cloudServices: params => {
    const {
      method = 'get',
      serviceName = 'timerservice',
      interfaceName = 'farm/product/v1/system/faultquery',
      httpBody,
      header,
      filePath,
    } = params;
    const payload = {
      method, // http 请求方法 目前支持get post multipart 文件上传
      serviceName, // dataservice 表示数据服务
      interfaceName, // 接口名称 (get时带上参数，并且需要将中文进行URLEncoder)
      httpBody: JSON.stringify(httpBody || {}), // httpbody参数为请求http body字符串
      filePath, // 需要上传的文件本地路径  如果method 为multipart，此字段不能为空
      header, // '{'countryCode':'1'}'附加网络头信息，key-value与网络头一一对应
    };
    return platformSDK.callNative('cloudServices', [payload]);
  },
  // 保存场景
  saveSceneCmds: params => {
    return platformSDK.callNative('saveSceneCmds', [params], 'BLIftttBridge');
  },
};
