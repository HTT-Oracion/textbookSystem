import { Sequelize } from "sequelize";
import { Department } from "#src/models";
import {
  baseRequestFailOfDelete,
  baseRequestFailOfGet,
  baseRequestFailOfPost,
  baseRequestFailOfPut,
  baseRequestSuccessOfGet,
  baseRequestSuccessOfModify,
  baseSQLErrorHandler,
  getRouter,
} from "#utils/index";
const router = getRouter();
const Op = Sequelize.Op;
export default (app, Major) => {
  router.get("/list", (req, res) => {
    baseSQLErrorHandler(async () => {
      const query = req.query.query,
        pageNum = parseInt(req.query.pageNum) || 1,
        pageSize = parseInt(req.query.pageSize) || 5;
      console.log(req.query);
      let where = {
        [Op.or]: [{ major_name: { [Op.like]: "%" + query + "%" } }],
      };
      let result;
      if (query) {
        result = await Major.findAndCountAll({
          raw: true,
          where,
          include: [{ model: Department }],
          offset: (pageNum - 1) * pageSize,
          limit: pageSize,
        });
      } else {
        result = await Major.findAndCountAll({
          include: [{ model: Department }],
          offset: (pageNum - 1) * pageSize,
          limit: pageSize,
        });
      }

      baseRequestFailOfGet(res, null, {
        list: result?.rows ?? [],
        total: result?.total ?? 0
      })
    }, res);
  });
  router.post("/add", (req, res) => {
    baseSQLErrorHandler(async () => {
      const exist = await Major.findOne({ where: { id: req.body.id } });
      if (exist) {
        baseRequestFailOfPost(res);
      } else {
        const result = await Major.create(req.body);
        !result
          ? baseRequestFailOfPost(res)
          : baseRequestSuccessOfModify(res, "创建成功");
      }
    }, res);
  });
  router.get("/:id", (req, res) => {
    baseSQLErrorHandler(async () => {
      const result = await Major.findOne({
        where: { id: req.params.id },
        include: { model: Department },
      });
      !result
        ? baseRequestFailOfGet(res, null)
        : baseRequestSuccessOfGet(res, null, { result });
    }, res);
  });
  router.put("/:id", (req, res) => {
    baseSQLErrorHandler(async () => {
      const result = await Major.update(req.body, {
        where: { id: req.params.id },
      });
      !result
        ? baseRequestFailOfPut(res)
        : baseRequestSuccessOfModify(res, "修改成功");
    }, res);
  });
  router.delete("/:id", (req, res) => {
    baseSQLErrorHandler(async () => {
      const result = await Major.destroy({
        where: { id: req.params.id },
      });
      result[0] !== 1
        ? baseRequestFailOfDelete(res)
        : baseRequestSuccessOfModify(res, "删除成功");
    }, res);
  });
  app.use("/major", router);
};
