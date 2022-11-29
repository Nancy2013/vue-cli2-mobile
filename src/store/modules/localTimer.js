/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-26 17:37:54
 * @LastEditTime: 2022-10-14 16:26:57
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 */
import Toast from 'vant/lib/toast';
import { combine, notifyError } from 'utilsPath';
import { sortTimers } from 'utilsPath/timer-util';
import sdk from '@/broadlink-jssdk';
import { loadTimers, timerAdd, timerDelete } from '@/logic-timer';

const { TYPE_COMMON, TYPE_PERIOD, TYPE_CYCLE, TYPE_DELAY, Timer } =
  sdk.platformSDK.taskV2 || {};
const localTimer = {
  namespaced: true,
  state: {
    timer: {
      idList: null,
      isFetching: false,
      total: null,
      lastUpdateTime: null,
      error: null,
      limits: null,
    },
    entities: {
      timer: {
        byId: {},
      },
    },
    timerInfo: {
      timers: { [TYPE_DELAY]: new Timer(TYPE_DELAY) },
    },
  },
  mutations: {
    updateTimer(state, payload) {
      state.timer = Object.assign({}, [...payload]);
    },
    updateEntities(state, payload) {
      state.entities = Object.assign({}, [...payload]);
    },
    updateTimerInfo(state, payload) {
      const { time, ...rest } = payload;
      const { timers, type } = state.timerInfo;
      const currentTimer = timers[type].clone();
      Object.assign(currentTimer, rest);
      Object.assign(currentTimer.time, time);
      timers[type] = currentTimer;
      state.timerInfo = Object.assign({}, state.timerInfo, { timers });
    },
  },

  getters: {
    getTimerList: state => {
      console.log('-----getTimerList-----', sortTimers(state.timer));
      // 已启用的排在上面，未启用的排在下面，按照时分升序排列
      return sortTimers(state.timer);
    },
  },

  actions: {
    // 查询定时
    query({ commit, state, rootState }, payload) {
      // keepTrying,如果报错是否一直重试
      // clear,获取前是否重置当前定时列表
      // did
      const { clear } = payload;
      if (clear) {
        const timer = {
          ...state.timer,
          idList: null,
          isFetching: true,
          error: null,
        };
        commit('updateTimer', timer);
      }
      const { deviceID } = rootState.app.deviceInfo;
      const params = {
        ...payload,
        did: deviceID,
      };
      return loadTimers(params)
        .then(result => {
          // 合并定时
          const mergeTimers = (idList, ...timers) => {
            const ids = idList ? [...idList] : [];
            timers.forEach(timer => {
              const { uuid, type } = timer;
              if (type === TYPE_DELAY) {
                ids.push(uuid);
              }
            });
            return ids;
          };

          const addTimers = (byId, data) => {
            const { list = [], append } = data;
            const timers = list.reduce((accumulator, current) => {
              accumulator[current.uuid] = current;
              return accumulator;
            }, {});
            return append ? { ...byId, timers } : timers;
          };

          const { list, append, limits, total } = result;
          const timer = {
            ...state.timer,
            idList: mergeTimers(append ? state.timer.idList : [], ...list),
            limits,
            lastUpdateTime: new Date().getTime(),
            total,
            isFetching: false,
            error: null,
          };
          commit('updateTimer', timer);

          const entities = {
            ...state.entities,
            timer: {
              ...state.entities.timer,
              byId: addTimers(state.entities.timer.byId, result),
            },
          };

          commit('updateEntities', entities);
        })
        .catch(e => {
          const timer = {
            ...state.timer,
            isFetching: false,
          };
          commit('updateTimer', timer);
          console.error(e);
        });
    },
    // 添加 | 修改定时
    add({ commit, state, rootState }, payload) {
      // timer 待添加的定时
      // did
      // callback
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
      });
      const { deviceID } = rootState.app.deviceInfo;
      const params = {
        ...payload,
        did: deviceID,
      };
      return timerAdd(params)
        .then(result => {
          const modifyUsedNumber = (limit, offset) => {
            const newLimit = [...limit];
            newLimit[2] = limit[2] + offset;
            return newLimit;
          };
          const { timer } = result;
          const { uuid, type } = timer;
          const { idList = [], limits = {} } = state.timer;
          idList.push(uuid);
          const newLimits = modifyUsedNumber(limits[type], 1); // 已经使用的数组加一
          commit('updateTimer', {
            ...state.timer,
            idList,
            limits: newLimits,
          });

          const { byId } = state.entities.timer;
          byId[uuid] = timer;
          const entities = {
            ...state.entities,
            timer: {
              ...state.entities.timer,
              byId,
            },
          };
          commit('updateEntities', entities);
        })
        .catch(e => {
          notifyError(e);
        });
    },
    // 删除定时
    del({ commit, state }, payload) {
      // ids
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
      });
      const params = {
        ...payload,
      };
      return timerDelete(params)
        .then(result => {
          const deleteTimers = (list, ...ids) => {
            const newList = [];
            list.forEach(uuid => {
              if (ids.indexOf(uuid) < 0) {
                newList.push(uuid);
              }
            });
            return newList;
          };

          const modifyUsedNumber = (limit, offset) => {
            const newLimit = [...limit];
            newLimit[2] = limit[2] + offset;
            return newLimit;
          };

          const timers = result;
          let { idList } = state.timer;
          const ids = timers.map(timer => timer.uuid);
          idList = deleteTimers(idList, ...ids);

          const { limits } = state.timer;
          timers.forEach(({ type }) => {
            limits[type] = modifyUsedNumber(limits[type], -1);
          });
          commit('updateTimer', {
            ...state.timer,
            idList,
            limits,
          });

          const { byId } = state.entities.timer;
          ids.forEach(uuid => delete byId[uuid]);
          const entities = {
            ...state.entities,
            timer: {
              ...state.entities.timer,
              byId,
            },
          };
          commit('updateEntities', entities);
        })
        .catch(e => {
          notifyError(e);
        });
    },
  },
};

export default localTimer;
