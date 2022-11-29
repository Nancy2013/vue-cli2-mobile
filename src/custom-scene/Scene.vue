<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-26 17:37:54
 * @LastEditTime: 2022-06-27 15:45:16
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 -->
<template>
  <div id="appview">
    <bl-page-wrapper safe-bottom>
      <div slot="content" class="scene">
        <bl-navbar
          :background="'#14726C'"
          :text-color="'#fff'"
          :left-arrow="false"
          :left-handle="cancel"
          :right-handle="save"
          left-text="取消"
          right-text="保存"
        />
      </div>
    </bl-page-wrapper>
  </div>
</template>

<script>
import service from 'servicePath/index';
import { mapState, mapActions, mapGetters } from 'vuex';
import Mix from '@/mixins';

const { sdkAsk } = service;
const { LocalStorageClearCreaterMix } = Mix;
export default {
  name: 'Scene',
  components: {},
  mixins: [LocalStorageClearCreaterMix('scene')],
  computed: {
    ...mapState('scene', ['deviceInfo']),
    ...mapGetters('scene', ['status']),
  },
  created() {
    this.sdkReady().then(async result => {});
  },
  beforeDestroy() {},
  methods: {
    ...mapActions('scene', ['sdkReady', 'saveScene']),
    cancel() {
      // 取消
      sdkAsk.closeWebView();
    },
    save() {
      // 保存
      const { status } = this;
      // this.saveScene(status);
      this.saveScene({ pwr: 1 });
    },
  },
};
</script>

<style lang="less"></style>
