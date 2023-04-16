# textbookSystem

教材征订管理系统 Vue

## 前端

```
使用 vue2 element vuex

```

## 后端

```
 express jsonwebtoken mysql sequelize(用于操作mysql)

 https://sequelize.org/
```

## 项目运行

```
前端： 进入`books_web`: 先执行 `npm install`，完成后 执行`npm run start`

后端： 进入`books_server`: 先执行 `npm install`，完成后 执行`npm run start`
```

## 注意事项

```
1.先到 books_server目录下的 config.js 查看当前数据库配置，先创建对应的数据库
2.请确保已经安装和运行mysql
3.请确保已经安装和运行redis
```

## 存在问题

1. 由于本项目是本人做毕业设计时匆忙写的，因此存在很多不规范，代码和功能上也会存在问题，如有特别大的 bug 可以提 issuse，看到的话有空就会改一下（改得了的话）
2. 目前项目前端后端并没有做 token 校验，是我忘了，可以自己加上
3. （ps:）我也没想到会有人会用这个项目，这个项目虽然不成熟，但是还是很感谢使用。

## 重构计划: TODO

目前发现之前的功能代码没有提交。。计划重构一下项目并且

```
- 前端：
 1. 新增一个 `books_web_react`，使用react重写前端部分，正好用于练习react
 2. 新增 `echarts`用例
 3. 代码抽离优化，前端添加token失效重定向，路由中间件等.
 4. 密码不使用明文传递
 5. 高度组件化
- 后端
 1. 后端统一切换成 `esm`模块
 2. `token`校验中间件
 3. 代码抽离优化
 4. 退出登录后token失效
 5. id原本是由前端传递，改成后端生成
```

## 重构进度
### 后端部分
- [x] 后端统一切换成 `esm`模块
- [x] 模块重构 暂时告一段落 
  - [x] 新增 hooks 统一处理操作类似的增删改查操作
  - [x] user
  - [x] book
  - [x] category
  - [x] order
  - [x] major
  - [x] lesson
  - [x] department
  - [x] class
- [x] token校验中间件
- [x] 代码抽离优化
- [x] 退出登录后，使用redis保存token到黑名单，避免退出登录后token还可用的情况.

### 前端部分

- 请求返回值字段优化
- 使用React重构
- 增加`echarts`