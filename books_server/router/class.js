const bcrypt = require('bcrypt')
module.exports = (app, Class) => {
  const router = require('express').Router()

  app.use('/user', router)
}