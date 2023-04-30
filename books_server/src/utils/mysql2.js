import { connect } from "#src/models";

// fix: #1 创建表失败
// 调用函数强制更新
export function forceAsyncConnect() {
  // { alter: true }时会做更新操作，但是有时会报错.
  connect.sync({ force: true });
}
