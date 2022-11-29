/*
 * @Author: your name
 * @Date: 2021-10-21 16:42:16
 * @LastEditTime: 2022-03-28 17:54:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \feedback\src\mixins\resize.js
 */
export default which => ({
  data() {
    return {
      styleObj: {},
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {
    getHeight(classStr) {
      let domHeight = 0;
      if (classStr) {
        const dom = this.$el.querySelector(classStr);
        domHeight = dom.scrollHeight;
      }
      return domHeight;
    },
  },
});
