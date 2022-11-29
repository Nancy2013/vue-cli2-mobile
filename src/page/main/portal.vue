<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-26 17:37:54
 * @LastEditTime: 2022-04-12 15:03:00
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="portal">
    <van-switch v-model="status.pwr === 1" @click="setDeviceStatus" />
    <bl-switch
      v-model="status.pwr === 1"
      :switch-width="100"
      :switch-node-size="50"
      :switch-bar-height="20"
      bar-background-color="#9BD5D6"
      @click="setDeviceStatus"
    />
    <bl-switch v-model="checked" @click="setChecked" />
    <img :src="img" alt="" />
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import img from 'stylesPath/images/404.png';

export default {
  name: 'Portal',
  components: {},
  props: {},
  data() {
    return {
      img,
      checked: true,
    };
  },
  computed: {
    ...mapState('app', ['deviceStatus']),
    ...mapGetters('app', ['status']),
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    ...mapActions('app', ['control']),
    setDeviceStatus() {
      const { pwr } = this.status;
      this.control({ pwr: pwr === 1 ? 0 : 1 });
      localStorage.setItem(
        'status',
        JSON.stringify({ pwr: pwr === 1 ? 0 : 1 })
      );
      // this.$router.push({ name: 'control' });
    },
    setChecked(val) {},
  },
};
</script>

<style lang="less" scoped>
.portal {
  background: url(~stylesPath/images/404.png);
  color: @theme-color;
}
</style>
