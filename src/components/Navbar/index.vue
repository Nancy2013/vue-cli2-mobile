<!--
 * @Author: your name
 * @Date: 2021-10-11 10:39:19
 * @LastEditTime: 2022-06-17 15:18:56
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: In User Settings Edit
 * @FilePath: \feedback\src\page\components\Navbar.vue
-->
<template>
  <div :style="styleConfig" class="navbox">
    <div :style="{ height: statusHeight + 'px' }" class="statusBar"></div>
    <div class="navbar">
      <div class="left">
        <slot name="left">
          <span @click="clickLeft">
            <span class="plr20">
              <svg
                v-if="leftArrow"
                t="1513131888484"
                viewBox="0 0 1024 1024"
                version="1.1"
                p-id="35302"
                width="200"
                height="200"
              >
                <path
                  :fill="titleColor"
                  d="M451.265164 837.818182l-330.472728-325.818182 330.472728-325.818182a46.545455 46.545455 0 0 0 0-69.818182 50.269091 50.269091 0 0 0-70.749091 0L14.6688 477.090909a48.872727 48.872727 0 0 0 0 69.818182l365.847273 361.192727a49.803636 49.803636 0 0 0 35.374545 14.429091 49.803636 49.803636 0 0 0 35.374546-14.429091 46.545455 46.545455 0 0 0 0-69.818182z"
                  p-id="35303"
                ></path>
              </svg>
              <span :style="{ color: textColor }">{{ leftText }}</span>
            </span>
          </span>
        </slot>
      </div>

      <div :style="{ color: titleColor }" class="center">
        <span class="title">{{ title }}</span>
      </div>

      <div class="right">
        <slot name="right">
          <span v-if="rightIcon || rightText" @click="rightHandle">
            <span v-if="rightIcon" class="plr20">
              <img :src="rightIcon" alt="" />
            </span>
            <span
              v-if="rightText"
              :style="{ color: textColor }"
              class="plr20"
              >{{ rightText }}</span
            >
          </span>
          <span v-if="property" class="plr20" @click="openProperty">
            <svg
              t="1513131881851"
              viewBox="0 0 1024 1024"
              version="1.1"
              p-id="35192"
              width="200"
              height="200"
            >
              <path
                :fill="titleColor"
                d="M232.727273 512m-93.090909 0a93.090909 93.090909 0 1 0 186.181818 0 93.090909 93.090909 0 1 0-186.181818 0Z"
                p-id="35193"
              ></path>
              <path
                :fill="titleColor"
                d="M581.818182 512m-93.090909 0a93.090909 93.090909 0 1 0 186.181818 0 93.090909 93.090909 0 1 0-186.181818 0Z"
                p-id="35194"
              ></path>
              <path
                :fill="titleColor"
                d="M930.909091 512m-93.090909 0a93.090909 93.090909 0 1 0 186.181818 0 93.090909 93.090909 0 1 0-186.181818 0Z"
                p-id="35195"
              ></path>
            </svg>
          </span>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
import { getStatusBar } from 'utilsPath';
import service from 'servicePath/index';
import arrow from '@/components/images/arrow.svg';

const { sdkAsk } = service;

export default {
  name: 'Navbar',
  components: {},
  props: {
    exit: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: arrow,
    },
    leftArrow: {
      type: Boolean,
      default: true,
    },
    leftText: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    rightIcon: {
      type: String,
      default: '',
    },
    rightText: {
      type: String,
      default: '',
    },
    rightHandle: {
      type: Function,
      default: () => {},
    },
    textColor: {
      type: String,
      default: '#000',
    },
    titleColor: {
      type: String,
      default: '#000',
    },
    background: {
      type: String,
      default: '#fff',
    },
    leftHandle: {
      type: Function,
      default: null,
    },
    property: {
      // 是否展示属性按钮
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      getStatusBar,
      statusHeight: 0,
      styleConfig: {},
    };
  },
  computed: {},
  watch: {},
  created() {
    this.setStyle();
    this.setStatusHeight();
  },
  mounted() {
    sdkAsk.hideNavbar();
  },
  methods: {
    async setStatusHeight() {
      const height = await getStatusBar();
      this.statusHeight = height;
    },

    // 设置样式
    setStyle() {
      const { textColor, background } = this;
      const styles = {
        color: textColor,
        background,
      };

      this.styleConfig = Object.assign({}, this.styleConfig, { ...styles });
    },
    // 关闭WebView
    closeWebView() {
      localStorage.clear();
      sdkAsk.closeWebView();
    },
    // 返回
    goback() {
      const { length } = window.history;
      if (length > 1) {
        this.$router.go(-1);
      } else {
        this.closeWebView();
      }
    },
    // 点击返回
    clickLeft() {
      const { exit, leftHandle } = this;
      if (exit) {
        this.closeWebView();
        return;
      }

      if (leftHandle) {
        leftHandle();
        return;
      }

      this.goback();
    },
    // 属性界面
    openProperty() {
      sdkAsk.openDevicePropertyPage();
    },
  },
};
</script>

<style lang="less" scoped>
.navbox {
  width: 100%;
  z-index: @nav-bar-z-index;
  position: fixed;
  top: 0;
  background: @bl-white;
}
.navbar {
  height: @nav-bar-height;
  font-size: 32px;
  display: flex;
  align-items: center;
  div {
    display: inline-block;
  }
}
.left {
  width: 20%;
  padding-left: 16px;
  svg {
    width: 36px;
    height: 64px;
  }
}
.center {
  width: 60%;
  text-align: center;
}
.right {
  width: 20%;
  text-align: right;
  padding-right: 10px;
  svg {
    width: 48px;
    height: 20px;
  }
}
</style>
