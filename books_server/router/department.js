module.exports = (app, Department, Sequelize) => {
  const router = require('express').Router()
  const Op = Sequelize.Op
  router.get('/list', async (req, res) => {
    const query = req.query.query,
      pageNum = parseInt(req.query.pageNum) || 1,
      pageSize = parseInt(req.query.pageSize) || 5
    let whereObj = {
      [Op.or]: [
        { cat_name: { [Op.like]: '%' + query + '%' } }
      ]
    }
    let total = 0
    let dataList = []
    if (query) {
      const { count, rows } = await Department.findAndCountAll({
        raw: true,
        where: whereObj,
        offset: (pageNum - 1) * pageSize,
        limit: pageSize
      })
      total = count
      dataList = rows
    } else {
      const { count, rows } = await Department.findAndCountAll({
        offset: (pageNum - 1) * pageSize,
        limit: pageSize
      })
      total = count
      dataList = rows
    }
    if (dataList.length === 0) return res.send({ status: 422, msg: '没有任何数据!' })
    return res.send({ status: 200, msg: `获取列表成功`, result: dataList, total })
  })
  router.post('/add', async (req, res) => {
    const { id } = req.body
    const dep = await Department.findOne({ where: { id } })
    if (dep) return res.send({ status: 401, msg: '相同编号!' })
    try {
      await Department.create(req.body)
      return res.send({ status: 200, msg: '创建成功!' })
    } catch {
      return res.send({ status: 401, msg: '创建失败!' })
    }
  })
  router.get('/:id', async (req, res) => {
    const dep = await Department.findOne({
      where: { id: req.params.id }
    })
    if (!dep) return res.send({ status: 401, msg: '查找失败' })
    return res.send({ status: 200, msg: '查找成功', result: dep })
  })
  router.put('/:id', async (req, res) => {
    console.log(req.body, req.params.id);
    const result = await Department.update(req.body, {
      where: { id: req.params.id }
    })
    if (!result) return res.send({ status: 401, msg: '修改失败!' })
    return res.send({ status: 200, msg: '修改成功!' })
  })
  router.delete('/:id', async (req, res) => {
    try {
      await Department.destroy({
        where: { id: req.params.id }
      })
      return res.send({ status: 200, msg: '删除成功!' })
    } catch {
      return res.send({ status: 400, msg: '删除失败!' })
    }
  })
  app.use('/department', router)
}