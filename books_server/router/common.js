module.exports = (app) => {
  app.use('/', async (req, res, next) => {
    const rawToken = req.headers.authorization
    if (req.path === '/user/login' || req.path === '/user/register' || req.path === '/user/register/normal') {
      return next()
    } else if (!rawToken) {
      return res.status(401).send({
        msg: '未登录'
      })
    } else {
      next()
    }
  })
}