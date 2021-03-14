/* 校验规则 */
const checkEmail = (rule, value, callback) => {
  const regEmail = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
  if (regEmail.test(value)) {
    return callback()
  }
  callback(new Error('请输入合法的邮箱！'))
}
const checkMobile = (rule, value, callback) => {
  const mobileReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
  if (mobileReg.test(value)) {
    return callback()
  }
  callback(new Error('请输入合法的手机号！'))
}
export const loginRules = {
  username: [
    { required: true, message: '请输入账号!', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码!', trigger: 'blur' }
  ]
}
// 注册
export const registerRules = {
  username: [
    { required: true, message: '请输入账号!', trigger: 'blur' },
    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码!', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度在6 到 16 个字符', trigger: 'blur' }
  ],
  rePassword: [
  ],
  mobile: [
    { required: true, message: '请输入手机号码!', trigger: 'blur' },
    { validator: checkMobile, trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱!', trigger: 'blur' },
    { validator: checkEmail, trigger: 'blur' }
  ]
}