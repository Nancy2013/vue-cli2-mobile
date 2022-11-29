/*
 * @Author: your name
 * @Date: 2022-03-01 14:25:56
 * @LastEditTime: 2022-03-07 17:17:40
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\.mock\dna\http\index.js
 */
// 使用 Mock
var Mock = require('mockjs');
import { timerList as tempData } from './timers';
import { faultList } from './faults';

// 添加
Mock.mock('/appfront/v1/timertask/manage', () => {
  let result = JSON.parse(localStorage.getItem('timerList'));
  if (!result) {
    result = tempData;
    localStorage.setItem('timerList', JSON.stringify(result));
  }
  console.log('----manage----', result);
  return result;
});
// 添加 | 编辑
Mock.mock('/appfront/v1/timertask/upsert', (req, res) => {
  const temp = JSON.parse(localStorage.getItem('timerList'));
  const { timerlist } = temp.payload;
  const { body } = req;
  console.log('-----upsert----', JSON.parse(body));
  const timer = JSON.parse(body).payload;
  const { jobid } = timer;
  const pos = timerlist.findIndex(v => v.jobid === jobid);
  if (pos > -1) {
    // 编辑
    timerlist[pos] = {
      ...timer,
    };
  } else {
    // 添加
    timer.jobid = timerlist.length;
    timerlist.push(timer);
  }

  temp.timerlist = timerlist;
  localStorage.setItem('timerList', JSON.stringify(temp));
  const result = {
    status: 0,
    msg: '',
    payload: {
      jobid: '',
    },
  };
  return result;
});
// 删除
Mock.mock('/appfront/v1/timertask/del', (req, res) => {
  const timerList = JSON.parse(localStorage.getItem('timerList'));
  const result = {
    status: 0,
    msg: '',
    payload: {
      jobid: '',
    },
  };
  return result;
});
// 添查询错误
Mock.mock('/farm/product/v1/system/faultquery', () => {
  const result = faultList;
  console.log('-----faultquery------', result);
  return result;
});
