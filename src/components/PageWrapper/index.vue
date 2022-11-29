<!--
 * @Author: your name
 * @Date: 2021-09-22 10:19:03
 * @LastEditTime: 2022-06-17 14:58:07
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: In User Settings Edit
 * @FilePath: \feedback\src\page\components\PageWrapper.vue
-->
<template>
  <div :class="{ safeTop }" :style="{ ...setBottom }" class="page">
    <div :style="{ height: statusHeight + 'px' }"></div>
    <slot name="content"></slot>
  </div>
</template>
<script>
import { getStatusBar } from 'utilsPath';
import { isIphoneX, safeAreaBottom } from 'utilsPath/device';

export default {
  name: 'PageWrapper',
  components: {},
  props: {
    safeTop: {
      type: Boolean,
      default: true,
    },
    safeBottom: {
      type: Boolean,
      default: false,
    },
    adapterBottom: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      getStatusBar,
      statusHeight: 0,
    };
  },
  computed: {
    setBottom() {
      const { safeBottom, adapterBottom } = this;
      let style = {};
      if (safeBottom) {
        if (isIphoneX) {
          style.paddingBottom = `calc(${safeAreaBottom}px + 0px)`;
        }
        if (adapterBottom) {
          style = {
            paddingBottom: `calc(0px + ${adapterBottom}px)`,
          };
        }
      }
      return style;
    },
  },
  watch: {},
  created() {
    this.setStatusHeight();
  },
  mounted() {},
  methods: {
    async setStatusHeight() {
      const height = await getStatusBar();
      this.statusHeight = height;
    },
  },
};
</script>

<style lang="less" scoped>
.page {
}
.safeTop {
  padding-top: @nav-bar-height;
}
// .safeBottom {
//   padding-bottom: 44px;
// }
// .safeBottomX {
//   padding-bottom: 88px;
// }
</style>
