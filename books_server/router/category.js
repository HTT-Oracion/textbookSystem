const bcrypt = require('bcrypt')
module.exports = (app, Category) => {
  const router = require('express').Router()
  router.get('/list', async (req, res) => {
    const data = await Category.findAll()
    res.send(data)
  })
  app.use('/category', router)
}