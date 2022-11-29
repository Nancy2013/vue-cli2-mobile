<!--
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditTime: 2022-04-12 13:42:56
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\page\components\__index.vue
-->
<template>
  <div
    :style="{ ...switchStyle }"
    :class="{ 'bl-switch-on': value }"
    class="bl-switch"
    @click="change"
  >
    <div :style="{ ...barStyle }" class="switch-bar"></div>
    <div :style="{ ...nodeStyle }" class="switch-node"></div>
  </div>
</template>
<script>
export default {
  name: 'BLSwitch',
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
    switchWidth: {
      type: Number,
      default: 70,
    },
    switchHeight: {
      type: Number,
      default: 40,
    },
    switchBarHeight: {
      type: Number,
      default: 20,
    },
    switchNodeSize: {
      type: Number,
      default: 40,
    },
    barBackgroundColor: {
      type: String,
      default: '#fff',
    },
    switchOnBackgroundColor: {
      type: String,
      default: '',
    },
    switchNodeBackgroundColor: {
      type: String,
      default: '#fff',
    },
  },
  data() {
    return {};
  },
  computed: {
    switchStyle() {
      // switch
      const { switchWidth, switchHeight, switchNodeSize } = this;
      const style = {
        width: `${switchWidth}px`,
        height: `${switchNodeSize || switchHeight}px`,
      };
      return style;
    },
    barStyle() {
      // swithc-bar
      const { switchBarHeight, barBackgroundColor } = this;
      const style = {
        width: '100%',
        height: `${switchBarHeight}px`,
        backgroundColor: barBackgroundColor,
      };
      return style;
    },
    nodeStyle() {
      // switch-node
      const {
        switchNodeSize,
        switchNodeBackgroundColor,
        value,
        switchWidth,
      } = this;
      const style = {
        width: `${switchNodeSize}px`,
        height: `${switchNodeSize}px`,
        backgroundColor: switchNodeBackgroundColor,
      };
      if (value) {
        style.transform = `translateX(${switchWidth - switchNodeSize}px)`;
      }
      return style;
    },
  },
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
.bl-switch {
  position: relative;
  display: inline-block;
  .switch-bar {
    border-radius: 42px;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    transition: background-color 0.3s;
  }
  .switch-node {
    border-radius: 50%;
    box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.26);
    position: absolute;
    left: 0;
    transition: transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05),
      -webkit-transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05);
  }

  &.bl-switch-on {
    .switch-bar {
      background: @theme-color !important;
    }
  }
}
</style>
