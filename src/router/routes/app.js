const Portal = () => import('viewsPath/main/portal.vue'); // 首界面
const Control = () => import('viewsPath/main/control.vue'); // 主控
const Mode = () => import('viewsPath/main/mode.vue'); // 模式
const Experience = () => import('viewsPath/main/experience.vue'); // 体验

const app = [
  {
    path: '/portal',
    name: 'portal',
    show: true,
    component: Portal,
  },
  {
    path: '/control',
    name: 'control',
    show: true,
    component: Control,
  },
  {
    path: '/mode',
    name: 'mode',
    show: true,
    component: Mode,
  },
  {
    path: '/experience',
    name: 'experience',
    show: true,
    component: Experience,
  },
];

export default [...app];
