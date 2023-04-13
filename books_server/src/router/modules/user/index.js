import { baseRequestSuccessOfModify, extend } from "#utils/index";
import {
  baseSQLErrorHandler,
  baseRequestSuccessOfGet,
  baseRequestFailOfGet,
  requestFailOfPassword,
  getRouter
} from "#utils/index";
import { generateToken, passwordEncryption } from "./helpers";
export default (app, User) => {
  const router = getRouter();

  // 获取用户列表
  router.get("/list", (_, res) => {
    baseSQLErrorHandler(async () => {
      const users = await User.findAll();
      return baseRequestSuccessOfGet(res, users);
    }, res);
  });

  // 登录
  router.get("/login", (req, res) => {
    baseSQLErrorHandler(async () => {
      const { username, password, email } = req.body;
      const where = {};
      username && extend(where, { username });
      email && extend(where, { email });
      const user = await User.findOne({ where });

      if (!user) {
        return baseRequestFailOfGet(res, "用户不存在!");
      }

      const isPasswordSame = password === user.getDataValue("password");

      if (!isPasswordSame) {
        return requestFailOfPassword(res);
      }

      // 生产token
      const token = generateToken({ id: user.getDataValue("id") });
      return baseRequestSuccessOfGet(res, "登录成功", {
        token,
        userInfo: user,
      });
    });
  });

  // 注册
  router.post("/register", (req, res) => {
    baseSQLErrorHandler(async () => {
      const { id, username, password, phone, email, level, position } =
        req.body;
      const where = { username, phone: String(phone) };
      const user = await User.findOne({ where });
      if (user) {
        return baseRequestFailOfGet(res, "用户名或手机号码已存在");
      }

      const query = {
        id,
        username,
        password: passwordEncryption(password),
        phone: String(phone),
        email,
        level,
        position,
      };

      await User.create(query);

      return baseRequestSuccessOfModify(res, "注册成功");
    });
    app.use("/user", router);
  });
};
