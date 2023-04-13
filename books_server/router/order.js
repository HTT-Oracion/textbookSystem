const { Book, Charge, Approval, Department, Lesson, Class, Major } = require('../models')
module.exports = (app, Order, Sequelize) => {
  const router = require('express').Router()
  const Op = Sequelize.Op
  let includeList = [
    { model: Book },
    { model: Lesson },
    { model: Department },
    { model: Charge },
    { model: Approval },
    { model: Class },
    { model: Major }
  ]
  router.get('/list', async (req, res) => {
    const query = req.query.query
    let whereObj = {
      [Op.or]: [
        { book_name: { [Op.like]: '%' + query + '%' } }
      ]
    }
    try {
      const result = await Order.findAll({
        include: includeList
      })
      res.send({ status: 200, msg: '获取数据成功！', result: result })
    } catch (error) {
      console.log(err);
      res.send({ status: 400, msg: '获取数据失败！' })
    }
  })
  router.get('/list/all', async (req, res) => {
    try {
      const result = await Order.findAll({
        include: includeList
      })
      res.send({ status: 200, msg: '获取数据成功！', result: result })
    } catch (error) {
      console.log(err);
      res.send({ status: 400, msg: '获取数据失败！' })
    }
  })
  router.post('/add', async (req, res) => {
    const { bookId, id, departmentId, chargeId, classId, majorId } = req.body
    try {
      await Order.create({
        bookId,
        lessonId: id,
        departmentId,
        chargeId,
        classId,
        majorId,
        charge_status: 1,
        charge_date: Date.now(),
        approval_status: 0,
        id: `order${id}`
      })
      return res.send({ status: 201, msg: '创建成功!' })
    } catch {
      return res.send({ status: 422, msg: '创建失败！' })
    }
  })
  router.get('/:id', async (req, res) => {
    try {
      const result = await Order.findOne({ include: includeList }, { where: { id: req.params.id } })
      console.log(result);
      if (result !== null) {
        return res.send({ status: 200, msg: '获取数据成功!', result: result })
      } else {
        return res.send({ status: 400, msg: '获取失败!' })
      }
    } catch (error) {
      console.log(error);

    }
  })
  // 订购
  router.put('/approval/:id', async (req, res) => {
    try {
      await Order.update({ approvalId: req.body.approvalId, approval_status: 1, approval_date: Date.now() }, {
        where: { id: `order${req.params.id}` }
      })
      res.send({ status: 201, msg: '修改成功!' })
    } catch {
      res.send({ status: 400, msg: '修改失败!' })
    }
  })
  // 入库
  router.put('/warehouse/:id', async (req, res) => {
    try {
      await Order.update({ charge_status: 2 }, {
        where: { id: req.params.id }
      })
      res.send({ status: 201, msg: '修改成功!' })
    } catch {
      res.send({ status: 400, msg: '修改失败!' })
    }
  })
  router.delete('/:id', async (req, res) => {
    const result = await Order.destroy({ where: { id: req.params.id } })
    console.log(result);
    if (result[0] !== 1) {
      return res.send({ status: 400, msg: '删除失败!' })
    }
    return res.send({ status: 200, msg: '删除成功!' })
  })
  app.use('/order', router)
}