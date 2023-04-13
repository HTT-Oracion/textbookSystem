<template>
  <div class="person-level">
    <el-dropdown :hide-on-click="false" @command="handleCommand">
      <span>
        当前用户：{{ user.username
        }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item disabled
          >用户类型：{{ position[user.level] }}</el-dropdown-item
        >
        <el-dropdown-item command="logout"
          ><i class="el-icon-s-fold"></i>退出</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'PersonLevel',
  data () {
    return {
      position: ['系统管理员', '教材管理员', '订购员', '审批员', '普通用户']
    }
  },
  methods: {
    handleCommand (command) {
      if (command !== 'logout') return
      this.$router.push('/login')
      this.$store.commit('SET_USER', '')
      this.$store.commit('SET_USER_TOKEN', {})
    }
  }
}
</script>

<style lang="less" scoped>
.person-level {
  position: absolute;
  right: 9px;
  top: 20px;
  color: #ccc8bf;
  cursor: pointer;
  .el-dropdown {
    font-size: 16px;
    color: #ccc8bf;
    font-weight: 700;
  }
}
</style>