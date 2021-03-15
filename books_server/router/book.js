
module.exports = (app, Book, Category, Sequelize) => {
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
  router.post('/add', async (req, res) => {
    const { id, ISBN, book_name, author, publish, date, price, category } = req.body
    console.log(id, ISBN, book_name, author, publish, date, price, category);
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
      if (!newCate) return res.send({ status: 401, msg: '请求参数错误' })
      return res.send({ status: 201, msg: '添加教材成功！' })
    }

  })
  app.use('/book', router)
}