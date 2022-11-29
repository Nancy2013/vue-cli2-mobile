/*
 * @Author: your name
 * @Date: 2019-06-26 17:37:54
 * @LastEditTime: 2021-12-08 14:15:04
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue-cli2-mobile\src\store\modules\index.js
 */
const context = require.context('./', false, /^\.\/(?!index)[^/]*\.js$/);

const modules = context.keys().reduce((module, key) => {
  const name = key.replace(/(^\.\/|\.js$)/g, '');
  module[name] = context(key).default;
  return module;
}, {});

export default modules;
