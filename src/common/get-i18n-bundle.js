/*
 * @Author: your name
 * @Date: 2019-11-01 15:48:21
 * @LastEditTime: 2019-11-01 16:44:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-mobile-template\src\common\get-i18n-bundle.js
 */

export const browserLocale = (typeof navigator === 'undefined' ? 'en' :
  ((navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage));
/*
en_xx 返回 en
en  返回 en
*/
const getLanguage = locale => locale.toLowerCase().split('-')[0];
const hasRegionField = locale => locale.split('-').length === 2;
/*
    通过language查找，而不是完整形式language-region
* */
const searchByLanguage = (bundles, language) => {
  const locales = Object.keys(bundles);

  if (bundles[language]) {
    // 如有语言包中有提供 zh,en,jp等字段
    return language;
  }

  // 未找到完整匹配，则查找language-xxx
  let langMatchedLocale;
  for (let i = 0; i < locales.length; i += 1) {
    const locale = locales[i];
    if (getLanguage(locale) === language &&
      (!langMatchedLocale || Object.keys(bundles[langMatchedLocale]).length < Object.keys(bundles[locale]).length)) {
      langMatchedLocale = locale;
    }
  }
  return langMatchedLocale;
};


const bestFitMatch = (bundles, locale) => {
  const locales = Object.keys(bundles);

  if (hasRegionField(locale) && bundles[locale]) {
    // 完整形式,进行简单匹配
    return locale;
  }

  // 匹配失败，根据语言进行查找
  const language = getLanguage(locale);
  let match = searchByLanguage(bundles, language);


  const firstBackup = 'en';
  const secBackup = 'zh';
  if (!match && language !== firstBackup) {
    match = searchByLanguage(bundles, firstBackup);
  }
  if (!match && language !== secBackup) {
    match = searchByLanguage(bundles, secBackup);
  }

  if (!match) {
    // 任意挑选一个文案最多的locale
    match = locales.reduce((mostCompleteLocale, locale) => (!mostCompleteLocale || Object.keys(bundles[locale]).length > Object.keys(bundles[mostCompleteLocale]).length ?
        locale : mostCompleteLocale),
      null);
  }


  return match;
};


/*
 Typically, web apps are localized to just the language or language-region combination.
  Examples of such locale codes are:

    en for English
    en-US for English as spoken in the United States
    en-GB for English as spoken in the United Kingdom
    es-AR for Spanish as spoken in Argentina
    ar-001 for Arabic as spoken throughout the world
    ar-AE for Arabic as spoken in United Arab Emirates

国际化语言匹配规则：
language-region ==> language ==>language-xxx ==> en ==> en_xxx ==> zh ==> zh_xxx ==> 任意一个文案最多的语言

如果根据上面有优先级匹配出的locale是language-region格式，则与其父级（如果存在）进行合并。

*/

export default (bundles, locale = browserLocale) => {
  const lowerCaseBundles = {};
  Object.keys(bundles).forEach(key => {
    lowerCaseBundles[key.toLowerCase()] = bundles[key];
  });

  const bestFitLocale = bestFitMatch(lowerCaseBundles, locale.toLowerCase());
  console.warn('bestFitLocale:', bestFitLocale);

  const bundle = lowerCaseBundles[bestFitLocale];
  // 如果是language-region形式，则和language部分合并（如果存在）
  const parentBundle = hasRegionField(bestFitLocale) ?
    lowerCaseBundles[getLanguage(bestFitLocale)] : null;
  return parentBundle ? {
    ...parentBundle,
    ...bundle
  } : {
    ...bundle
  };
};
