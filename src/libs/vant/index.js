/*
 * @Description: 按需引用ant design vue组件
 * @Author: your name
 * @LastEditors: Please set LastEditors
 * @Date: 2019-05-07 17:10:38
 * @LastEditTime: 2021-12-10 16:54:17
 */

import Button from 'vant/lib/button';
import Dialog from 'vant/lib/dialog';
import Row from 'vant/lib/row';
import Col from 'vant/lib/col';
import Toast from 'vant/lib/toast';
import Switch from 'vant/lib/switch';
import Overlay from 'vant/lib/overlay';

export default Vue => {
  Vue.use(Dialog);
  Vue.use(Button);
  Vue.use(Row).use(Col);
  Vue.use(Toast);
  Vue.use(Switch);
  Vue.use(Overlay);
};
