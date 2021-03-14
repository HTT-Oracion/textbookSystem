module.exports = app => {
  const {
    Sequelize,
    connect,
    User,
    Book,
    Category,
    Department,
    Major,
    Lesson,
    Class,
    Charge,
    Approval,
    Order
  } = require('../models')
  connect.sync()
  require('./user')(app, User)
  require('./book')(app, Book)
  require('./category')(app, Category)
  require('./department')(app, Department)
  require('./major')(app, Major)
  require('./lesson')(app, Lesson)
  require('./class')(app, Class)
  require('./order')(app, Order)
  // require('./Class')(app,Class)
  // require('./Class')(app,Class)
}