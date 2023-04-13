<template>
  <div class="login-page">
    <div class="login-box">
      <h1 class="title">用户登录</h1>
      <el-form class="login-form" label-width="60px" :rules="loginFormRules" :model="loginForm" ref="loginRef">
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username" clearable prefix-icon="el-icon-user-solid" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" clearable prefix-icon="el-icon-lock" show-password placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button @click="selectCharacter = true">注册</el-button>
          <el-button type="primary" @click="confirmLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="选择身份" :visible.sync="selectCharacter" width="20%" top="40vh" class="select-character">
      <!-- 选择角色 -->
      <el-select v-model="selectValue" placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-input placeholder="请输入管理密码" v-model="adminPassword" v-if="selectValue === 0"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectCharacter = false">取 消</el-button>
        <el-button type="primary" @click="checkAdminPsw">确 定</el-button>
        <!-- popover 弹窗 -->
        <!--      <el-popover placement="top" width="160" v-model="visible" trigger="click">
          <el-input placeholder="请输入管理密码" v-model="adminPassword"></el-input>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="checkPassword">确定</el-button>
          </div>
          <el-button type="primary" @click="toRealRegister" slot="reference">确 定</el-button>
        </el-popover>-->
      </span>
    </el-dialog>
    <!-- <el-dialog :visible.sync="visible" class="inputadminPsw" width="15%" top="40vh">
      
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="visible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="checkAdminPsw">确定</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>


<script>
import { loginApi } from '@/api/user'
import { errorTip, successTip } from '@/utils/viewTools'
import { loginRules } from '@/utils/validateRules'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      options: [{
        label: '管理人员',
        value: 0
      },
      {
        label: '学生老师',
        value: 1
      }],
      loginFormRules: loginRules,
      adminPassword: '',
      selectCharacter: false,
      visible: false,
      selectValue: 0
    }
  },
  methods: {
    // openPswDiaglog () {
    //   if (this.selectValue === 0) {
    //     this.$store.commit('SET_ADMIN_REGISTER', true)
    //     this.visible = true
    //   } else if (this.selectValue === 1) {
    //     this.$store.commit('SET_ADMIN_REGISTER', false)
    //     this.toRegister()
    //   }
    // },
    toRegister () {
      this.$router.push('/register')
    },
    // 检查管理密码
    checkAdminPsw () {
      if (this.selectValue === 0) {
        if (this.adminPassword === '888888') {
          this.$store.dispatch('COMMIT_ADMIN_REGISTER', true)
          this.toRegister()
        } else {
          return this.$message.error('密码错误!')
        }
      } else if (this.selectValue === 1) {
        this.$store.dispatch('COMMIT_ADMIN_REGISTER', false)
        this.toRegister()
      }
    },

    confirmLogin () {
      this.$refs.loginRef.validate(async valid => {
        if (!valid) {
          return errorTip('请输入完整！')
        }
        const { data } = await loginApi(this.loginForm)
        console.log(data);
        if (data.status === 200) {
          successTip('登录成功！')
          this.$store.commit('SET_USER', data.result.user)
          this.$store.commit('SET_USER_TOKEN', data.result.token)
          this.$router.push({ name: 'Home' })
          this.$refs.loginRef.resetFields()
        }
      })
    },
    loginInfo () {
      console.log(this.$route.params);
      if (this.$route.params) {
        const { username, password } = this.$route.params
        this.loginForm.username = username
        this.loginForm.password = password
      }
    }
  },
  created () {
    this.loginInfo()
  }
}
</script>

<style lang="less" scoped>
.login-page {
  height: 100%;
  background: url('../assets/img/login.jpg');
  background-size: cover;
  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    h1 {
      margin-top: 45px;
      text-align: center;
      font-size: 26px;
      color: rgb(95, 88, 88);
    }
    .login-form {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 0 20px;
      box-sizing: border-box;
      .el-input {
        margin: 2px 0;
      }
    }
  }
  .select-character {
    .el-input {
      margin-top: 10px;
    }
  }
}
</style>