<!--
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditTime: 2022-04-26 09:55:39
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\page\components\__index.vue
-->
<template>
  <div class="bl-slider" @click="change"></div>
</template>
<script>
export default {
  name: 'BLSlider',
  components: {},
  model: {
    props: 'value',
    event: 'click',
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    change() {
      const { value } = this;
      this.$emit('click', !value);
    },
  },
};
</script>

<style lang="less" scoped>
.bl-slider {
}
</style>
