module.exports = (app) => {
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
    Order,
  } = require("../models");
  connect.sync({ force: true });
  require("./user")(app, User, Sequelize);
  require("./book")(app, Book, Sequelize);
  require("./category")(app, Category, Sequelize);
  require("./department")(app, Department, Sequelize);
  require("./major")(app, Major, Sequelize);
  require("./lesson")(app, Lesson, Sequelize);
  require("./class")(app, Class, Sequelize);
  require("./order")(app, Order, Sequelize);
  // require('./Class')(app,Class)
  // require('./Class')(app,Class)
};
