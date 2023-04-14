import { Sequelize } from "sequelize";
import { Department, Major } from "#src/models";
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
export default (app) => {
  router.get("/list", (req, res) => {
    const query = req.query.query,
      pageNum = parseInt(req.query.pageNum) || 1,
      pageSize = parseInt(req.query.pageSize) || 5;
    const searchQuery = {
      include: [{ model: Department }],
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
    };
    if (query) {
      const where = {
        [Op.or]: [{ major_name: { [Op.like]: "%" + query + "%" } }],
      };
      extend(searchQuery, { raw: true, where });
    }
    getListSQLHandler(res, Major, {
      searchQuery,
    });
  });
  router.post("/add", (req, res) => {
    postSQLHandler(res, Major, {
      where: { id: req.body.id },
      create: req.body,
    });
  });
  router.get("/:id", (req, res) => {
    getSQLHandler(res, Major, {
      searchQuery: {
        where: { id: req.params.id },
        include: { model: Department },
      },
    });
  });
  router.put("/:id", (req, res) => {
    putSQLHandler(res, Major, {
      where: { id: req.params.id },
      update: req.body,
    });
  });
  router.delete("/:id", (req, res) => {
    deleteSQLHandler(res, Major, {
      where: { id: req.params.id },
    });
  });
  app.use("/major", router);
};
