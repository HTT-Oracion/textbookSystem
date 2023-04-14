import { Sequelize } from "sequelize";
import { Book, Class, Major, Department, Charge, Approval } from "#src/models";
import {
  baseRequestFailOfDelete,
  baseRequestFailOfGet,
  baseRequestFailOfPost,
  baseRequestSuccessOfGet,
  baseRequestSuccessOfModify,
  baseSQLErrorHandler,
  getRouter,
} from "#utils/index";
export default (app, Lesson) => {
  const router = getRouter();
  const Op = Sequelize.Op;
  let includeList = [
    { model: Book },
    { model: Class },
    { model: Major },
    { model: Department },
    { model: Charge },
    { model: Approval },
  ];
  router.get("/list", (req, res) => {
    baseSQLErrorHandler(async () => {
      const query = req.query.query,
        pageNum = parseInt(req.query.pageNum) || 1,
        pageSize = parseInt(req.query.pageSize) || 5;
      let whereObj = {
        [Op.or]: [{ lesson_name: { [Op.like]: "%" + query + "%" } }],
      };
      let result;
      if (query) {
        result = await Lesson.findAndCountAll({
          raw: true,
          where: whereObj,
          offset: (pageNum - 1) * pageSize,
          limit: pageSize,
          include: includeList,
        });
      } else {
        result = await Lesson.findAndCountAll({
          offset: (pageNum - 1) * pageSize,
          limit: pageSize,
          include: includeList,
        });
      }

      baseRequestFailOfGet(res, null, {
        list: Z?.rows ?? [],
        total: result?.total ?? 0,
      });
    }, res);
  });
  router.post("/add", (req, res) => {
    baseSQLErrorHandler(async () => {
      const exist = await Lesson.findOne({ where: { id: req.body.id } });
      if (exist) return baseRequestFailOfPost(res);
      const result = await Lesson.create(req.body);
      !result
        ? baseRequestFailOfPost(res)
        : baseRequestSuccessOfModify(res, "创建成功");
    }, res);
  });
  router.get("/:id", (req, res) => {
    baseSQLErrorHandler(async () => {
      const result = await Lesson.findOne({
        where: { id: req.params.id },
        include: includeList,
      });
      !result
        ? baseRequestFailOfGet(res)
        : baseRequestSuccessOfGet(res, null, { result });
    }, res);
  });
  router.get("/byCharge/:id", (req, res) => {
    baseSQLErrorHandler(async () => {
      const result = await Lesson.findAndCountAll({
        where: { chargeId: req.params.id },
        include: Book,
      });
      baseRequestFailOfGet(res, null, {
        list: result?.rows ?? [],
        total: result?.total ?? 0,
      });
    }, res);
  });
  router.get("/byApproval/:id", (req, res) => {
    baseSQLErrorHandler(async () => {
      const result = await Lesson.findAndCountAll({
        where: { approvalId: req.params.id },
        include: Book,
      });
      baseRequestFailOfGet(res, null, {
        list: result?.rows ?? [],
        total: result?.total ?? 0,
      });
    }, res);
  });
  router.put("/:id", (req, res) => {
    baseSQLErrorHandler(async () => {
      const result = await Lesson.update(req.body, {
        where: { id: req.params.id },
      });
      !result
        ? baseRequestFailOfPost(res)
        : baseRequestSuccessOfModify(res, "修改成功");
    }, res);
  });
  router.delete("/:id", (req, res) => {
    baseSQLErrorHandler(async () => {
      const result = await Lesson.destroy({
        where: { id: req.params.id },
      });
      result[0] !== 1
        ? baseRequestFailOfDelete(res)
        : baseRequestSuccessOfModify(res, "删除成功");
    }, res);
  });
  app.use("/lesson", router);
};
