import {
  connect,
  User,
  Book,
  Category,
  Department,
  Major,
  Lesson,
  Class as IClass,
  Order
} from '../models'

import * as routerModules from "./modules";

// fix: #1 创建表失败
// 调用函数强制更新
function forceAsyncConnect() {
  // { alter: true }时会做更新操作，但是有时会报错.
  connect.sync({ force: true });
}

// 挂载路由
function mountRouter(app) {
  const { user, book, category, department, major, lesson, class: iClass,order } = routerModules;
  // 调用路由
  user(app, User);
  book(app, Book, Category);
  category(app, Category);
  department(app, Department)
  major(app, Major)
  lesson(app, Lesson)
  iClass(app, IClass)
  order(app, Order)
}


export default (app) => {
  // 首次的时候打开，运行后关闭
  // 会把之前的表删除，重新创建
  // forceAsyncConnect();
  mountRouter(app);
}
