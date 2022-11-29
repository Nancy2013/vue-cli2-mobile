<!--
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditTime: 2022-03-30 14:28:39
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\page\components\__index.vue
-->
<template>
  <div :style="{ ...setBottom }" class="fixedBottom">
    <slot name="content"></slot>
  </div>
</template>
<script>
import { isIphoneX, safeAreaBottom } from 'utilsPath/device';

export default {
  name: 'FixedBottom',
  components: {},
  props: {
    safeBottom: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    setBottom() {
      const { safeBottom } = this;
      let style = {};
      if (safeBottom) {
        if (isIphoneX) {
          // 默认为 padding
          style = {
            paddingBottom: `${safeAreaBottom}px`,
          };
          if (safeBottom === 'margin') {
            style = {
              marginBottom: `${safeAreaBottom}px`,
            };
          }
        }
      }
      return style;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.fixedBottom {
  width: 100%;
  position: fixed;
  bottom: 0;
}
</style>
