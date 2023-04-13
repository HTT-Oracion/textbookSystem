module.exports = (app, Category, Sequelize) => {
  const router = require('express').Router()
  const Op = Sequelize.Op
  router.get('/list', async (req, res) => {
    const query = req.query.query
    console.log(query);
    let whereObj = {
      [Op.or]: [
        { cat_name: { [Op.like]: '%' + query + '%' } }
      ]
    }
    let total = 0
    let dataList = []
    if (query) {
      const { count, rows } = await Category.findAndCountAll({
        raw: true,
        where: whereObj
      })
      total = count
      dataList = rows
    } else {
      const { count, rows } = await Category.findAndCountAll({
      })
      total = count
      dataList = rows
    }
    if (dataList.length === 0) return res.send({ status: 422, msg: '没有任何数据!' })
    return res.send({ status: 200, msg: `获取列表成功`, result: dataList, total })
  })
  router.get('/:id', async (req, res) => {
    const cate = await Category.findOne({
      where: { id: req.params.id }
    })
    if (!cate) return res.send({ status: 400, msg: '查找失败' })
    return res.send({ status: 200, msg: '查找成功', result: cate })
  })
  router.put('/:id', async (req, res) => {
    console.log(req.body, req.params.id);
    const cate = await Category.update(req.body, {
      where: { id: req.params.id }
    })
    if (!cate) return res.send({ status: 400, msg: '修改失败!' })
    return res.send({ status: 200, msg: '修改成功!' })
  })
  router.delete('/:id', async (req, res) => {
    try {
      await Category.destroy({
        where: { id: req.params.id }
      })
      return res.send({ status: 200, msg: '删除成功!' })
    } catch {
      return res.send({ status: 400, msg: '删除失败!' })
    }
  })
  router.post('/add', async (req, res) => {
    const { id } = req.body
    const cate = await Category.findOne({ where: { id } })
    if (cate) return res.send({ status: 400, msg: '相同编号!' })
    try {
      await Category.create(req.body)
      return res.send({ status: 200, msg: '创建成功!' })
    } catch {
      return res.send({ status: 400, msg: '创建失败!' })
    }
  })
  app.use('/category', router)
}