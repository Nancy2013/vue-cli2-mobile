/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 10:05:33
 * @LastEditTime: 2022-04-01 18:17:27
 * @LastEditors: Please set LastEditors
 */
import moment from 'moment';
import mock from '../commom';
import taskV2 from './taskV2';
// import './http';
/*
 * params:[..]    =>  {
 *                       key:value
 * vals:[..]      =>  }
 * */
const _combine = function({ params = [], vals = [] }) {
  if (Array.isArray(params) && Array.isArray(vals)) {
    const result = {};
    params.forEach(function(v, i) {
      result[v] = vals[i][0].val;
    });
    return result;
  } else {
    console.error('_combine error !');
    return {};
  }
};

const platformSDK = (() => {
  //task 老定时协议MOCK
  const getFormat = type =>
    type === 0 || type === 1 ? 'YYYY-MM-DD HH:mm:ss' : 'HH:mm:ss';
  const types = [
    'timerlist',
    'delaylist',
    'periodlist',
    'cyclelist',
    'randomlist',
  ];
  let last_index = 0; //最后一个index值，用于维护index
  //格式化定时数据
  const _taskListTransform = function(tasks) {
    const timers = [];
    let get_index = 0;
    const handlerTaskList = function(list = [], type) {
      const format = getFormat(type);
      list.forEach(task => {
        const override = {};
        override.time = moment(task.time, format);
        if (task.endtime) {
          override.endtime = moment(task.endtime, format);
        }
        timers.push({ ...task, type, ...override });
        get_index = task.index > get_index ? task.index : get_index;
      });
    };

    types.forEach((name, type) => {
      const data = tasks.data || tasks;
      handlerTaskList(data[name], type);
    });
    last_index = get_index > last_index ? get_index : last_index;
    return timers;
  };

  const addTask = function(task) {
    let this_typename = types[task.type];
    let dev_tasklist = window.localStorage.dev_tasklist
      ? JSON.parse(window.localStorage.dev_tasklist)
      : {};
    if (task.index == null) {
      task.index = last_index + 1;
      let tasks = dev_tasklist[this_typename] || [];
      tasks.push(task);
      dev_tasklist[this_typename] = tasks;
    } else {
      dev_tasklist[this_typename].forEach((time, i) => {
        if (time.index == task.index) {
          dev_tasklist[this_typename][i] = task;
        }
      });
    }
    window.localStorage.dev_tasklist = JSON.stringify(dev_tasklist);
    return Promise.resolve(_taskListTransform(dev_tasklist));
  };

  const listTask = function() {
    let p_tasks = '{"timerlist": []}';
    let tasks = JSON.parse(window.localStorage.dev_tasklist || p_tasks);
    return Promise.resolve(_taskListTransform(tasks));
  };
  const queryTask = function(type, index) {
    let tasks = JSON.parse(window.localStorage.dev_tasklist);
    const result = {};
    if (type === 3 || type === 4) {
      result.status = _combine(tasks[index].cmd1 || {});
      result.status2 = _combine(tasks[index].cmd2 || {});
    } else {
      result.status = _combine(tasks[index]);
    }
    return Promise.resolve(result);
  };

  const deleteTask = function(type, index) {
    let dev_tasklist = JSON.parse(window.localStorage.dev_tasklist);
    let this_typename = types[type];
    let new_task = [];
    dev_tasklist[this_typename].forEach((time, i) => {
      if (time.index !== index) {
        new_task.push(time);
      }
    });
    dev_tasklist[this_typename] = new_task;
    return Promise.resolve(_taskListTransform(dev_tasklist));
  };

  const allTaskDetail = function(taskList) {
    const tasksWithDetail = [];

    const getDetailByList = list => {
      function getDetailByIndex(index = 0) {
        const task = list[index];
        if (!task) {
          return Promise.resolve('done');
        }
        return queryTask(task.type, task.index).then(
          detail => {
            tasksWithDetail.push({ ...task, status: detail.status });
            return getDetailByIndex(++index);
          },
          (e = { message: 'unkown error' }) => {
            console.error(
              `type:${task.type} task:${JSON.stringify(
                task
              )} query detail fail.`
            );
            console.error(e);
            tasksWithDetail.push({ ...task, error: e });
            return getDetailByIndex(++index);
          }
        );
      }
      return getDetailByIndex();
    };
  };
  //老定时协议MOCK结束

  const closeWebView = function() {
    console.log('模拟关闭窗口成功');
    // window.opener = null;
    // window.open("", "_self", "");
    // window.close();
  };

  const openDevicePropertyPage = function() {
    console.log('模拟设备属性窗口成功');
  };

  const callNativeSafe = function(
    action,
    params = [],
    bridge = 'BLNativeBridge'
  ) {
    const backData = {
      getUserInfo: {
        userId: '04d49384b86b32bb786a3cec08563b10',
        nickName: 'Philips CoolHome_009GaWO',
        userName: '13601403070',
        userIcon: '',
        loginSession: '48f1a76eb3d430d7fb3861a7d3f4ff68',
      },
      deviceinfo: {
        devSession:
          '3dLn/tP9hkMl01b0JZDueJb5ZJXPi81IbbFPs8TQUjp/uy/57JCv3uCS6bNFirKsvJaS6OplQTI/dmUgkX9JhaZ3bTZvIwqQ6FkW/b6Uj/vfdVw=',
        deviceID: '00000000000000000000c8f742fef943',
        deviceMac: 'c8f742fef943',
        deviceName: '飞利浦挂机',
        deviceStatus: 2,
        groupDevices: [],
        key: '9fdde10425cd4bf3713f764efcc8fb45',
        productID: '00000000000000000000000090690000',
        user: {},
        vDevice: false,
      },
      devicecontrol: {
        status: 0,
        msg: 'success',
        data: {
          params: ['envtemp', 'model', 'ac_errcode1', 'err_flag', 'new_type'],
          vals: [
            [
              {
                val: 209,
                idx: 1,
              },
            ],
            [
              {
                val: 1,
                idx: 1,
              },
            ],
            [
              {
                val: 0,
                idx: 1,
              },
            ],
            [
              {
                val: 0,
                idx: 1,
              },
            ],
            [
              {
                val: 1,
                idx: 1,
              },
            ],
          ],
        },
      },
      getFamilyInfo: {
        familyId: '04d49384efd4c5534e90cc8dbc02e248',
        familyName: '我的家',
        familyIcon: '',
        countryCode: '1',
        provinceCode: '32',
        cityCode: '1',
        isAdmin: true,
      },
      getFamilySceneList: {
        scenes: [{ id: 'xxxx', name: '看电视', icon: '场景图标' }],
      },
      init: {
        lid: 'c02b9797666e77331e8567124f97c3bb',
        version: '2.9.13',
        license:
          'wCuXl2ZudzMehWcST5fDu72vjGtrWVPghFGwWwwadK3kRWVO95n0RNr8fjUmRcVh9avnYQAAAABZfFHtDF8Q4gAglFOfEm9nH+ayXHkqcmmXvzbHNVp7VesioszZTRHZOuPQgvWqf9MnJ/6Pavcr8au92Ww6D7YO1KRZ//2EZMrb9qG0aUWfkQAAAAA=',
        appid: 'com.Philips.coolhome',
        cloudPlatform: 'serverCluster',
        // apphost: 'app-service-chn-31a93883.ibroadlink.com',
      },
      getSystemSettings: {
        wifiSSID: '',
        statusBarHeight: 54,
        notificationEnable: true,
        timeZone: 'GMT+08:00',
        timeInfo: 'Asia/Shanghai',
      },
      getAppSettings: { tempUnit: 'C', vibrateEnable: false },
      cloudServices: {
        status: 0,
        error: 0,
        msg: 'ok',
        result: [
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '30',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机1驱动IPM模块保护',
            'fault-code': '31',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机1驱动硬件保护',
            'fault-code': '32',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机1驱动模块软件保护',
            'fault-code': '33',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机1驱动压缩机未联',
            'fault-code': '34',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机1驱动过电流保护',
            'fault-code': '35',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机1驱动DC过欠压保护',
            'fault-code': '36',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机1驱动温度传感器故障',
            'fault-code': '37',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机1驱动欠相保护',
            'fault-code': '38',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机1驱动模块温度过高保护',
            'fault-code': '39',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机1模块温度保护',
            'fault-code': '3A',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机1模块启动失败或运转失步',
            'fault-code': '3B',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机1过电流保护',
            'fault-code': '3C',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机1DC过欠压保护',
            'fault-code': '3D',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机1驱动交流输入电流保护',
            'fault-code': '3E',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机1驱动PFC模块保护',
            'fault-code': '3F',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机1模块启动失败或运转失步',
            'fault-code': '3H',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机1DC过欠压保护',
            'fault-code': '3J',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '40',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机1驱动板IPM报警',
            'fault-code': '41',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机1过速保护',
            'fault-code': '42',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机1驱动板硬件保护',
            'fault-code': '43',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '44',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '45',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '46',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内机丢失故障',
            'fault-code': '47',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '48',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机2驱动板IPM报警',
            'fault-code': '49',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机2过速保护',
            'fault-code': '4A',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机2驱动板硬件保护',
            'fault-code': '4B',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '4C',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '4D',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '4E',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '4F',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机2驱动板硬件保护',
            'fault-code': '4H',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '4J',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '50',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机2驱动IPM模块保护',
            'fault-code': '51',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机2驱动硬件保护',
            'fault-code': '52',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机2驱动模块软件保护',
            'fault-code': '53',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机2驱动压缩机未联',
            'fault-code': '54',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机2驱动过电流保护',
            'fault-code': '55',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机2驱动DC过欠压保护',
            'fault-code': '56',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机2驱动温度传感器故障',
            'fault-code': '57',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机2驱动欠相保护',
            'fault-code': '58',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机2驱动模块温度过高保护',
            'fault-code': '59',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机2模块温度保护',
            'fault-code': '5A',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机2模块启动失败或运转失步',
            'fault-code': '5B',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机2过电流保护',
            'fault-code': '5C',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机2DC过欠压保护',
            'fault-code': '5D',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机2驱动交流输入电流保护',
            'fault-code': '5E',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机2驱动PFC模块保护',
            'fault-code': '5F',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机2模块启动失败或运转失步',
            'fault-code': '5H',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机2DC过欠压保护',
            'fault-code': '5J',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '90',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '91',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '92',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '93',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '94',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '95',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '96',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '97',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': '98',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '内机与风机驱动板通讯故障',
            'fault-code': '99',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '内风机模块温度保护',
            'fault-code': '9A',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '内风机模块启动失败或运转失步',
            'fault-code': '9B',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '内风机过电流保护',
            'fault-code': '9C',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '内风机DC过欠压保护',
            'fault-code': '9D',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '内风机驱动板IPM报警',
            'fault-code': '9E',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '内风机驱动板EE故障',
            'fault-code': '9F',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '内风机模块启动失败或运转失步',
            'fault-code': '9H',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '内风机DC过欠压保护',
            'fault-code': '9J',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'A0',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内环境温度传感器故障',
            'fault-code': 'A1',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内盘管中部温度传感器故障',
            'fault-code': 'A2',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内盘管入口温度传感器故障',
            'fault-code': 'A3',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内盘管出口温度传感器故障',
            'fault-code': 'A4',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内水泵故障',
            'fault-code': 'A5',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内风机故障',
            'fault-code': 'A6',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '可逆同步电机故障',
            'fault-code': 'A7',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': 'EEPROM故障',
            'fault-code': 'A8',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内机与外机通讯障',
            'fault-code': 'A9',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '内机与线控器通信故障',
            'fault-code': 'AA',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内机地址冲突',
            'fault-code': 'AB',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '集中重机号故障',
            'fault-code': 'AC',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内机盘管中部防冻结保护',
            'fault-code': 'AD',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '异模式运转',
            'fault-code': 'AE',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '内机电子膨胀阀故障',
            'fault-code': 'AF',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内机地址冲突',
            'fault-code': 'AH',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内机盘管中部防冻结保护',
            'fault-code': 'AJ',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '正常',
            'fault-code': 'A_0',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '模块保护故障',
            'fault-code': 'A_1',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室外风机故障',
            'fault-code': 'A_10',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内环境温度传感器故障',
            'fault-code': 'A_11',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内盘管传感器故障',
            'fault-code': 'A_12',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内风机回路故障',
            'fault-code': 'A_13',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '其他故障或保护见工装显示',
            'fault-code': 'A_14',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机壳体传感器故障',
            'fault-code': 'A_15',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '回气传感器故障',
            'fault-code': 'A_16',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压机超功率保护',
            'fault-code': 'A_17',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '过电流保护',
            'fault-code': 'A_18',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压缩机排气保护',
            'fault-code': 'A_19',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': 'PFC保护故障',
            'fault-code': 'A_2',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '制冷防过载保护',
            'fault-code': 'A_20',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '制热室内防高温保护',
            'fault-code': 'A_21',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '制冷室内防冻结保护',
            'fault-code': 'A_22',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压缩机壳体温度保护',
            'fault-code': 'A_23',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '过欠压保护',
            'fault-code': 'A_24',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '高压开关保护',
            'fault-code': 'A_25',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '低压开关保护或者缺液保护',
            'fault-code': 'A_26',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '内机主板和显示板通信故障',
            'fault-code': 'A_27',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': 'IPM 温度过高保护',
            'fault-code': 'A_28',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压缩机启动失败或运行失步故障',
            'fault-code': 'A_3',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '滑动门开关故障',
            'fault-code': 'A_30',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '四通阀故障',
            'fault-code': 'A_31',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室外冷凝温度传感器故障',
            'fault-code': 'A_32',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '2#外风机故障',
            'fault-code': 'A_33',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '冷凝温度过高保护',
            'fault-code': 'A_34',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '内机EEPROM故障（柜机）',
            'fault-code': 'A_35',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '机型判断错误（预留）',
            'fault-code': 'A_36',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '断电保护',
            'fault-code': 'A_37',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压缩机排气传感器故障',
            'fault-code': 'A_4',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室外盘管传感器故障',
            'fault-code': 'A_5',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '排气温度过低保护',
            'fault-code': 'A_50',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '低压开关断开保护',
            'fault-code': 'A_51',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '低压过低保护',
            'fault-code': 'A_52',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '四通阀故障',
            'fault-code': 'A_53',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内机蒸发器进口温度传感器Te2故障',
            'fault-code': 'A_54',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内机蒸发器出口温度传感器Te1故障',
            'fault-code': 'A_55',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '内机间通讯线接错故障',
            'fault-code': 'A_56',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内水泵排水故障',
            'fault-code': 'A_57',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '线控器通讯故障',
            'fault-code': 'A_58',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '商用预留',
            'fault-code': 'A_59',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室外环境传感器故障',
            'fault-code': 'A_6',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '高压压力传感器故障',
            'fault-code': 'A_60',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': 'PFC温度过高或模块温度过高',
            'fault-code': 'A_61',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': 'PFC温度传感器故障',
            'fault-code': 'A_62',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内外通信故障',
            'fault-code': 'A_7',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室外模块通讯故障',
            'fault-code': 'A_8',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '光敏功能故障',
            'fault-code': 'A_81',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '显示板接收触摸通信故障',
            'fault-code': 'A_82',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': 'PM2.5通信故障',
            'fault-code': 'A_83',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室外 EE 故障',
            'fault-code': 'A_9',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'B0',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '高压压力开关HPSa故障',
            'fault-code': 'B1',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '高压压力开关HPSb故障',
            'fault-code': 'B2',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '高压压力开关HPSc故障',
            'fault-code': 'B3',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '低压压力开关LPS故障',
            'fault-code': 'B4',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '冷媒不足保护',
            'fault-code': 'B5',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '阀门异常保护',
            'fault-code': 'B6',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '膨胀阀接错故障',
            'fault-code': 'B7',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '定频压缩机1过电流保护',
            'fault-code': 'B8',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '定频压缩机2过电流保护',
            'fault-code': 'B9',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'BA',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'BB',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'BC',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '三相电源缺相或相序错误',
            'fault-code': 'BD',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '机组交流输入电压过高保护',
            'fault-code': 'BE',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '油温过低保护',
            'fault-code': 'BF',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '模块保护故障',
            'fault-code': 'B_0',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流过欠压故障',
            'fault-code': 'B_1',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': 'IPM温度传感器故障',
            'fault-code': 'B_10',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压缩机启动失败',
            'fault-code': 'B_11',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': 'PFC电流检测AD异常保护',
            'fault-code': 'B_12',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机电流检测AD异常保护',
            'fault-code': 'B_13',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机缺相保护',
            'fault-code': 'B_14',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机失步保护',
            'fault-code': 'B_15',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '直流风机IPM保护',
            'fault-code': 'B_16',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压缩机相电流过流保护',
            'fault-code': 'B_2',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压缩机失步故障',
            'fault-code': 'B_3',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '120N排气传感器故障',
            'fault-code': 'B_30',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压缩机缺相故障',
            'fault-code': 'B_4',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压缩机驱动模块IPM故障',
            'fault-code': 'B_5',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': 'PFC 过流硬件保护',
            'fault-code': 'B_6',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': 'PFC 过流软件保护',
            'fault-code': 'B_7',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '电流检测AD异常保护',
            'fault-code': 'B_8',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': 'shunt 电阻不平衡故障',
            'fault-code': 'B_9',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'C0',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '环温温度传感器Tao故障',
            'fault-code': 'C1',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '除霜温度传感器Tdef故障',
            'fault-code': 'C2',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压缩机1排气温度传感器Tda故障',
            'fault-code': 'C3',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压缩机2排气温度传感器Tdb故障',
            'fault-code': 'C4',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压缩机3排气温度传感器Tdc故障',
            'fault-code': 'C5',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '吸气温度传感器Ts故障',
            'fault-code': 'C6',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '变频压缩机吸气温度传感器Tsa故障',
            'fault-code': 'C7',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室外冷凝器中部温度传感器Tc1故障',
            'fault-code': 'C8',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '热交换器入口温度Tco1故障',
            'fault-code': 'C9',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '热交换器入口温度Tco2故障',
            'fault-code': 'CA',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '过冷却热液管温度Tci故障',
            'fault-code': 'CB',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '板换液出传感器故障',
            'fault-code': 'CC',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '(压机1）油温传感器Toila故障',
            'fault-code': 'CD',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '换气进传感器故障',
            'fault-code': 'CE',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '板换气出传感器故障',
            'fault-code': 'CF',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '过冷却热液管温度Tci故障',
            'fault-code': 'CH',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '（压机1）油温传感器Toila故障',
            'fault-code': 'CJ',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'D0',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室外机之间通讯故障',
            'fault-code': 'D1',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内外机通讯故障',
            'fault-code': 'D2',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '控制板与1#压缩机驱动板通讯故障',
            'fault-code': 'D3',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '控制板与1#风机驱动板通讯故障',
            'fault-code': 'D4',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室外机台数、地址或匹数设定错误',
            'fault-code': 'D5',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'D6',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': 'EEPROM故障',
            'fault-code': 'D7',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '控制板与2#压缩机驱动板通讯故障',
            'fault-code': 'D8',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '控制板与2#风机驱动板通讯故障',
            'fault-code': 'D9',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'DA',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'DB',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'DC',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '能力超配故障',
            'fault-code': 'DD',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '除霜、回油故障',
            'fault-code': 'DE',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': 'MCU复位故障',
            'fault-code': 'DF',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'E0',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '四通阀切换故障',
            'fault-code': 'E1',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'E2',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压缩机1排气温度Tda过高保护',
            'fault-code': 'E3',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压缩机2排气温度Tdb过高保护',
            'fault-code': 'E4',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压缩机3排气温度Tdc过高保护',
            'fault-code': 'E5',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'E6',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'E7',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室外冷凝器中部温度Tc1保护',
            'fault-code': 'E8',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '模块散热器温度过低保护',
            'fault-code': 'E9',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '油温度Toila过高故障',
            'fault-code': 'EA',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '油温度Toila过高故障',
            'fault-code': 'EB',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '排气温度Tdb过低保护',
            'fault-code': 'EC',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '排气温度Tdc过低保护',
            'fault-code': 'ED',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'EE',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室外冷凝器中部温度Tc2停机保护',
            'fault-code': 'EF',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '油温度Toila过低故障',
            'fault-code': 'EH',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '排气温度Tdc过低保护',
            'fault-code': 'EJ',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'F0',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '高压压力传感器Pd故障',
            'fault-code': 'F1',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'F2',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '高压传感器Pd过高保护',
            'fault-code': 'F3',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '低压压力传感器Ps故障',
            'fault-code': 'F4',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'F5',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '低压传感器Ps过低保护',
            'fault-code': 'F6',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'F7',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压缩比ε过高保护',
            'fault-code': 'F8',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '压缩比ε过低保护',
            'fault-code': 'F9',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '高低压无压差',
            'fault-code': 'FA',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '变频排气温度Tda过低保护',
            'fault-code': 'FB',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'FC',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'FD',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'FE',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'FF',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '变频排气温度Tda过低保护',
            'fault-code': 'FH',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'FJ',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'H0',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '高压压力开关HPSa故障',
            'fault-code': 'H1',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '高压压力开关HPSb故障',
            'fault-code': 'H2',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '高压压力开关HPSc故障',
            'fault-code': 'H3',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '低压压力开关LPS故障',
            'fault-code': 'H4',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '冷媒不足保护',
            'fault-code': 'H5',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '阀门异常保护',
            'fault-code': 'H6',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '膨胀阀接错故障',
            'fault-code': 'H7',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '定频压缩机1过电流保护',
            'fault-code': 'H8',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '定频压缩机2过电流保护',
            'fault-code': 'H9',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'HA',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'HC',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '机组交流输入电压过高保护',
            'fault-code': 'HE',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '油温过低保护',
            'fault-code': 'HF',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'HH',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '三相电源缺相或相序错误',
            'fault-code': 'HJ',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'J0',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室外机之间通讯故障',
            'fault-code': 'J1',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室内外机通讯故障',
            'fault-code': 'J2',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '控制板与1#压缩机驱动板通讯故障',
            'fault-code': 'J3',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '控制板与1#风机驱动板通讯故障',
            'fault-code': 'J4',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '室外机台数、地址或匹数设定错误',
            'fault-code': 'J5',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'J6',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': 'EEPROM故障',
            'fault-code': 'J7',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '控制板与2#压缩机驱动板通讯故障',
            'fault-code': 'J8',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '控制板与2#风机驱动板通讯故障',
            'fault-code': 'J9',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'JA',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'JC',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '除霜、回油故障',
            'fault-code': 'JE',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': 'MCU复位故障',
            'fault-code': 'JF',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '未定义',
            'fault-code': 'JH',
          },
          {
            companyid: '48eb1b36cf0202ab2ef07b880ecda60d',
            langcode: 'zh-cn',
            'fault-type': '能力超配故障',
            'fault-code': 'JJ',
          },
        ],
      },
    };
    return new Promise(function(resolve, reject) {
      const tag = ` ${action} ${
        action === 'devicecontrol' ? params[2]['act'] : ''
      }`;
      console.log(`bridge-call :${tag} params:${JSON.stringify(params)}`);
      if (
        action == 'getUserInfo' ||
        action == 'getFamilyInfo' ||
        action == 'getFamilySceneList' ||
        action == 'init' ||
        action == 'deviceinfo' ||
        action == 'devicecontrol'
      ) {
        console.log(
          `bridge-call-success : ${JSON.stringify(backData[action])}`
        );
      }
      resolve(backData[action]);
    });
  };

  //navbar 开始
  const custom = function(config = {}) {
    console.log('自定义顶部标题栏');
  };
  const backHandler = function(handler) {
    console.log('顶部左侧返回');
  };
  const hide = function() {
    console.log('隐藏顶部标题栏');
  };
  const simple = function() {
    return custom();
  };
  const restore = function() {
    console.log('修改顶部标题栏');
  };
  const transparent = function(options = {}) {
    console.log('H5填充顶部标题栏');
  };

  return {
    task: { addTask, listTask, queryTask, deleteTask, allTaskDetail },
    taskV2,
    navbar: { backHandler, custom, simple, restore, transparent, hide },
    closeWebView,
    openDevicePropertyPage,
    getDevice: () => {},
    callNative: callNativeSafe,
  };
})();

export default {
  ...mock,
  platform: 'dna',
  platformSDK,
};
