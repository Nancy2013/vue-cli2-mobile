/*
 * @Author: your name
 * @Date: 2019-11-01 14:36:02
 * @LastEditTime: 2021-09-15 18:02:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-mobile-template\src\locale\index.js
 */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import getI18nBundle, { browserLocale } from 'commonPath/get-i18n-bundle';

const context = require.context('./', true, /index\.js$/);

const languages = context.keys().reduce((v, key) => {
  if (key !== './index.js') {
    const fileName = key.split('/')[1]; // 取文件夹名称
    v[fileName] = context(key).default;
  }
  return v;
}, {});

Vue.use(VueI18n);

const locale = (() => {
  const language = browserLocale.toLowerCase().split('-')[0];
    if (languages[language]) {
        return language;
    }
    return 'en';
})();
const messages = { [locale]: getI18nBundle(languages) };
const i18n = new VueI18n({
  locale,
  messages,
});

export default i18n;
