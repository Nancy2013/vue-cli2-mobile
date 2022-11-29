/*
 * @Author: your name
 * @Date: 2022-03-02 09:44:30
 * @LastEditTime: 2022-03-02 09:44:30
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\.mock\dna\http\timers.js
 */
export const timerList = {
  status: 0,
  msg: '成功',
  payload: {
    timerlist: [
      {
        endpointid: '',
        version: 'v2',
        pushurl: '',
        type: 0,
        index: 0,
        name: '',
        userid: '157fd7f3be603c6365064ea5e4ef50c9',
        familyid: '011d68ac4a167f9a0331f03fcf832ef2',
        enable: false,
        timer: {
          weekdays: '1234567',
          time: '2019-10-23T19:18:05+08:00',
        },
        data: JSON.stringify({
          directive: {
            header: {
              namespace: 'DNA.KeyValueControl',
              'name ': 'FreeKeyValueControl',
              interfaceVersion: '3',
              messageId: '1bd5d003-31b9-476f-ad03-71d471922820',
            },
            endpoint: {
              endpointId: '00000000000000000000d8467cc4db02',
              cookie: {
                did: '00000000000000000000d8467cc4db02',
                pid: '0000000000000000000000001f620000',
                userId: '157fd7f3be603c6365064ea5e4ef50c9',
                familyId: '011d68ac4a167f9a0331f03fcf832ef2',
              },
            },
            payload: {
              act: 'set',
              params: ['pwr', 'ac_mode'],
              vals: [
                [
                  {
                    idx: 1,
                    val: 1,
                  },
                ],
                [
                  {
                    idx: 1,
                    val: 0,
                  },
                ],
              ],
            },
          },
        }),
        extern: '',
        jobid: 'bb6459be2baa9fe2a3b1abf475e1cbee0',
      },
      {
        endpointid: '',
        version: 'v2',
        pushurl: '',
        type: 0,
        index: 0,
        name: '',
        userid: '157fd7f3be603c6365064ea5e4ef50c9',
        familyid: '011d68ac4a167f9a0331f03fcf832ef2',
        enable: true,
        timer: {
          weekdays: '12345',
          time: '2019-10-23T19:02:05+08:00',
        },
        data: JSON.stringify({
          directive: {
            header: {
              namespace: 'DNA.KeyValueControl',
              'name ': 'FreeKeyValueControl',
              interfaceVersion: '3',
              messageId: '1bd5d003-31b9-476f-ad03-71d471922820',
            },
            endpoint: {
              endpointId: '00000000000000000000d8467cc4db02',
              cookie: {
                did: '00000000000000000000d8467cc4db02',
                pid: '0000000000000000000000001f620000',
                userId: '157fd7f3be603c6365064ea5e4ef50c9',
                familyId: '011d68ac4a167f9a0331f03fcf832ef2',
              },
            },
            payload: {
              act: 'set',
              params: ['pwr', 'ac_mode'],
              vals: [
                [
                  {
                    idx: 1,
                    val: 1,
                  },
                ],
                [
                  {
                    idx: 1,
                    val: 1,
                  },
                ],
              ],
            },
          },
        }),
        extern: '',
        jobid: 'bb6459be2baa9fe2a3b1abf475e1cbee1',
      },
      {
        endpointid: '',
        version: 'v2',
        pushurl: '',
        type: 0,
        index: 0,
        name: '',
        userid: '157fd7f3be603c6365064ea5e4ef50c9',
        familyid: '011d68ac4a167f9a0331f03fcf832ef2',
        enable: true,
        timer: {
          weekdays: '67',
          time: '2019-10-23T19:12:05+08:00',
        },
        data: JSON.stringify({
          directive: {
            header: {
              namespace: 'DNA.KeyValueControl',
              'name ': 'FreeKeyValueControl',
              interfaceVersion: '3',
              messageId: '1bd5d003-31b9-476f-ad03-71d471922820',
            },
            endpoint: {
              endpointId: '00000000000000000000d8467cc4db02',
              cookie: {
                did: '00000000000000000000d8467cc4db02',
                pid: '0000000000000000000000001f620000',
                userId: '157fd7f3be603c6365064ea5e4ef50c9',
                familyId: '011d68ac4a167f9a0331f03fcf832ef2',
              },
            },
            payload: {
              act: 'set',
              params: ['pwr', 'ac_mode'],
              vals: [
                [
                  {
                    idx: 1,
                    val: 1,
                  },
                ],
                [
                  {
                    idx: 1,
                    val: 2,
                  },
                ],
              ],
            },
          },
        }),
        extern: '',
        jobid: 'bb6459be2baa9fe2a3b1abf475e1cbee2',
      },
      {
        endpointid: '',
        version: 'v2',
        pushurl: '',
        type: 0,
        index: 0,
        name: '',
        userid: '157fd7f3be603c6365064ea5e4ef50c9',
        familyid: '011d68ac4a167f9a0331f03fcf832ef2',
        enable: true,
        timer: {
          weekdays: '',
          time: '2019-10-23T19:01:05+08:00',
        },
        data: JSON.stringify({
          directive: {
            header: {
              namespace: 'DNA.KeyValueControl',
              'name ': 'FreeKeyValueControl',
              interfaceVersion: '3',
              messageId: '1bd5d003-31b9-476f-ad03-71d471922820',
            },
            endpoint: {
              endpointId: '00000000000000000000d8467cc4db02',
              cookie: {
                did: '00000000000000000000d8467cc4db02',
                pid: '0000000000000000000000001f620000',
                userId: '157fd7f3be603c6365064ea5e4ef50c9',
                familyId: '011d68ac4a167f9a0331f03fcf832ef2',
              },
            },
            payload: {
              act: 'set',
              params: ['pwr', 'ac_mode'],
              vals: [
                [
                  {
                    idx: 1,
                    val: 1,
                  },
                ],
                [
                  {
                    idx: 1,
                    val: 3,
                  },
                ],
              ],
            },
          },
        }),
        extern: '',
        jobid: 'bb6459be2baa9fe2a3b1abf475e1cbee3',
      },
      {
        endpointid: '',
        version: 'v2',
        pushurl: '',
        type: 0,
        index: 0,
        name: '',
        userid: '157fd7f3be603c6365064ea5e4ef50c9',
        familyid: '011d68ac4a167f9a0331f03fcf832ef2',
        enable: true,
        timer: {
          weekdays: '13',
          time: '2019-10-23T19:32:05+08:00',
        },
        data: JSON.stringify({
          directive: {
            header: {
              namespace: 'DNA.KeyValueControl',
              'name ': 'FreeKeyValueControl',
              interfaceVersion: '3',
              messageId: '1bd5d003-31b9-476f-ad03-71d471922820',
            },
            endpoint: {
              endpointId: '00000000000000000000d8467cc4db02',
              cookie: {
                did: '00000000000000000000d8467cc4db02',
                pid: '0000000000000000000000001f620000',
                userId: '157fd7f3be603c6365064ea5e4ef50c9',
                familyId: '011d68ac4a167f9a0331f03fcf832ef2',
              },
            },
            payload: {
              act: 'set',
              params: ['pwr', 'ac_mode'],
              vals: [
                [
                  {
                    idx: 1,
                    val: 1,
                  },
                ],
                [
                  {
                    idx: 1,
                    val: 4,
                  },
                ],
              ],
            },
          },
        }),
        extern: '',
        jobid: 'bb6459be2baa9fe2a3b1abf475e1cbee4',
      },
      {
        endpointid: '',
        version: 'v2',
        pushurl: '',
        type: 0,
        index: 0,
        name: '',
        userid: '157fd7f3be603c6365064ea5e4ef50c9',
        familyid: '011d68ac4a167f9a0331f03fcf832ef2',
        enable: true,
        timer: {
          weekdays: '24',
          time: '2019-10-23T19:21:05+08:00',
        },
        data: JSON.stringify({
          directive: {
            header: {
              namespace: 'DNA.KeyValueControl',
              'name ': 'FreeKeyValueControl',
              interfaceVersion: '3',
              messageId: '1bd5d003-31b9-476f-ad03-71d471922820',
            },
            endpoint: {
              endpointId: '00000000000000000000d8467cc4db02',
              cookie: {
                did: '00000000000000000000d8467cc4db02',
                pid: '0000000000000000000000001f620000',
                userId: '157fd7f3be603c6365064ea5e4ef50c9',
                familyId: '011d68ac4a167f9a0331f03fcf832ef2',
              },
            },
            payload: {
              act: 'set',
              params: ['pwr', 'ac_mode'],
              vals: [
                [
                  {
                    idx: 1,
                    val: 1,
                  },
                ],
                [
                  {
                    idx: 1,
                    val: 4,
                  },
                ],
              ],
            },
          },
        }),
        extern: '',
        jobid: 'bb6459be2baa9fe2a3b1abf475e1cbee5',
      },
    ],
  },
};
