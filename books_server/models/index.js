/* 统一管理 model */
const { Sequelize, DataTypes } = require('sequelize')
const config = require('../config')
/* Sequelize 实例 */
const connect = new Sequelize(config)
/* 导入表 */
const User = require('./user')(connect, DataTypes)
const Book = require('./book')(connect, DataTypes)
const Category = require('./category')(connect, DataTypes)
const Department = require('./department')(connect, DataTypes)
const Major = require('./major')(connect, DataTypes)
const Lesson = require('./lesson')(connect, DataTypes)
const Class = require('./class')(connect, DataTypes)
const Charge = require('./charge')(connect, DataTypes)
const Approval = require('./approval')(connect, DataTypes)
const Order = require('./order')(connect, DataTypes)
/* 表关系 */
/* 后面还有前面的主键。 */
/* Book */
Book.hasMany(Lesson)
Book.hasMany(Order)
/* Category */
Category.hasMany(Book)
/* Class */
Class.hasMany(Lesson)

/* Lesson */
Lesson.hasOne(Order)
/* Major */
Major.hasMany(Class)
Major.hasMany(Lesson)
/* Department */
Department.hasMany(Major)
Department.hasMany(Lesson)
Department.hasMany(Order)
/* Charge */
Charge.hasMany(Lesson)
Charge.hasMany(Order)
/* Approval */
Approval.hasMany(Lesson)
Approval.hasMany(Order)
/* Order */
module.exports = {
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
}