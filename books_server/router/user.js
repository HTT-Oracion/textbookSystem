const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
module.exports = (app, User) => {
  const router = require('express').Router()
  const secretKey = require('../key')
  router.get('/list', async (req, res) => {
    const userList = await User.findAll()
    if (userList.length === 0) {
      return res.send({ status: 422, msg: '没有用户' })
    }
    return res.send({ status: 200, msg: '查询用户列表成功', result: userList })
  })
  /* 登录 */
  router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ where: { username } })
    if (!user || user.length === 0) return res.send({ status: 422, msg: '用户不存在!' })
    const isPassword = bcrypt.compareSync(password, user.getDataValue('password'))
    const { level, position } = user
    if (!isPassword) return res.send({ status: 422, msg: '密码错误!' })
    const token = 'Bearer ' + jwt.sign({
      id: user.getDataValue('id')
    }, secretKey, { expiresIn: 3600 * 24 * 3 })
    res.send({ status: 200, result: { token, level, position }, msg: '登录成功!' })
  })
  /* 注册 */
  router.post('/register', async (req, res) => {
    const { id, username, password, phone, email, level, position } = req.body
    const user = await User.findOne({
      where: { username, phone: String(phone) }
    })
    if (user) {
      return res.send({ status: 422, msg: '用户名或手机号码已存在!' })
    } else {
      const newUser = await User.create({
        id,
        username,
        password: bcrypt.hashSync(password, 10),
        phone: String(phone),
        email,
        level,
        position
      })
      res.send({ status: 201, msg: '创建成功!' })
    }
  })
  app.use('/user', router)
}