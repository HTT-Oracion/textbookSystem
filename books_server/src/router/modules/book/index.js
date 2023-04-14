import { Category } from "#src/models";
import { Fail, statusMap } from "#src/settings/status";
import {
  baseRequest,
  baseRequestSuccessOfGet,
  baseRequestSuccessOfModify,
  baseSQLErrorHandler,
  getRouter,
} from "#utils/index";
import { Sequelize } from "sequelize";
export default (app, Book) => {
  const router = getRouter();
  const Op = Sequelize.Op;
  router.get("/list", async (req, res) => {
    baseSQLErrorHandler(async () => {
      const query = req.query.query,
        pageNum = parseInt(req.query.pageNum) || 1,
        pageSize = parseInt(req.query.pageSize) || 5;
      let whereObj = {
        [Op.or]: [{ book_name: { [Op.like]: "%" + query + "%" } }],
      };
      let total = 0;
      let bookList = [];
      if (query) {
        const { count, rows } = await Book.findAndCountAll({
          raw: true,
          where: whereObj,
          include: [{ model: Category }],
          offset: (pageNum - 1) * pageSize,
          limit: pageSize,
        });
        total = count;
        bookList = rows;
      } else {
        const { count, rows } = await Book.findAndCountAll({
          include: [{ model: Category }],
          offset: (pageNum - 1) * pageSize,
          limit: pageSize,
        });
        total = count;
        bookList = rows;
      }
      baseRequestSuccessOfGet(res, null, { list: bookList, total });
    });
  });
  router.get("/:id", (req, res) => {
    baseSQLErrorHandler(async () => {
      const result = await Book.findOne({ where: { id: req.params.id } });
      result
        ? baseRequestSuccessOfGet(res, "查询成功", { result })
        : baseRequestFailOfGet(res, "查询失败");
    });
  });
  router.put("/:id", (req, res) => {
    baseSQLErrorHandler(async () => {
      const result = await Book.update(req.body, {
        where: { id: req.params.id },
      });
      result
        ? baseRequestSuccessOfModify(res, "修改成功")
        : baseRequest(res, statusMap.get(Fail.PUT_REQUEST), "修改失败");
    });
  });
  router.delete("/:id", async (req, res) => {
    baseSQLErrorHandler(async () => {
      await Book.destroy({
        where: { id: req.params.id },
      });
      baseRequestSuccessOfModify(res, "删除成功");
    });
  });
  router.post("/add", (req, res) => {
    baseSQLErrorHandler(async () => {
      const { id, ISBN, book_name, author, publish, date, price, category } =
        req.body;
      const cate = await Book.findOne({
        where: { ISBN },
      });
      if (cate) {
        baseRequest(res, statusMap.get(Fail.POST_REQUEST), "相同ISBN编号");
      } else {
        const newCate = await Book.create({
          id,
          ISBN,
          book_name,
          author,
          publish,
          date,
          price,
          nums: 0,
          times: 0,
          categoryId: category,
        });
        newCate
          ? baseRequestSuccessOfModify(res, "创建成功")
          : baseRequestFailOfGet(res, "创建失败");
      }
    });
  });
  router.get("/:id", (req, res) => {
    baseSQLErrorHandler(async () => {
      const result = await Book.findOne({
        where: { id: req.params.id },
      });
      result
        ? baseRequestSuccessOfGet(res, "查询成功", { result })
        : baseRequestFailOfGet(res, "查询失败");
    });
  });
  router.put("/:id", (req, res) => {
    baseSQLErrorHandler(async () => {
      const result = await Book.update(req.body, {
        where: { id: req.params.id },
      });
      result
        ? baseRequestSuccessOfModify(res, "修改成功")
        : baseRequest(res, statusMap.get(Fail.PUT_REQUEST), "修改失败");
    });
  });
  router.put("/num/:id", (req, res) => {
    baseSQLErrorHandler(async () => {
      const result = await Book.update(
        {
          times: req.body.times,
          nums: req.body.nums,
        },
        {
          where: { id: req.params.id },
        }
      );
      result[0] === 1
        ? baseRequestSuccessOfModify(res, "修改成功")
        : baseRequest(res, statusMap.get(Fail.PUT_REQUEST), "修改失败");
    });
  });
  router.delete("/:id", (req, res) => {
    baseSQLErrorHandler(async () => {
      await Book.destroy({
        where: { id: req.params.id },
      });
      baseRequestSuccessOfModify(res, "删除成功");
    });
  });
  app.use("/book", router);
};
