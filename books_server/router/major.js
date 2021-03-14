const bcrypt = require('bcrypt')
module.exports = (app, Major) => {
  const router = require('express').Router()

  app.use('/user', router)
}