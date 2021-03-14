const bcrypt = require('bcrypt')
module.exports = (app, Lesson) => {
  const router = require('express').Router()

  app.use('/user', router)
}