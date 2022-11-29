/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-26 17:37:54
 * @LastEditTime: 2022-06-28 10:09:32
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 */
import service from 'servicePath/index';
import Toast from 'vant/lib/toast';
import { notifyError, parseUrl, split, combine } from 'utilsPath';
import config from 'configPath';
import i18n from 'localePath/index';

const { sdkAsk } = service;
const { setModel } = config;
const scene = {
  namespaced: true,
  state: {
    statusBarHeight: 0,
    deviceInfo: {},
    deviceStatus: {
      name: 'scene status',
      online: '2',
      status: {
        pwr: 1,
        temp: 260,
        ac_mark: 1,
        ac_mode: 1,
        ac_hdir: 1,
        ac_vdir: 0,
        ecomode: 0,
        scrdisp: 0,
      },
    },
  },

  mutations: {
    updateDeviceInfo(state, payload) {
      state.deviceInfo = Object.assign({}, state.deviceInfo, { ...payload });
    },
    updateDeviceStatus(state, payload) {
      const { deviceStatus } = state;
      const { status } = deviceStatus;
      state.deviceStatus = Object.assign({}, state.deviceStatus, {
        ...deviceStatus,
        status: {
          ...status,
          ...payload,
        },
      });
    },
  },

  getters: {
    status: state => state.deviceStatus.status,
  },

  actions: {
    // 加载sdk
    sdkReady({ commit, dispatch }) {
      Toast.loading({
        mask: true,
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
      });
      return sdkAsk
        .sdkReady()
        .then(async result => {
          console.log('【sdkReady】', JSON.stringify(result));
          const { data } = parseUrl(window.location.href);
          if (data) {
            // 初始化状态
            const cmd = JSON.parse(data).cmdParamList || [];
            const { params, vals } = cmd[0];
            const status = combine({ params, vals });
            commit('updateDeviceStatus', status);
          }
          await dispatch('getDeviceInfo');
          Toast.clear();
          return result;
        })
        .catch(e => notifyError(e));
    },

    // 查询设备信息
    getDeviceInfo({ commit, state }) {
      return sdkAsk
        .getDeviceInfo()
        .then(result => {
          const deviceInfo = result;
          commit('updateDeviceInfo', deviceInfo);
          if (!localStorage.getItem('model')) {
            const { productID } = deviceInfo;
            console.log('------productID-----', deviceInfo);
            // setModel(productID);
          }
        })
        .catch(e => notifyError(e));
    },

    // 控制设备
    control({ state, commit }, params) {
      commit('updateDeviceStatus', { ...params });
    },
    // 保存场景
    saveScene({ state, commit }, params) {
      const command = {
        act: 'set',
        ...split(params),
      };
      const desc = '';
      Object.keys(params).forEach(key => {});
      const sceneCmd = {
        cmdParamList: [command],
        name: desc,
      };
      console.log('-----saveScene-----', sceneCmd);
      sdkAsk
        .saveSceneCmds(sceneCmd)
        .then(result => {
          const { status } = result;
          if (status === 0) {
            sdkAsk.closeWebView();
          }
        })
        .catch(e => notifyError(e));
    },
  },
};

export default scene;
