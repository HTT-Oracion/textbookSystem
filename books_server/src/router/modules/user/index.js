import { Charge, Approval, Class, Department, Major, Book, User } from "#src/models";
import {
  getRouter,
  baseSQLErrorHandler,
  baseRequestSuccessOfGet,
  baseRequestFailOfGet,
  baseRequestSuccessOfModify,
  extend,
  baseRequest,
  baseRequestFailOfPost,
  tokenExpiredHandler,
} from "#utils/index";
import { Sequelize } from "sequelize";
import { findUser, checkPassword } from "./helpers";
import { generateToken } from "#src/utils/token";
import { Fail } from "#src/settings/status";
import { getListSQLHandler, getSQLHandler } from "#src/hooks";
import { tokenRE } from "#src/settings/reg";
import { checkTokenValid } from "#src/middleware/auth";
import { setRedisValue } from "#src/redis/client";

const router = getRouter();
export default (app) => {
  const Op = Sequelize.Op;
  // 用户列表
  router.get("/list", (_, res) => {
    getListSQLHandler(res, User);
  });
  // 登录
  router.post("/login", (req, res) => {
    baseSQLErrorHandler(async () => {
      const { username, password } = req.body;
      const user = await findUser(res, { username, password });
      if (!user) return;

      checkPassword(res, password, user, () => {
        const token = generateToken({ id: user.getDataValue("id") });
        baseRequestSuccessOfGet(res, "登陆成功", { token, user });
      });
    }, res);
  });
  // 注册
  router.post("/register", async (req, res) => {
    baseSQLErrorHandler(async () => {
      const { id, username, password, phone, email, level, position } =
        req.body;
      const user = await findUser(
        res,
        { [Op.or]: [{ username }, { phone: String(phone) }] },
        false
      );

      if (user) {
        baseRequestFailOfGet(res, "用户名或手机号码已存在");
      } else {
        const createQuery = {
          id,
          username,
          password,
          phone: String(phone),
          email,
          level,
          position,
        };
        await User.create(createQuery);
        if (level === 2) {
          await Charge.create({ id, username, phone: String(phone) });
        } else if (level === 3) {
          await Approval.create({ id, username, phone: String(phone) });
        }
        baseRequestSuccessOfModify(res, "创建成功");
      }
    }, res);
  });
  // 普通注册
  router.post("/register/normal", (req, res) => {
    baseSQLErrorHandler(async () => {
      const { id, username, password, phone, email } = req.body;
      const user = await findUser(
        res,
        { [Op.or]: [{ username }, { phone: String(phone) }] },
        false
      );
      if (user) {
        baseRequestFailOfGet(res, "用户名或手机号码已存在");
      } else {
        const createQuery = {
          id,
          username,
          password,
          phone: String(phone),
          email,
          level: 4,
          position: "老师",
        };
        await User.create(createQuery);
        baseRequestSuccessOfModify(res, "创建成功");
      }
    }, res);
  });
  //
  router.get("/charge/list", (req, res) => {
    const query = req.query.query,
      pageNum = parseInt(req.query.pageNum) || 1,
      pageSize = parseInt(req.query.pageSize) || 5;
    const searchQuery = {
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
    };
    if (query) {
      const where = {
        [Op.or]: [{ username: { [Op.like]: "%" + query + "%" } }],
      };
      extend(searchQuery, { raw: true, where });
    } else {
      extend(searchQuery, { where: { level: [2, 0] } });
    }

    getListSQLHandler(res, User, {
      searchQuery: searchQuery,
    });
  });
  // 审核列表
  router.get("/approval/list", (req, res) => {
    const query = req.query.query,
      pageNum = parseInt(req.query.pageNum) || 1,
      pageSize = parseInt(req.query.pageSize) || 5;
    const where = {
      [Op.or]: [{ username: { [Op.like]: "%" + query + "%" } }],
      level: [3, 0],
    };
    const searchQuery = {
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
    };
    if (query) {
      extend(searchQuery, { raw: true, where });
    } else {
      extend(searchQuery, { where: { level: [3, 0] } });
    }
    getListSQLHandler(res, User, { searchQuery });
  });
  // 删除用户
  router.delete("/:id", (req, res) => {
    baseSQLErrorHandler(
      async () => {
        const where = { id: req.params.id };
        const user = await findUser(res, where);
        const level = +user.getDataValue("level");
        if (!user) return;

        async function deleteUser() {
          await User.destroy({ where });
        }

        let message = "删除成功";
        switch (level) {
          case 0:
            message = "无法删除管理员账号!";
          case 1:
            await deleteUser();
          case 2:
            await deleteUser();
            await Charge.destroy({ where });
          case 3:
            await deleteUser();
            await Approval.destroy({ where });
          default:
            level === 0
              ? baseRequest(res, Fail.DELETE_REQUEST, message)
              : baseRequestSuccessOfModify(res, "删除成功");
        }
      },
      res,
      "删除失败"
    );
  });
  // 获取用户
  router.get("/:id", (req, res) => {
    getSQLHandler(res, User, {
      searchQuery: { where: { id: req.params.id } }
    })
  });
  // 修改用户
  router.put("/:id", (req, res) => {
    baseSQLErrorHandler(async () => {
      const { level, phone, username } = req.body;
      await User.update(req.body, { where: { id: req.params.id } });
      const updateQuery = [
        { phone, username },
        { where: { id: req.params.id } },
      ];

      async function updateInfo(model) {
        await model.update(...updateQuery);
      }

      if (level === 0) {
        await updateInfo(Charge);
        await updateInfo(Approval);
      } else if (level === 2) {
        await updateInfo(Charge);
      } else if (level === 3) {
        await updateInfo(Approval);
      }
      baseRequestSuccessOfModify(res, "修改成功");
    }, res);
  });
  router.get("/information/:name", (req, res) => {
    baseSQLErrorHandler(async () => {
      const name = req.params.name;
      let result;
      switch (name) {
        case "Book":
          result = await Book.findAndCountAll();
          break;
        case "Class":
          result = await Class.findAndCountAll({ include: { model: Major } });
          break;
        case "Major":
          result = await Major.findAndCountAll({
            include: { model: Department },
          });
          break;
        case "Department":
          result = await Department.findAndCountAll();
          break;
        default:
          break;
      }
      baseRequestSuccessOfGet(res, null, {
        list: result?.rows ?? [],
        total: result?.total ?? 0,
      });
    }, res);
  });
  router.post("/logout", (req, res) => {
    baseSQLErrorHandler(async () => {
      const token = req.headers.token || ''
      let valid
      let rawToken
      if (!token || !tokenRE.test(token)) {
        valid = false
      } else {
        rawToken = token.split(' ')[1]
        valid = await checkTokenValid(token)
      }
      // 如果是合法的token,则保存到redis黑名单里，然后退出登录
      if (valid) {
        setRedisValue(rawToken, rawToken)
      } 
      valid ? baseRequestSuccessOfModify(res, '退出登录成功!')
      : tokenExpiredHandler(res, null, '当前登录状态已过期')
    })
  })
  app.use("/user", router);
};
