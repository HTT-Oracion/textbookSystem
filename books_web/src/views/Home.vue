<template>
  <el-container class="home-page">
    <el-header>
      <div class="collapse-btn">
        <i class="el-icon-s-fold" @click="collapseBtn" size="large"></i>
      </div>
      <h1 class="title">教材征订管理系统</h1>
      <person-level></person-level>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu
          background-color="#222d32"
          text-color="#b8c7c4"
          active-text-color="#9cdcfe"
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
      <el-container class="main-container">
        <el-main><router-view /></el-main>
        <el-footer>教材管理系统 by 吕锦滨 2021.03</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import PersonLevel from '@/components/PersonLevel'
import { navList } from '@/utils/setting'
export default {
  name: 'Home',
  components: {
    PersonLevel
  },
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
  position: relative;
  .el-header {
    background-color: #343742;
    color: #d1cfd2;
    .collapse-btn {
      width: 62px;
      height: 58px;
      position: absolute;
      top: 0;
      left: 0;
      color: #fff;
      cursor: pointer;
      i {
        font-size: 25px;
        line-height: 60px;
      }
    }
    .title {
      padding-top: 15px;
      font-size: 24px;
    }
  }
  .main-container {
    position: relative;
    padding-bottom: 40px;
    min-height: 90vh;
    .el-footer {
      text-align: center;
      height: 50px;
      line-height: 50px;
      width: 100%;
      color: #666697;
      background-color: #fff;
      border: 1px solid #f5f5f5;
      position: fixed;
      bottom: 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      z-index: 999;
    }
  }
  .el-aside {
    min-height: calc(100vh - 60px);
    background: #222d32;
  }
  .el-menu {
    border-right: none;
  }
}
</style>