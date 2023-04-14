import { Sequelize } from "sequelize";
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
export default (app, Category) => {
  router.get("/list", (req, res) => {
    baseSQLErrorHandler(async () => {
      const query = req.query.query,
        pageNum = parseInt(req.query.pageNum) || 1,
        pageSize = parseInt(req.query.pageSize) || 5;
      let whereObj = {
        [Op.or]: [{ cat_name: { [Op.like]: "%" + query + "%" } }],
      };
      let result;
      if (query) {
        result = await Category.findAndCountAll({
          raw: true,
          where: whereObj,
          offset: (pageNum - 1) * pageSize,
          limit: pageSize,
        });
      } else {
        result = await Category.findAndCountAll({
          offset: (pageNum - 1) * pageSize,
          limit: pageSize,
        });
      }

      baseRequestSuccessOfGet(res, null, {
        list: result.rows,
        total: result.total,
      });
    }, res);
  });
  router.get("/:id", (req, res) => {
    baseSQLErrorHandler(async () => {
      const cate = await Category.findOne({
        where: { id: req.params.id },
      });
      !cate
        ? baseRequestFailOfGet(res)
        : baseRequestSuccessOfGet(res, null, { result: data });
    }, res);
  });
  router.put("/:id", (req, res) => {
    baseSQLErrorHandler(async () => {
      const cate = await Category.update(req.body, {
        where: { id: req.params.id },
      });
      !cate
        ? baseRequest(res, statusMap.get(Fail.PUT_REQUEST), "修改失败")
        : baseRequestSuccessOfModify(res, "修改成功");
    }, res);
  });
  router.delete("/:id", (req, res) => {
    baseSQLErrorHandler(
      async () => {
        await Category.destroy({
          where: { id: req.params.id },
        });
        baseRequestSuccessOfModify(res, "删除成功");
      },
      res,
      "删除失败"
    );
  });
  router.post("/add", (req, res) => {
    baseSQLErrorHandler(async () => {
      const { id } = req.body;
      const cate = await Category.findOne({ where: { id } });
      if (cate) {
        baseRequest(res, statusMap.get(Fail.POST_REQUEST), '创建失败')
      } else {
        const result = await Category.create(req.body)
        !result ? baseRequest(res, statusMap.get(Fail.POST_REQUEST), '创建失败')
        : baseRequestSuccessOfModify(res, '创建成功')
      }
    }, res);
  });
  app.use("/category", router);
};
