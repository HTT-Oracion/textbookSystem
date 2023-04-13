import {
  baseRequest,
  baseRequestSuccessOfGet,
  baseRequestSuccessOfModify,
  baseSQLErrorHandler,
  extend,
  getRouter
} from "#utils/index";

import { Fail } from "#settings/status";
const basePageInfo = {
  pageNum: 1,
  pageSize: 5,
};

export default (app, Book, Category, Sequelize) => {
  const router = getRouter();
  const Op = Sequelize.Op;

  // 书籍列表
  router.get("/list", (req, res) => {
    baseSQLErrorHandler(async () => {
      const query = req.query.query;
      const pageNum = +req.query?.pageNum || basePageInfo.pageNum;
      const pageSize = +req.query?.pageSize || basePageInfo.pageSize;

      const searchQuery = {
        include: [{ model: Category }],
        offset: (pageNum - 1) * pageSize,
        limit: pageSize,
      };
      if (query) {
        extend(searchQuery, {
          raw: true,
          where: {
            [Op.or]: [{ book_name: { [Op.like]: "%" + query + "%" } }],
          },
        });
      }
      const { count, rows } = await Book.findAndCountAll(searchQuery);

      return baseRequestSuccessOfGet(res, "获取文章成功", {
        list: rows,
        total: count,
      });
    });
  });

  // 添加
  router.post("/create", (req, res) => {
    baseSQLErrorHandler(async () => {
      const { id, ISBN, book_name, author, publish, date, price, category } =
        req.body;

      const book = await Book.findOne({
        where: { ISBN },
      });

      if (book) {
        return baseRequest(res, Fail.POST_REQUEST, "相同ISBN编号");
      }
      const query = {
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
      };
      const newBook = await Book.create(query);
      if (!newBook) return baseRequest(res, Fail.POST_REQUEST, "请求参数错误");

      return baseRequestSuccessOfModify(res, "添加成功");
    });
  });
  app.use("/book", router);
};
