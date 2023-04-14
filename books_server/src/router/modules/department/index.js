import { Sequelize } from "sequelize";
import { Department } from '#src/models'
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
export default (app) => {
  router.get("/list", async (req, res) => {
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
    getListSQLHandler(res, Department, {
      searchQuery,
    });
  });
  router.post("/add", async (req, res) => {
    postSQLHandler(res, Department, {
      where: { id },
      create: req.body,
    });
  });
  router.get("/:id", async (req, res) => {
    getSQLHandler(res, Department, {
      searchQuery: {
        where: { id: req.params.id },
      },
    });
  });
  router.put("/:id", async (req, res) => {
    putSQLHandler(res, Department, {
      where: { id: req.params.id },
      update: req.body,
    });
  });
  router.delete("/:id", async (req, res) => {
    deleteSQLHandler(res, Department, {
      where: { id: req.params.id },
    });
  });
  app.use("/department", router);
};
