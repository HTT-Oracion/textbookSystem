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
  phone: [
    { required: true, message: '请输入手机号码!', trigger: 'blur' },
    { validator: checkMobile, trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱!', trigger: 'blur' },
    { validator: checkEmail, trigger: 'blur' }
  ]
}
// 添加人员
export const addRules = {
  username: [
    { required: true, message: '请输入账号!', trigger: 'blur' },
    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码!', trigger: 'blur' },
    { validator: checkMobile, trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱!', trigger: 'blur' },
    { validator: checkEmail, trigger: 'blur' }
  ],
  position: [
    { required: true, message: '请选择职称!', trigger: 'blur' }
  ],
  id: [
    { required: true, message: '请输入工号!', trigger: 'blur' }
  ]
}
/* 书 */
export const bookRules = {
  ISBN: [
    { required: true, message: '请输入isbn编号!', trigger: 'blur' }
  ],
  book_name: [
    { required: true, message: '请输入书名!', trigger: 'blur' }
  ],
  author: [
    { required: true, message: '请输入作者名!', trigger: 'blur' }
  ],
  publish: [
    { required: true, message: '请输入出版社名!', trigger: 'blur' }
  ],
  date: [
    { required: true, message: '请输入出版日期!', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格!', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择类别!', trigger: 'blur' }
  ]
}
// 添加课程
export const addLessonRules = {
  id: [
    { required: true, message: '请输入课程编号!', trigger: 'blur' },
    { min: 6, message: '长度至少为6个字符', trigger: 'blur' }
  ],
  lesson_name: [
    { required: true, message: '请输入课程名称!', trigger: 'blur' },
  ],
  classId: [
    { required: true, message: '请选择班级!', trigger: 'blur' },
  ],
  majorId: [
    { required: true, message: '请选择专业!', trigger: 'blur' },
  ],
  departmentId: [
    { required: true, message: '请选择院系!', trigger: 'blur' },
  ],
  bookId: [
    { required: true, message: '请选择教材!', trigger: 'blur' },
  ],
  started: [
    { required: true, message: '请输入开课时间!', trigger: 'blur' },
  ],
  teacher_num: [
    { required: true, message: '请输入教师人数!', trigger: 'blur' },
  ],
}