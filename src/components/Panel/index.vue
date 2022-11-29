<!--
 * @Author: your name
 * @Date: 2021-10-11 10:39:19
 * @LastEditTime: 2022-03-23 15:49:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \feedback\src\page\components\Navbar.vue
-->
<template>
  <div class="panel" @click="click">
    <div :class="{ border, pl20: badge }" class="extra flex">
      <div class="left flex-item">
        <slot name="left">
          <div class="title ellipsis">
            {{ title }}
          </div>
          <div v-if="remark" class="subtitle ellipsis">备注：{{ remark }}</div>
          <div class="subtitle">{{ desc }}</div>
          <div v-if="leftSubTitle || rightSubTitle" class="subtitle flex pt5">
            <div class="left-text flex-item">{{ leftSubTitle }}</div>
            <div class="right-text flex-item">{{ rightSubTitle }}</div>
          </div>
        </slot>
      </div>
      <div class="right flex-item" @click.stop="clickRight">
        <slot name="right">
          <div class="right-flex">
            <div v-if="rightText" class="text">{{ rightText }}</div>
            <div v-if="icon" class="mlr20 img">
              <img :src="icon" alt="" />
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Panel',
  components: {},
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
      required: true,
    },
    remark: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    rightText: {
      type: String,
      default: ' ',
    },
    clickRight: {
      type: Function,
      default: () => {},
    },
    border: {
      type: Boolean,
      default: false,
    },
    leftSubTitle: {
      type: String,
      default: '',
    },
    rightSubTitle: {
      type: String,
      default: '',
    },
    badge: {
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
    click() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="less" scoped>
.panel {
  background: @bl-white;
  position: relative;
  padding: 16px 16px 16px 36px;
}
.extra {
  padding-top: 14px;
  padding-bottom: 14px;
}
.left {
  flex: 8;
  font-size: 30px;
  min-width: 0;
  line-height: 1.2;
  color: @panel-title-color;
  .subtitle {
    padding-top: 8px;
    color: @panel-subtitle-color;
    font-size: 22px;
    .right-text {
      text-align: right;
    }
  }
}
.right {
  color: @bl-gray-1;
  .right-flex {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .text {
      flex: 1;
      text-align: right;
    }
    .img {
      width: 36px;
    }
    img {
      width: 36px;
      height: 36px;
    }
  }
}
.border {
  border-bottom: @bl-border-width-base @panel-border-color @bl-border-style-base;
}
</style>
