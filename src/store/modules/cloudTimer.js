/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-26 17:37:54
 * @LastEditTime: 2022-10-14 11:17:51
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 */
import service from 'servicePath/index';
import Toast from 'vant/lib/toast';
import { combine, notifyError } from 'utilsPath';
import { sortTimers } from 'utilsPath/timer-util';

const { httpAsk } = service;
const timer = {
  namespaced: true,
  state: {
    timerList: [],
    timerInfo: {},
    status: null, // -1：请求中 0: 成功 1: 失败
  },
  mutations: {
    updateTimerList(state, payload) {
      state.timerList = Object.assign([], [...payload]);
    },
    updateTimerInfo(state, payload) {
      state.timerInfo = Object.assign({}, state.timerInfo, { ...payload });
    },
    updateStatus(state, payload) {
      state.status = payload;
    },
  },

  getters: {
    getTimerList: state => {
      // 查询普通定时,过滤掉睡眠定时
      const { timerList = [] } = state;
      const timers = timerList.filter(
        v => v.name.includes('timer_common') || !v.name
      );
      timers.forEach(v => {
        const { data = '{}' } = v;
        const dataJson = JSON.parse(data);
        const { controlInfo } = dataJson;
        const payload = controlInfo.directive;
        v.action = combine(payload.payload);
        const { weekdays } = v.timer;
        v.repeat =
          weekdays.split('').map(k => {
            const val = parseInt(k);
            return val >= 7 ? val - 7 : val;
          }) || [];
        v.repeat.sort();
        delete v.pushurl;
      });
      console.log('-----getTimerList-----', sortTimers(timers));
      // 已启用的排在上面，未启用的排在下面，按照时分升序排列
      return sortTimers(timers);
    },
  },

  actions: {
    // 查询定时
    query({ commit }, payload) {
      const params = {
        command: 'query',
        ...payload,
      };
      return httpAsk.cloudServices(params, params).then(result => {
        const { status, msg } = result;
        if (status === 0) {
          const { timerlist } = result.payload;
          commit('updateTimerList', timerlist);
        } else {
          Toast(msg);
        }

        return { status };
      });
    },
    // 添加 | 修改 定时
    upsert({ commit }, payload) {
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
      });
      const params = {
        command: 'upsert',
        payload,
      };
      return httpAsk.cloudServices(params).catch(e => {
        notifyError(e);
      });
    },
    // 删除定时
    del({ commit, rootState }, payload) {
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
      });
      const { deviceID } = rootState.app.deviceInfo;
      const params = {
        command: 'delete',
        endpointid: deviceID,
        payload,
      };
      return httpAsk.cloudServices(params).catch(e => {
        notifyError(e);
      });
    },
  },
};

export default timer;
