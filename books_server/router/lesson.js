const { Book, Class, Major, Department, Charge, Approval } = require('../models')
module.exports = (app, Lesson, Sequelize) => {
  const router = require('express').Router()
  const Op = Sequelize.Op
  let includeList = [
    { model: Book },
    { model: Class },
    { model: Major },
    { model: Department },
    { model: Charge },
    { model: Approval }
  ]
  router.get('/list', async (req, res) => {
    const query = req.query.query,
      pageNum = parseInt(req.query.pageNum) || 1,
      pageSize = parseInt(req.query.pageSize) || 5
    let whereObj = {
      [Op.or]: [
        { lesson_name: { [Op.like]: '%' + query + '%' } }
      ]
    }
    let total = 0
    let dataList = []
    if (query) {
      const { count, rows } = await Lesson.findAndCountAll({
        raw: true,
        where: whereObj,
        offset: (pageNum - 1) * pageSize,
        limit: pageSize,
        include: includeList
      })
      total = count
      dataList = rows
    } else {
      const { count, rows } = await Lesson.findAndCountAll({
        offset: (pageNum - 1) * pageSize,
        limit: pageSize,
        include: includeList
      })
      total = count
      dataList = rows
    }
    if (dataList.length === 0) return res.send({ status: 422, msg: '没有任何数据!' })
    return res.send({ status: 200, msg: `获取列表成功`, result: dataList, total })
  })
  router.post('/add', async (req, res) => {
    const result = await Lesson.findOne({ where: { id: req.body.id } })
    if (result) return res.send({ status: 400, msg: '相同编号!' })
    const lesson = await Lesson.create(req.body)
    if (lesson) {
      return res.send({ status: 201, msg: '创建成功!' })
    }
    return res.send({ status: 400, msg: '创建失败!' })
  })
  router.get('/:id', async (req, res) => {
    const dep = await Lesson.findOne({
      where: { id: req.params.id },
      include: includeList
    })
    if (!dep) return res.send({ status: 400, msg: '查找失败' })
    return res.send({ status: 200, msg: '查找成功', result: dep })
  })
  router.get('/byCharge/:id', async (req, res) => {
    const list = await Lesson.findAll({ where: { chargeId: req.params.id }, include: Book })
    return res.send({ status: 200, msg: '获取列表成功!', result: list })
  })
  router.get('/byApproval/:id', async (req, res) => {
    const list = await Lesson.findAll({ where: { approvalId: req.params.id }, include: Book })
    return res.send({ status: 200, msg: '获取列表成功!', result: list })
  })
  router.put('/:id', async (req, res) => {
    console.log(req.body, req.params.id);
    const result = await Lesson.update(req.body, {
      where: { id: req.params.id }
    })
    if (result) return res.send({ status: 200, msg: '修改成功!' })
    return res.send({ status: 400, msg: '修改失败!' })
    // console.log(result);
    try {
      await Lesson.update(req.body, {
        where: { id: req.params.id }
      })
      return res.send({ status: 200, msg: '修改成功!' })
    }
    catch {
      return res.send({ status: 400, msg: '修改失败!' })
    }
  })
  router.delete('/:id', async (req, res) => {
    try {
      await Lesson.destroy({
        where: { id: req.params.id }
      })
      return res.send({ status: 200, msg: '删除成功!' })
    } catch {
      return res.send({ status: 400, msg: '删除失败!' })
    }
  })
  app.use('/lesson', router)
}