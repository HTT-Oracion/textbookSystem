<template>
  <div class="register-page">
    <div class="register-box">
      <h1>用户注册</h1>
      <el-form
        class="register-form"
        :rules="registerRules"
        :model="registerForm"
        ref="registerRef"
        label-width="80px"
      >
        <el-form-item prop="username" label="账号">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入账号"
            clearable
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input
            v-model="registerForm.mobile"
            placeholder="请输入手机号"
            clearable
            prefix-icon="el-icon-mobile-phone"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            v-model="registerForm.password"
            placeholder="请输入密码"
            show-password
            type="password"
            clearable
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item prop="rePassword" label="确认密码">
          <el-input
            v-model="rePassword"
            placeholder="请输入密码"
            show-password
            type="password"
            clearable
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input
            v-model="registerForm.email"
            placeholder="请输入邮箱"
            clearable
            prefix-icon="el-icon-message"
          ></el-input>
        </el-form-item>
        <el-form-item prop="position" label="职称">
          <el-select v-model="registerForm.position" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="level" label="性质">
          <el-radio v-model="registerForm.level" :label="0">订购员</el-radio>
          <el-radio v-model="registerForm.level" :label="1">审核员</el-radio>
          <el-radio v-model="registerForm.level" :label="2">普通人员</el-radio>
        </el-form-item>
        <el-form-item class="btns register-btn">
          <el-button type="info" @click="resetForm">重置</el-button>
          <el-button type="primary" @click="confirmRegister">注册</el-button>
        </el-form-item>
        <el-button
          icon="el-icon-arrow-left"
          class="back"
          size="mini"
          @click="$router.back()"
        ></el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
import { nanoid } from 'nanoid'
import { addUserApi } from '@/api/user'
import { errorTip, successTip } from '@/utils/viewTools'
import { registerRules } from '@/utils/validateRules'
export default {
  name: 'Register',
  data () {
    return {
      registerForm: {
        username: '',
        mobile: '',
        password: '',
        email: '',
        position: '',
        level: ''
      },
      registerRules,
      rePassword: '',
      options: [{
        value: '教研室主任',
        label: '教研室主任'
      },
      {
        value: '系主任',
        label: '系主任'
      },
      {
        value: '院长',
        label: '院长'
      },
      {
        value: '学生',
        label: '学生'
      },
      {
        value: '老师',
        label: '老师'
      }
      ]
    }
  },
  methods: {
    resetForm () {
      this.$refs.registerRef.resetFields()
    },
    confirmRegister () {
      this.$refs.registerRef.validate(async valid => {
        if (!valid) {
          return errorTip('请填写完整')
        }
        if (this.rePassword !== this.registerForm.password) return errorTip('请确认两次密码是否一致')
        const form = { id: nanoid(), ...this.registerForm }
        const { data } = await addUserApi(form)
        if (data.status === 201) {
          const { username, password } = this.registerForm
          console.log(username, password);
          successTip('注册成功！')
          setTimeout(() => {
            this.$router.push({ name: 'Login', params: { username, password } })
            this.resetForm()
          }, 1000)
        }
        console.log(data);
      })
    }
  }
}
</script>

<style lang="less" scoped>
.register-page {
  height: 100%;
  background: url('../assets/img/login.jpg');
  background-size: cover;
  .register-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 625px;
    background: #fff;
    box-sizing: border-box;
    .back {
      position: absolute;
      top: 20px;
      left: 5px;
    }
    h1 {
      margin-top: 35px;
      text-align: center;
      font-size: 26px;
      color: rgb(95, 88, 88);
    }
    .register-form {
      width: 100%;
      margin-top: 30px;
      padding: 0 20px;
      box-sizing: border-box;
      .el-input {
        margin: 4px 0;
      }
      .register-btn {
        margin-top: 20px;
      }
    }
  }
}
</style>