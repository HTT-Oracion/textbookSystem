<template>
  <el-container class="home-page">
    <el-header>
      <el-button
        class="collapse-btn"
        icon="el-icon-s-fold"
        @click="collapseBtn"
        size="large"
      ></el-button>
      <h1 class="title">教材征订管理系统</h1>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu
          background-color="#f6f6f6"
          text-color="#666666"
          active-text-color="#8dc5e3"
          :default-active="activeIndex"
          :uniqueOpened="true"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <el-submenu
            v-for="(item, index) in navList"
            :key="index"
            :index="item.index"
          >
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.id"
              :index="subItem.index"
            >
              <template slot="title">
                <i :class="subItem.icon"></i>
                <span slot="title">{{ subItem.title }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main><router-view /></el-main>
        <el-footer>教材管理系统 by 吕锦滨 2021.03</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { navList } from '@/utils/setting'
export default {
  name: 'Home',
  data () {
    return {
      navList,
      activeIndex: '',
      isCollapse: false,
    }
  },
  methods: {
    collapseBtn () {
      this.isCollapse = !this.isCollapse
    },
    handleOpen () { },
    handleClose () { },
  }
}
</script>

<style lang="less" scoped>
.home-page {
  .el-header {
    border-bottom: 1px solid #f5f5f5;
    .collapse-btn {
      position: absolute;
      left: 9px;
      top: 10px;
      border-radius: none;
    }
    .title {
      padding-top: 15px;
      font-size: 24px;
    }
  }
  .el-main {
    min-height: 800px;
  }
  .el-menu {
    border-right: none;
  }
}
</style>