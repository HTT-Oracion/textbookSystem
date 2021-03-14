const bcrypt = require('bcrypt')
module.exports = (app, Department) => {
  const router = require('express').Router()

  app.use('/user', router)
}