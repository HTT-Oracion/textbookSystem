<template>
  <div class="user-detail">
    <div class="user-avatar">
      <img :src="imgUrl" />
    </div>
    <div class="user-gender">男/ 女</div>
    <div class="user-name">名字}}}</div>
    <div class="user-birth">2020-11-11 出生日期</div>
    <div class="user-phone">联系方式 15914739344</div>
    <div class="user-address">地址 广东培正学院</div>
  </div>
</template>

<script>
export default {
  name: 'UserDetail'
}
</script>

<style lang="less" scoped>
</style>