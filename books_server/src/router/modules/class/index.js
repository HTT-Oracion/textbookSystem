import { Sequelize } from "sequelize";
import { Major } from "#src/models";
import { extend, getRouter } from "#utils/index";
import {
  deleteSQLHandler,
  getListSQLHandler,
  getSQLHandler,
  postSQLHandler,
  putSQLHandler,
} from "#src/hooks";
const router = getRouter();
const Op = Sequelize.Op;
export default (app, Class) => {
  router.get("/list", async (req, res) => {
    const query = req.query.query,
      pageNum = parseInt(req.query.pageNum) || 1,
      pageSize = parseInt(req.query.pageSize) || 5;
    const searchQuery = {
      include: { model: Major },
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
    };
    if (query) {
      const where = {
        [Op.or]: [{ cls_name: { [Op.like]: "%" + query + "%" } }],
      };
      extend(searchQuery, { raw: true, where });
    }
    getListSQLHandler(res, Class, {
      searchQuery,
    });
  });
  router.post("/add", async (req, res) => {
    postSQLHandler(res, Class, {
      where: { id },
      create: req.body,
    });
  });
  router.get("/:id", async (req, res) => {
    getSQLHandler(res, Class, {
      searchQuery: {
        where: { id: req.params.id },
        include: Major,
      },
    });
  });
  router.put("/:id", async (req, res) => {
    putSQLHandler(res, Class, {
      where: { id: req.params.id },
    });
  });
  router.delete("/:id", async (req, res) => {
    deleteSQLHandler(res, Class, {
      where: { id: req.params.id },
    });
  });
  app.use("/class", router);
};
