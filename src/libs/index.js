const context = require.context('./', true, /index\.js$/);

const libs = context.keys().reduce((lib, key) => {
  if (key !== './index.js' && !key.includes('.delete')) {
    lib.push(context(key).default);
  }
  return lib;
}, []);

export default (Vue) => {
  libs.forEach(lib => lib(Vue));
};
