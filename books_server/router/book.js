
const { Category } = require('../models')
module.exports = (app, Book, Sequelize) => {
  const router = require('express').Router()
  const Op = Sequelize.Op
  router.get('/list', async (req, res) => {
    const query = req.query.query,
      pageNum = parseInt(req.query.pageNum) || 1,
      pageSize = parseInt(req.query.pageSize) || 5
    let whereObj = {
      [Op.or]: [
        { book_name: { [Op.like]: '%' + query + '%' } }
      ]
    }
    let total = 0
    let bookList = []
    if (query) {
      const { count, rows } = await Book.findAndCountAll({
        raw: true,
        where: whereObj,
        include: [{ model: Category }],
        offset: (pageNum - 1) * pageSize,
        limit: pageSize
      })
      total = count
      bookList = rows
    } else {
      const { count, rows } = await Book.findAndCountAll({
        include: [{ model: Category }],
        offset: (pageNum - 1) * pageSize,
        limit: pageSize
      })
      total = count
      bookList = rows
    }
    if (bookList.length === 0) return res.send({ status: 422, msg: '没有任何教材!' })
    return res.send({ status: 200, msg: `获取文章列表成功`, result: bookList, total })
  })
  router.get('/:id', async (req, res) => {
    const book = await Book.findOne({ where: { id: req.params.id } })
    if (!book) return res.send({ status: 401, msg: '找不到该书相关信息' })
    return res.send({ status: 200, msg: '获取教材详情成功', result: book })
  })
  router.put('/:id', async (req, res) => {
    const book = await Book.update(req.body, {
      where: { id: req.params.id }
    })
    if (!book) return res.send({ status: 401, msg: '修改失败!' })
    return res.send({ status: 200, msg: '修改成功!' })
  })
  router.delete('/:id', async (req, res) => {
    try {
      await Book.destroy({
        where: { id: req.params.id }
      })
      return res.send({ status: 200, msg: '删除成功!' })
    } catch {
      return res.send({ status: 400, msg: '删除失败!' })
    }
  })
  router.post('/add', async (req, res) => {
    const { id, ISBN, book_name, author, publish, date, price, category } = req.body
    const cate = await Book.findOne({
      where: { ISBN }
    })
    if (cate) {
      return res.send({ status: 422, msg: '相同ISBN编号' })
    } else {
      const newCate = await Book.create({
        id,
        ISBN,
        book_name,
        author,
        publish,
        date,
        price,
        nums: 0,
        times: 0,
        categoryId: category
      })
      if (!newCate) return res.send({ status: 400, msg: '请求参数错误' })
      return res.send({ status: 201, msg: '添加教材成功！' })
    }

  })
  router.get('/:id', async (req, res) => {
    const result = await Book.findOne({
      where: { id: req.params.id }
    })
    if (!result) return res.send({ status: 400, msg: '查找失败' })
    return res.send({ status: 200, msg: '查找成功', result: result })
  })
  router.put('/:id', async (req, res) => {
    // console.log(req.body, req.params.id);
    const result = await Book.update(req.body, {
      where: { id: req.params.id }
    })
    if (!result) return res.send({ status: 400, msg: '修改失败!' })
    return res.send({ status: 200, msg: '修改成功!' })
  })
  router.put('/num/:id', async (req, res) => {
    try {
      const result = await Book.update({
        times: req.body.times,
        nums: req.body.nums
      }, {
        where: { id: req.params.id }
      })
      if (result[0] === 1) {
        return res.send({ status: 201, msg: '修改成功!' })
      } else {
        res.send({ status: 400, msg: '修改失败!' })
      }
    } catch (error) {
      console.log(error);
      res.send({ status: 400, msg: '修改失败!' })
    }
  })
  router.delete('/:id', async (req, res) => {
    try {
      await Book.destroy({
        where: { id: req.params.id }
      })
      return res.send({ status: 200, msg: '删除成功!' })
    } catch {
      return res.send({ status: 400, msg: '删除失败!' })
    }
  })
  app.use('/book', router)
}