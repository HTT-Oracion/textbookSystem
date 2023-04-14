import { Sequelize } from "sequelize";
import {
  extend,
  getRouter,
} from "#utils/index";
import {
  deleteSQLHandler,
  getListSQLHandler,
  getSQLHandler,
  postSQLHandler,
  putSQLHandler,
} from "#src/hooks";

const router = getRouter();
const Op = Sequelize.Op;
export default (app, Category) => {
  router.get("/list", (req, res) => {
    const query = req.query.query,
      pageNum = parseInt(req.query.pageNum) || 1,
      pageSize = parseInt(req.query.pageSize) || 5;

    const searchQuery = {
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
    };
    if (query) {
      const where = {
        [Op.or]: [{ cat_name: { [Op.like]: "%" + query + "%" } }],
      };
      extend(searchQuery, { raw: true, where });
    }
    getListSQLHandler(res, Category, {
      searchQuery,
    });
  });
  router.get("/:id", (req, res) => {
    getSQLHandler(res, Category, {
      searchQuery: {
        where: { id: req.params.id },
      },
    });
  });
  router.put("/:id", (req, res) => {
    putSQLHandler(res, Category, {
      update: req.body,
      where: { id: req.params.id },
    });
  });
  router.delete("/:id", (req, res) => {
    deleteSQLHandler(res, Category, {
      where: { id: req.params.id },
      message: "删除失败",
    });
  });
  router.post("/add", (req, res) => {
    postSQLHandler(res, Category, {
      where: { id: req.body.id },
      create: req.body
    })
  });
  app.use("/category", router);
};
