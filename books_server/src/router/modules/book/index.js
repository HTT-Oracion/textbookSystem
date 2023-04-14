import {
  deleteSQLHandler,
  getListSQLHandler,
  getSQLHandler,
  postSQLHandler,
  putSQLHandler,
} from "#src/hooks";
import { Category } from "#src/models";
import {
  extend,
  getRouter,
} from "#utils/index";
import { Sequelize } from "sequelize";
export default (app, Book) => {
  const router = getRouter();
  const Op = Sequelize.Op;
  router.get("/list", (req, res) => {
    const query = req.query.query,
      pageNum = parseInt(req.query.pageNum) || 1,
      pageSize = parseInt(req.query.pageSize) || 5;

    const searchQuery = {
      include: [{ model: Category }],
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
    };
    if (query) {
      const where = {
        [Op.or]: [{ book_name: { [Op.like]: "%" + query + "%" } }],
      };
      extend(searchQuery, { raw: true, where });
    }
    getListSQLHandler(res, Book, {
      searchQuery,
    });
  });
  router.get("/:id", (req, res) => {
    getSQLHandler(res, Book, {
      searchQuery: { where: { id: req.params.id } },
    });
  });
  router.put("/:id", (req, res) => {
    putSQLHandler(res, Book, {
      where: { id: req.params.id },
      update: req.body,
    });
  });
  router.delete("/:id", async (req, res) => {
    deleteSQLHandler(res, Book, {
      where: { id: req.params.id },
      message: "删除失败",
    });
  });
  router.post("/add", (req, res) => {
    const { id, ISBN, book_name, author, publish, date, price, category } =
      req.body;
    postSQLHandler(res, Book, {
      where: { ISBN },
      create: {
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
      },
    });
  });
  router.get("/:id", (req, res) => {

    getSQLHandler(res, Book, {
      searchQuery: { where: { id: req.params.id } }
    })
  });
  router.put("/:id", (req, res) => {
    putSQLHandler(res, Book, {
      where: { id: req.params.id },
      update: req.body
    })
  });
  router.put("/num/:id", (req, res) => {
    putSQLHandler(res, Book, {
      where: { id: req.params.id },
      update: {
        times: req.body.times,
        nums: req.body.nums,
      },
    })
  });
  router.delete("/:id", (req, res) => {
    deleteSQLHandler(res, Book, {
      where: { id: req.params.id },
    })
  });
  app.use("/book", router);
};
