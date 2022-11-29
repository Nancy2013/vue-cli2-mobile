/*
 * @Description: 界面公共方法
 * @Author: your name
 * @Date: 2019-05-17 11:08:07
 * @LastEditTime: 2019-10-18 14:26:45
 * @LastEditors: Please set LastEditors
 */
import { mapState, mapGetters, mapMutations } from 'vuex';
import service from 'servicePath/index';


export default which => ({
  data() {
    return {
      [`${which}`]: {
      },
    };
  },
  computed: {
    ...mapState('app', ['left', 'right', 'deviceName']),
  },
  created() {},

  methods: {
    // 设置头部导航
    setNavBar(text) {
      const { left, right, deviceName } = this;
      const params = {
        left,
        center: { text: deviceName },
        right,
      };
      console.log(params);
      this.$store.dispatch('setNavBar', params);
    },
  },
});
