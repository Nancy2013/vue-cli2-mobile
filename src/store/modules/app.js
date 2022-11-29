/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-26 17:37:54
 * @LastEditTime: 2022-06-17 14:45:31
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 */
import service from 'servicePath/index';
import Toast from 'vant/lib/toast';
import { statusBarHeight, ratio } from 'utilsPath/device';
import { notifyError } from 'utilsPath';
import { control, ready, getState, updateDefaultControlOpts } from '@/logic';

const { sdkAsk } = service;
const app = {
  namespaced: true,
  state: {
    userInfo: {},
    familyInfo: {},
    deviceInfo: {},
    statusBarHeight: 0,
    deviceStatus: {
      name: 'mock device',
      online: 0,
      status: {},
    },
    ready: false,
  },

  mutations: {
    updateUserInfo(state, payload) {
      state.userInfo = Object.assign({}, state.userInfo, { ...payload });
    },
    updateDeviceInfo(state, payload) {
      state.deviceInfo = Object.assign({}, state.deviceInfo, { ...payload });
    },
    updateDeviceStatus(state, payload) {
      state.deviceStatus = Object.assign({}, state.deviceStatus, {
        ...payload,
      });
    },
    updateStatusBarHeight(state, payload) {
      state.statusBarHeight = payload;
    },
    updateReady(state, payload) {
      state.ready = payload;
    },
  },

  getters: {
    status: state => state.deviceStatus.status,
    online: state => {
      // 0/1/2/3 // 设备状态未知/本地/远程/离线
      const online = state.deviceStatus.online !== '3';
      return online;
    },
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
        .then(result => {
          console.log('【sdkReady】', JSON.stringify(result));
          commit('updateDeviceStatus', { ...result, status: {} });
          dispatch('getDeviceStatus');
          return result;
        })
        .catch(e => notifyError(e));
    },
    initSDK() {
      return sdkAsk
        .initSDK()
        .then(result => result)
        .catch(e => notifyError(e));
    },

    // 查询设备信息
    getDeviceInfo({ commit, state }) {
      return sdkAsk
        .getDeviceInfo()
        .then(result => {
          const deviceInfo = result;
          commit('updateDeviceInfo', deviceInfo);
        })
        .catch(e => notifyError(e));
    },
    // 查询用户信息
    getUserInfo({ commit, state }) {
      sdkAsk
        .getUserInfo()
        .then(result => {
          const userInfo = result;
          commit('updateUserInfo', userInfo);
        })
        .catch(e => notifyError(e));
    },
    // 查询家庭信息
    getFamilyInfo({ commit, state }) {
      sdkAsk
        .getFamilyInfo()
        .then(result => {
          const userInfo = result;
          commit('updateFamilyInfo', userInfo);
        })
        .catch(e => notifyError(e));
    },
    // 获得导航栏高度
    getStatusBar({ commit }) {
      sdkAsk
        .getSystemSettings()
        .then(result => {
          const setting = result;
          let height = 0;
          if (setting && setting.statusBarHeight > 0) {
            height = setting.statusBarHeight / ratio;
          }
          const statusBar = height || statusBarHeight;
          commit('updateStatusBarHeight', statusBar);
        })
        .catch(e => notifyError(e));
    },

    /**
     * 获取设备状态
     */
    getDeviceStatus({ commit }) {
      const updateStatus = () => {
        const state = getState();
        commit('updateDeviceStatus', state);
      };
      updateDefaultControlOpts({
        updateStrategy: 'immediate',
        // execDelayTimeout: 200,
      });
      ready(updateStatus)
        .then(res => {
          console.log('-----getDeviceStatus-----', res);
          commit('updateReady', true);
        })
        .catch(e => notifyError(e));
    },

    // 控制设备
    control({ state, commit, getters }, params) {
      // dna设备离线状态
      if (!getters.online) {
        Toast('设备不在线');
        return;
      }
      const clearId = setTimeout(() => {
        // 500ms内控制成功不显示loading
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: 'spinner',
        });
      }, 500);
      // 设置数据
      control(params)
        .then(res => {
          Toast.clear();
          console.log('setDeviceStatus：', res);
        })
        .catch(e => {
          notifyError(e);
        })
        .finally(() => {
          if (clearId) {
            clearTimeout(clearId);
          }
        });
    },
  },
};

export default app;
