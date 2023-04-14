/* 统一管理 model */
import { Sequelize, DataTypes } from "sequelize";
import databaseConfig from "#src/settings/database";

/* Sequelize 实例 */
const connect = new Sequelize(databaseConfig);

// 导入表Model
import user from "./user";
import book from "./book";
import category from "./category";
import department from "./department";
import major from "./major";
import lesson from "./lesson";
import iClass from "./class";
import charge from "./charge";
import approval from "./approval";
import order from "./order";

// 创建表
const User = user(connect, DataTypes);
const Book = book(connect, DataTypes);
const Category = category(connect, DataTypes);
const Department = department(connect, DataTypes);
const Major = major(connect, DataTypes);
const Lesson = lesson(connect, DataTypes);
const Class = iClass(connect, DataTypes);
const Charge = charge(connect, DataTypes);
const Approval = approval(connect, DataTypes);
const Order = order(connect, DataTypes);

// 创建表关系
function createTablesRelations() {
  /* 表关系 */
  /* 后表含有前表的主键。 */
  /* Book */
  Book.hasMany(Lesson);
  Book.hasMany(Order);
  Book.belongsTo(Category);
  /* Category */
  Category.hasMany(Book);
  /* Class */
  Class.hasMany(Lesson);
  Class.hasMany(Order);
  Class.belongsTo(Major);
  /* Lesson */
  Lesson.hasOne(Order);
  Lesson.belongsTo(Book);
  Lesson.belongsTo(Class);
  Lesson.belongsTo(Major);
  Lesson.belongsTo(Department);
  Lesson.belongsTo(Charge);
  Lesson.belongsTo(Approval);
  /* Major */
  Major.hasMany(Class);
  Major.hasMany(Lesson);
  Major.hasMany(Order);
  Major.belongsTo(Department);
  /* Department */
  Department.hasMany(Major);
  Department.hasMany(Lesson);
  Department.hasMany(Order);
  /* Charge */
  Charge.hasMany(Lesson);
  Charge.hasMany(Order);
  /* Approval */
  Approval.hasMany(Lesson);
  Approval.hasMany(Order);
  /* Order */
  Order.belongsTo(Book);
  Order.belongsTo(Charge);
  Order.belongsTo(Approval);
  Order.belongsTo(Lesson);
  Order.belongsTo(Department);
  Order.belongsTo(Class);
  Order.belongsTo(Major);
}

createTablesRelations();

export {
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
};
