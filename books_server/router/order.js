const bcrypt = require('bcrypt')
module.exports = (app, Order) => {
  const router = require('express').Router()

  app.use('/user', router)
}