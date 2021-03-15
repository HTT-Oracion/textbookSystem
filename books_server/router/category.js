module.exports = (app, Category) => {
  const router = require('express').Router()
  router.get('/list', async (req, res) => {
    const cateList = await Category.findAll()
    if (cateList.length === 0) {
      return res.send({ status: 422, msg: '没有数据' })
    }
    return res.send({ status: 200, msg: '查询类别列表成功', result: cateList })
  })
  app.use('/category', router)
}