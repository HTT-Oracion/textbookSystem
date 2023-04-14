import { Sequelize } from "sequelize";
import {
  Book,
  Charge,
  Approval,
  Department,
  Lesson,
  Class,
  Major,
} from "#src/models";
import {
  baseRequest,
  baseRequestFailOfGet,
  baseRequestSuccessOfGet,
  baseRequestSuccessOfModify,
  baseSQLErrorHandler,
  getRouter,
} from "#utils/index";
import { Fail, statusMap } from "#src/settings/status";
const router = getRouter();
const Op = Sequelize.Op;
export default (app, Order) => {
  let includeList = [
    { model: Book },
    { model: Lesson },
    { model: Department },
    { model: Charge },
    { model: Approval },
    { model: Class },
    { model: Major },
  ];
  router.get("/list", (req, res) => {
    baseSQLErrorHandler(async () => {
      const query = req.query.query;
      let where = {
        [Op.or]: [{ book_name: { [Op.like]: "%" + query + "%" } }],
      };
      const result = await Order.findAll({
        where,
        include: includeList,
      });
      baseRequestFailOfGet(res, null, {
        list: result.rows,
        total: result.total,
      });
    }, res);
  });
  router.get("/list/all", async (_, res) => {
    baseSQLErrorHandler(async () => {
      const result = await Order.findAll({
        include: includeList,
      });
      baseRequestFailOfGet(res, null, {
        list: result.rows,
        total: result.total,
      });
    }, res);
  });
  router.post("/add", (req, res) => {
    baseSQLErrorHandler(async () => {
      const { bookId, id, departmentId, chargeId, classId, majorId } = req.body;
      const result = await Order.create({
        bookId,
        lessonId: id,
        departmentId,
        chargeId,
        classId,
        majorId,
        charge_status: 1,
        charge_date: Date.now(),
        approval_status: 0,
        id: `order${id}`,
      });
      !result
        ? baseRequest(res, statusMap.get(Fail.POST_REQUEST), "创建失败")
        : baseRequestSuccessOfModify(res, "创建成功");
    }, res);
  });
  router.get("/:id", (req, res) => {
    baseSQLErrorHandler(async () => {
      const result = await Order.findOne(
        { include: includeList },
        { where: { id: req.params.id } }
      );
      !result
        ? baseRequestFailOfGet(res, "查询失败")
        : baseRequestSuccessOfGet(res, null, { result });
    }, res);
  });
  // 订购
  router.put("/approval/:id", async (req, res) => {
    baseSQLErrorHandler(async () => {
      const result = await Order.update(
        {
          approvalId: req.body.approvalId,
          approval_status: 1,
          approval_date: Date.now(),
        },
        {
          where: { id: `order${req.params.id}` },
        }
      );
      !result
        ? baseRequest(res, statusMap.get(Fail.PUT_REQUEST), "修改失败")
        : baseRequestSuccessOfModify(res, "修改成功");
    }, res);
  });
  // 入库
  router.put("/warehouse/:id", async (req, res) => {
    baseSQLErrorHandler(async () => {
      const result = await Order.update(
        { charge_status: 2 },
        {
          where: { id: req.params.id },
        }
      );
      !result
        ? baseRequest(res, statusMap.get(Fail.PUT_REQUEST), "修改失败")
        : baseRequestSuccessOfModify(res, "修改成功");
    }, res);
  });
  router.delete("/:id", async (req, res) => {
    baseSQLErrorHandler(async () => {
      const result = await Order.destroy({ where: { id: req.params.id } });
      result[0] !== 1
        ? baseRequest(res, statusMap.get(Fail.PUT_REQUEST), "删除失败")
        : baseRequestSuccessOfModify(res, "删除成功");
    }, res);
  });
  app.use("/order", router);
};
