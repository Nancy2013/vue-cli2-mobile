import adapter from 'adapter';
import taskQueue from './task-queue';
/* eslint-disable */
const UPDATE_STATUS_INTERVAL = 3000;
const platform = adapter.platform;

const _transform = function(targetPlatform, sourcePlatform, source) {
  const mapping = window.PLATFORM_MAPPING;

  if (sourcePlatform === targetPlatform || !mapping) {
    //no need to transform
    return source;
  }

  if (!mapping.params[targetPlatform] || !mapping.params[sourcePlatform]) {
    // console.warn(`unsupported platform :${targetPlatform} or ${sourcePlatform}`);
    //do not transform
    return source;
  }

  if (Array.isArray(source)) {
    return source.map(function(p) {
      let index = mapping.params[sourcePlatform].indexOf(p);
      if (index < 0) {
        console.warn(`can not find param :${p} in map`);
        return p;
      }
      return mapping.params[targetPlatform][index];
    });
  } else if (source && typeof source === 'object') {
    let newParam = {};

    Object.keys(source).forEach(function(p) {
      let indexP = mapping.params[sourcePlatform].indexOf(p);
      if (indexP < 0) {
        console.warn(`can not find param :${p} in ${sourcePlatform}'s map`);
        newParam[p] = source[p];
        return;
      }

      let newKey = mapping.params[targetPlatform][indexP];
      if (newKey == null) {
        console.warn(
          `can not find index :${indexP} in ${targetPlatform}'s map`
        );
        newParam[p] = source[p];
        return;
      }

      let sourceVals = mapping.vals[sourcePlatform][indexP];
      if (sourceVals) {
        let indexV = sourceVals.indexOf(source[p]);
        newParam[newKey] = mapping.vals[targetPlatform][indexP][indexV];
      } else {
        //值为null ,不做转换
        newParam[newKey] = source[p];
      }
    });
    return newParam;
  } else {
    // console.error('error ! unsupported arguments !');
    return source;
  }
};

const _standard2Platform = function(params) {
  return _transform(adapter.platform, process.env.PROTOCOL, params);
};

const _platform2Standard = function(params) {
  return _transform(process.env.PROTOCOL, adapter.platform, params);
};

const _setDeviceStatus = function(status) {
  const platformStatus = _standard2Platform(status);

  return adapter.setDeviceStatus(platformStatus).then(function(data) {
    if (data && data.status) {
      data.status = _platform2Standard(data.status);
      return data;
    }
  });
};

const _getDeviceStatus = function(params) {
  const platformParams = _standard2Platform(params);

  return adapter.getDeviceStatus(platformParams).then(function(data) {
    data.status = _platform2Standard(data.status);
    return data;
  });
};

const _shallowCompare = function(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }
  if (
    typeof obj1 !== 'object' ||
    obj1 == null ||
    typeof obj2 !== 'object' ||
    obj2 == null
  ) {
    return false;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let i = 0; i < keys1.length; i++) {
    if (obj1[keys1[i]] !== obj2[keys1[i]]) {
      return false;
    }
  }
  return true;
};

const onStatusChanged = (function() {
  if (adapter.onStatusChanged) {
    //若平台支持设备监听，则返回平台方法
    return adapter.onStatusChanged;
  }

  let lastData = {};
  let callback;
  let intervalID;

  const compare = function(data1, data2) {
    return (
      data1.online === data2.online &&
      data1.name === data2.name &&
      _shallowCompare(data1.status, data2.status)
    );
  };

  return function(fn) {
    if (!fn || fn.__proto__ === Function.prototype) {
      if (intervalID) {
        clearInterval(intervalID);
        intervalID = null;
      }
      return;
    }
    callback = fn;

    if (!intervalID) {
      intervalID = setInterval(function() {
        _getDeviceStatus().then(function(data) {
          if (!compare(data, lastData)) {
            lastData = data;
            callback(data);
          }
        });
      }, UPDATE_STATUS_INTERVAL);
    }
  };
})();

const ready = function() {
  return adapter.ready().then(function(data) {
    data.status = _platform2Standard(data.status);
    return data;
  });
};

const _sync = function(fn, type, omit) {
  return function() {
    const args = Array.prototype.slice.call(arguments);

    return new Promise(function(resolve, reject) {
      const task = () =>
        fn
          .apply(null, args)
          .then(resolve)
          .catch(reject);

      task.type = type;
      task.omit = omit;

      taskQueue.push(task);
    });
  };
};

const platformSDK = adapter.platformSDK;
if (platform === 'dna') {
  const { task, taskV2 } = platformSDK;
  Object.keys(task).forEach(
    field => (task[field] = _sync(task[field], 'timer'))
  );
  ['add', 'list', 'del', 'sunSetting', 'getLimitation', 'call'].forEach(
    field => (taskV2[field] = _sync(taskV2[field], 'timer'))
  );
}

export default {
  ready,
  platformSDK,
  setDeviceStatus: _sync(_setDeviceStatus, 'set'),
  getDeviceStatus:
    platform === 'gome' ? _getDeviceStatus : _sync(_getDeviceStatus, 'get'),
  __getStatus__:
    platform === 'gome'
      ? _getDeviceStatus
      : _sync(_getDeviceStatus, 'get', true),
  platform,
  onStatusChanged,
};
