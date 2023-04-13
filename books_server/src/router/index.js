import { Sequelize, connect, User, Book, Category } from "../models";

import * as routerModules from "./modules";

function patchRouter(app) {
  const { user, book, category } = routerModules;
  // 调用路由
  user(app, User);
  book(app, Book, Category, Sequelize);
  category(app, Category);
}

// fix: mysql 创建表失败
// 调用函数强制更新
function forceAsyncConnect() {
  connect.sync({ force: true });
}

export default (app) => {
  forceAsyncConnect();
  patchRouter(app);
};
