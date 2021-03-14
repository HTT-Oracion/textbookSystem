<template>
  <div class="login-page">
    <div class="login-box">
      <h1 class="title">用户登录</h1>
      <el-form
        class="login-form"
        label-width="60px"
        :rules="loginFormRules"
        :model="loginForm"
        ref="loginRef"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="loginForm.username"
            clearable
            prefix-icon="el-icon-user-solid"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            clearable
            prefix-icon="el-icon-lock"
            show-password
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button @click="toRegister">注册</el-button>
          <el-button type="primary" @click="confirmLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
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
      loginFormRules: loginRules
    }
  },
  methods: {
    toRegister () {
      this.$router.push('/register')
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
          this.$store.commit('SET_USER', data.result.token)
          this.$store.commit('SET_USER_LEVEL', data.result.level)
          this.$store.commit('SET_USER_POSITION', data.result.position)
          // console.log(this.$store.state);
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
}
</style>