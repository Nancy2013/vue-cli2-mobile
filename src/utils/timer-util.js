/*
 * @Author: your name
 * @Date: 2022-03-03 10:20:47
 * @LastEditTime: 2022-03-04 16:15:41
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\utils\timer-util.js
 */
import moment from 'moment';

const repeatArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const once = '仅限一次';
const everydayRepeat = '每天';
const weekdayRepeat = '工作日';
const weekendRepeat = '周末';
const customRepeat = '自定义';
const periodDesc = (repeat, formatMessage) => {
  if (repeat && repeat.length > 0) {
    return repeat.map(r => repeatArr[r]).join(' ');
  }
  return once;
};

export const timerPeriods = () => [
  {
    name: once,
    match: repeat => !repeat || repeat.length === 0,
    choose: () => [],
  },
  {
    name: everydayRepeat,
    match: repeat => repeat.length === 7,
    choose: () => [0, 1, 2, 3, 4, 5, 6],
  },
  {
    name: weekdayRepeat,
    match: repeat => {
      const weekday = [1, 2, 3, 4, 5];
      let containsAll = true;
      for (let i = 0; i < weekday.length; i++) {
        if (repeat.indexOf(weekday[i]) < 0) {
          containsAll = false;
          break;
        }
      }
      return containsAll && weekday.length === repeat.length;
    },
    choose: () => [1, 2, 3, 4, 5],
  },
  {
    name: weekendRepeat,
    match: repeat => {
      const weekend = [6, 0];
      let containsAll = true;
      for (let i = 0; i < weekend.length; i++) {
        if (repeat.indexOf(weekend[i]) < 0) {
          containsAll = false;
          break;
        }
      }
      return containsAll && weekend.length === repeat.length;
    },
    choose: () => [6, 0],
  },
  {
    name: customRepeat,
    match: repeat => repeat && repeat.length > 0,
    desc: (repeat, formatMessage) => periodDesc(repeat, formatMessage),
  },
];

export const repeatDesc = (repeat, formatMessage) => {
  const periods = timerPeriods();
  for (let i = 0; i < periods.length; i++) {
    const period = periods[i];
    if (period.match(repeat)) {
      const desc = period.desc
        ? period.desc(repeat, formatMessage)
        : period.name;
      return desc;
    }
  }
  return null;
};

// 定时排序
export function sortTimers(timers) {
  if (!timers || timers.length === 0) {
    return [];
  }

  const invalid = [];
  const valid = [];

  const getTimeField = timer => timer.timer.time;

  timers.forEach(timer => {
    if (timer.enable) {
      valid.push(timer);
    } else {
      invalid.push(timer);
    }
  });

  const sort = (a, b) => {
    const aTime = moment(getTimeField(a)).format('HH:mm');
    const bTime = moment(getTimeField(b)).format('HH:mm');

    return aTime < bTime ? -1 : 1;
  };

  valid.sort(sort);
  invalid.sort(sort);

  return [...valid, ...invalid];
}
