// /* 统一管理 model */
// const { Sequelize, DataTypes } = require('sequelize')
// const config = require('../config')
// /* Sequelize 实例 */
// const connect = new Sequelize(config)
// /* 导入表 */
// const User = require('./user')(connect, DataTypes)
// const Book = require('./book')(connect, DataTypes)
// const Category = require('./category')(connect, DataTypes)
// const Department = require('./department')(connect, DataTypes)
// const Major = require('./major')(connect, DataTypes)
// const Lesson = require('./lesson')(connect, DataTypes)
// const Class = require('./class')(connect, DataTypes)
// const Charge = require('./charge')(connect, DataTypes)
// const Approval = require('./approval')(connect, DataTypes)
// const Order = require('./order')(connect, DataTypes)
// /* 表关系 */
// Book.hasOne(Order)
// Category.hasMany(Book)
// Department.hasMany(Major)
// Department.hasMany(Order)
// Major.hasMany(Class)
// Major.hasMany(Lesson)
// Major.hasMany(Order)
// Class.hasMany(Lesson)
// Lesson.hasOne(Order)
// Charge.hasMany(Lesson)
// Charge.hasMany(Order)
// Approval.hasMany(Order)
// Approval.hasMany(Lesson)

// Book.belongsTo(Category)
// Major.belongsTo(Department)
// // Class.belongsTo(Major)
// Lesson.belongsTo(Class)
// Lesson.belongsTo(Charge)
// Lesson.belongsTo(Approval)
// Order.belongsTo(Book)
// Order.belongsTo(Department)
// Order.belongsTo(Major)
// Order.belongsTo(Lesson)
// Order.belongsTo(Charge)
// Order.belongsTo(Approval)

// // Class.sync({ force: true })
// module.exports = {
//   Sequelize,
//   connect,
//   User
// }