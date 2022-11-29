import Vue from 'vue';
import Router from 'vue-router';
import Home from 'viewsPath/home/index.vue';

const context = require.context('./routes', false, /^\.\/(?!index)[^/]*\.js$/);

const childrenRoutes = context.keys().reduce((rs, key) => {
  rs.push(...context(key).default);
  return rs;
}, []);

Vue.use(Router);

export const routes = [
  {
    path: '/',
    component: Home,
    name: 'home',
    redirect: '/portal',
    children: childrenRoutes,
  },
  {
    path: '*',
    show: false,
    redirect: '/portal',
  },
];
const router = new Router({
  routes,
});
export default router;
