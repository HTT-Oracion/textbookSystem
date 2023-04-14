import { Charge, Approval, Class, Department, Major, Book } from "#src/models";
import {
  getRouter,
  baseSQLErrorHandler,
  baseRequestSuccessOfGet,
  baseRequestFailOfGet,
  baseRequestSuccessOfModify,
  extend,
  baseRequest,
} from "#utils/index";
import { findUser, checkPassword } from "./helpers";
import { generateToken } from "#src/utils/token";
import { Fail } from "#src/settings/status";

const router = getRouter();
export default (app, User, Sequelize) => {
  const Op = Sequelize.Op;
  // 用户列表
  router.get("/list", (_, res) => {
    baseSQLErrorHandler(async () => {
      const list = await User.findAll();
      baseRequestSuccessOfGet(res, null, { list: list ?? [] });
    });
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
    });
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
    });
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
    });
  });
  //
  router.get("/charge/list", (req, res) => {
    baseSQLErrorHandler(async () => {
      const query = req.query.query,
        pageNum = parseInt(req.query.pageNum) || 1,
        pageSize = parseInt(req.query.pageSize) || 5;
      const where = {
        [Op.or]: [{ username: { [Op.like]: "%" + query + "%" } }],
      };
      const findQuery = {
        offset: (pageNum - 1) * pageSize,
        limit: pageSize,
      };
      if (query) {
        extend(findQuery, { raw: true, where });
      } else {
        extend(findQuery, { where: { level: [2, 0] } });
      }

      const { count, rows } = await User.findAndCountAll(findQuery);
      baseRequestSuccessOfGet(res, "查询成功", { list: rows, total: count });
    });
  });
  // 审核列表
  router.get("/approval/list", (req, res) => {
    baseSQLErrorHandler(async () => {
      const query = req.query.query,
        pageNum = parseInt(req.query.pageNum) || 1,
        pageSize = parseInt(req.query.pageSize) || 5;
      const where = {
        [Op.or]: [{ username: { [Op.like]: "%" + query + "%" } }],
        level: [3, 0],
      };
      const findQuery = {
        offset: (pageNum - 1) * pageSize,
        limit: pageSize,
      };
      if (query) {
        extend(findQuery, { raw: true, where });
      } else {
        extend(findQuery, { where: { level: [3, 0] } });
      }

      const { count, rows } = await User.findAndCountAll(findQuery);
      baseRequestSuccessOfGet(res, "查询成功", { list: rows, total: count });
    });
  });
  // 删除用户
  router.delete("/:id", (req, res) => {
    baseSQLErrorHandler(async () => {
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
    });
  });
  // 获取用户
  router.get("/:id", (req, res) => {
    baseSQLErrorHandler(async () => {
      const user = await findUser(res, { id: req.params.id });
      if (user) {
        baseRequestSuccessOfGet(res, "获取成功");
      }
    });
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
    });
  });
  router.get("/information/:name", (req, res) => {
    baseSQLErrorHandler(async () => {
      const name = req.params.name;
      let list = [];
      switch (name) {
        case "Book":
          list = await Book.findAll();
          break;
        case "Class":
          list = await Class.findAll({ include: { model: Major } });
          break;
        case "Major":
          list = await Major.findAll({ include: { model: Department } });
          break;
        case "Department":
          list = await Department.findAll();
          break;
        default:
          break;
      }
      baseRequestSuccessOfGet(res, null, { list });
    });
  });
  app.use("/user", router);
};
