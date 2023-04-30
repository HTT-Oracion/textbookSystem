import * as routerModules from "./modules";
import { forceAsyncConnect } from "#src/utils";

// 挂载路由
function mountRouter(app) {
  // 调用路由
  Object.keys(routerModules).map(key => {
    const module = routerModules[key]
    module(app)
  })
}


export default (app) => {
  // 首次的时候打开，运行后关闭
  // 会把之前的表删除，重新创建
  // forceAsyncConnect();
  mountRouter(app);
}
