
module.exports = (app, Book) => {
  const router = require('express').Router()
  router.get('/list', async (req, res) => {
    const data = await Book.findAll()
    res.send(data)
  })
  app.use('/book', router)
}