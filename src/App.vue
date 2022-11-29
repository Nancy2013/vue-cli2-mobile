<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-26 17:37:54
 * @LastEditTime: 2021-12-23 11:26:09
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div id="appview">
    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Mix from '@/mixins';

const { LocalStorageClearCreaterMix } = Mix;
export default {
  name: 'App',
  components: {},
  mixins: [LocalStorageClearCreaterMix('app')],
  computed: {},
  created() {
    this.sdkReady().then(result => {});
  },
  beforeDestroy() {},
  methods: {
    ...mapActions('app', ['sdkReady']),
  },
};
</script>

<style lang="less"></style>
