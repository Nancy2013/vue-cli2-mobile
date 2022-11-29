<!--
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditTime: 2022-03-09 13:44:30
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\page\components\__index.vue
-->
<template>
  <div v-if="value" :style="{ ...styleConfig }" class="notify">
    <span>{{ message }}</span>
    <span class="icon" @click="close">
      <img :src="closeIcon" alt="" />
    </span>
  </div>
</template>
<script>
import closeIcon from '@/components/images/close.svg';

export default {
  name: 'Notify',
  components: {},
  model: {
    props: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: '',
    },
    background: {
      type: String,
      default: '#f00',
    },
    onClick: {
      type: Function,
      default: () => {},
    },
    onClose: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      closeIcon,
      styleConfig: {},
    };
  },
  computed: {},
  watch: {},
  created() {
    this.setStyle();
  },
  mounted() {},
  methods: {
    // 设置样式
    setStyle() {
      const { background } = this;
      const styles = {
        background,
      };

      this.styleConfig = Object.assign({}, this.styleConfig, { ...styles });
    },
    // 关闭提示
    close() {
      const { onClose } = this;
      if (onClose) {
        onClose();
      } else {
        localStorage.setItem('hideNotify', true);
        this.$emit('change', false);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.notify {
  text-align: center;
  position: fixed;
  width: 100%;
  color: @bl-white;
  font-size: 30px;
  padding: 45px 0;
  z-index: @notify-z-index;
  span.icon {
    position: absolute;
    right: 36px;
    width: 22px;
    height: 22px;
    padding: 0 20px;
  }
}
</style>
