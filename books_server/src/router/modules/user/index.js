import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Charge, Approval, Class, Department, Major, Book } from "#src/models";
import { getRouter, getKey } from "#utils/index";

const router = getRouter();
const secretKey = getKey();
export default (app, User, Sequelize) => {
  const Op = Sequelize.Op;
  router.get("/list", async (req, res) => {
    const userList = await User.findAll();
    if (userList.length === 0) {
      return res.send({ status: 422, msg: "没有用户" });
    }
    return res.send({ status: 200, msg: "查询用户列表成功", result: userList });
  });
  /* 登录 */
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || user.length === 0)
      return res.send({ status: 422, msg: "用户不存在!" });
    const isPassword = bcrypt.compareSync(
      password,
      user.getDataValue("password")
    );
    // const { level, position } = user
    if (!isPassword) return res.send({ status: 422, msg: "密码错误!" });
    const token =
      "Bearer " +
      jwt.sign(
        {
          id: user.getDataValue("id"),
        },
        secretKey,
        { expiresIn: 3600 * 24 * 3 }
      );
    res.send({ status: 200, result: { token, user }, msg: "登录成功!" });
  });
  /* 注册 */
  router.post("/register", async (req, res) => {
    const { id, username, password, phone, email, level, position } = req.body;
    console.log(id, username, password, phone, email, level, position);
    const user = await User.findOne({
      where: { username, phone: String(phone) },
    });
    if (user) {
      return res.send({ status: 422, msg: "用户名或手机号码已存在!" });
    } else {
      await User.create({
        id,
        username,
        password: bcrypt.hashSync(password, 10),
        phone: String(phone),
        email,
        level,
        position,
      });
      if (level === 2) {
        await Charge.create({ id, username, phone: String(phone) });
      } else if (level === 3) {
        await Approval.create({ id, username, phone: String(phone) });
      }
      res.send({ status: 201, msg: "创建成功!" });
    }
  });

  router.post("/register/normal", async (req, res) => {
    const { id, username, password, phone, email } = req.body;
    const user = await User.findOne({
      where: { username, phone: String(phone) },
    });
    if (user) {
      return res.send({ status: 422, msg: "用户名或手机号码已存在!" });
    } else {
      await User.create({
        id,
        username,
        password: bcrypt.hashSync(password, 10),
        phone: String(phone),
        email,
        level: 4,
        position: "老师",
      });
      res.send({ status: 201, msg: "创建成功!" });
    }
  });
  router.get("/charge/list", async (req, res) => {
    const query = req.query.query,
      pageNum = parseInt(req.query.pageNum) || 1,
      pageSize = parseInt(req.query.pageSize) || 5;
    let whereObj = {
      [Op.or]: [{ username: { [Op.like]: "%" + query + "%" } }],
      level: [2, 0],
    };
    let total = 0;
    let resultList = [];
    if (query) {
      const { count, rows } = await User.findAndCountAll({
        raw: true,
        where: whereObj,
        offset: (pageNum - 1) * pageSize,
        limit: pageSize,
      });
      total = count;
      resultList = rows;
    } else {
      const { count, rows } = await User.findAndCountAll({
        where: { level: [2, 0] },
        offset: (pageNum - 1) * pageSize,
        limit: pageSize,
      });
      total = count;
      resultList = rows;
    }
    if (resultList.length === 0)
      return res.send({ status: 422, msg: "没有任数据!" });
    return res.send({
      status: 200,
      msg: `获取列表成功`,
      result: resultList,
      total,
    });
  });
  router.get("/approval/list", async (req, res) => {
    const query = req.query.query,
      pageNum = parseInt(req.query.pageNum) || 1,
      pageSize = parseInt(req.query.pageSize) || 5;
    let whereObj = {
      [Op.or]: [{ username: { [Op.like]: "%" + query + "%" } }],
      level: [3, 0],
    };
    let total = 0;
    let resultList = [];
    if (query) {
      const { count, rows } = await User.findAndCountAll({
        raw: true,
        where: whereObj,
        offset: (pageNum - 1) * pageSize,
        limit: pageSize,
      });
      total = count;
      resultList = rows;
    } else {
      const { count, rows } = await User.findAndCountAll({
        where: { level: [3, 0] },
        offset: (pageNum - 1) * pageSize,
        limit: pageSize,
      });
      total = count;
      resultList = rows;
    }
    if (resultList.length === 0)
      return res.send({ status: 422, msg: "没有任数据!" });
    return res.send({
      status: 200,
      msg: `获取列表成功`,
      result: resultList,
      total,
    });
  });
  router.delete("/:id", async (req, res) => {
    const user = await User.findOne({
      where: { id: req.params.id },
    });
    try {
      switch (user.getDataValue("level")) {
        case 0:
          return res.send({ status: 400, msg: "无法删除管理员账号!" });
        case 2:
          await User.destroy({ where: { id: req.params.id } });
          await Charge.destroy({ where: { id: req.params.id } });
          return res.send({ status: 200, msg: "删除成功!" });
        case 3:
          await User.destroy({ where: { id: req.params.id } });
          await Approval.destroy({ where: { id: req.params.id } });
          return res.send({ status: 200, msg: "删除成功!" });
        case 1:
          await User.destroy({ where: { id: req.params.id } });
          return res.send({ status: 200, msg: "删除成功!" });
        default:
          break;
      }
    } catch (error) {
      return res.send({ status: 400, msg: "删除失败" });
    }
  });
  router.get("/:id", async (req, res) => {
    try {
      const result = await User.findOne({ where: { id: req.params.id } });
      return res.send({ status: 200, msg: "获取数据成功!", result: result });
    } catch (error) {
      console.log(error);
      return res.send({ status: 400, msg: "获取失败!" });
    }
  });
  router.put("/:id", async (req, res) => {
    const { level, phone, username } = req.body;
    try {
      await User.update(req.body, { where: { id: req.params.id } });
      if (level === 0) {
        await Charge.update(
          { phone, username },
          { where: { id: req.params.id } }
        );
        await Approval.update(
          { phone, username },
          { where: { id: req.params.id } }
        );
      } else if (level === 2) {
        await Charge.update(
          { phone, username },
          { where: { id: req.params.id } }
        );
      } else if (level === 3) {
        await Approval.update(
          { phone, username },
          { where: { id: req.params.id } }
        );
      }
      return res.send({ status: 200, msg: "修改成功!" });
    } catch (error) {
      return res.send({ status: 400, msg: "修改失败!" });
    }
  });
  router.get("/information/:name", async (req, res) => {
    const name = req.params.name;
    let infoList = [];
    try {
      switch (name) {
        case "Book":
          infoList = await Book.findAll();
          break;
        case "Class":
          infoList = await Class.findAll({ include: { model: Major } });
          break;
        case "Major":
          infoList = await Major.findAll({ include: { model: Department } });
          break;
        case "Department":
          infoList = await Department.findAll();
          break;
        default:
          break;
      }
      return res.send({ status: 200, msg: "获取成功!", result: infoList });
    } catch {
      return res.send({ status: 400, msg: "获取失败!" });
    }
  });
  app.use("/user", router);
};
