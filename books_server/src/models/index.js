/* 统一管理 model */
import { Sequelize, DataTypes } from "sequelize";
import databaseConfig from "#src/settings/database";
// Sequelize 实例
const connect = new Sequelize(databaseConfig);

// 导入表
import user from "./user";
import book from "./book";
import category from "./category";
import department from "./department";
import major from "./major";
import lesson from "./lesson";
import classs from "./class";
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
const Class = classs(connect, DataTypes);
const Charge = charge(connect, DataTypes);
const Approval = approval(connect, DataTypes);
const Order = order(connect, DataTypes);

function createTablesRelations() {
  /* 表关系 */
  /* 后面还有前面的主键。 */
  /* Book */
  Book.hasMany(Lesson);
  Book.hasMany(Order);
  Book.belongsTo(Category);
  /* Category */
  Category.hasMany(Book);
  /* Class */
  Class.hasMany(Lesson);
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
}

createTablesRelations()

export {
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
};
