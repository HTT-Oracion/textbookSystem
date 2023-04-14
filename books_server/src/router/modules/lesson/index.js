import { Sequelize } from "sequelize";
import { Book, Class, Major, Department, Charge, Approval, Lesson } from "#src/models";
import { extend, getRouter } from "#utils/index";
import {
  deleteSQLHandler,
  getListSQLHandler,
  getSQLHandler,
  postSQLHandler,
  putSQLHandler,
} from "#src/hooks";
export default (app) => {
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
    const query = req.query.query,
      pageNum = parseInt(req.query.pageNum) || 1,
      pageSize = parseInt(req.query.pageSize) || 5;

    const searchQuery = {
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      include: includeList,
    };
    if (query) {
      const where = {
        [Op.or]: [{ lesson_name: { [Op.like]: "%" + query + "%" } }],
      };
      extend(searchQuery, { where, raw: true });
    }

    getListSQLHandler(res, Lesson, {
      searchQuery,
    });
  });
  router.post("/add", (req, res) => {
    postSQLHandler(res, Lesson, {
      where: { id: req.body.id },
      create: req.body,
    });
  });
  router.get("/:id", (req, res) => {
    getSQLHandler(res, Lesson, {
      searchQuery: {
        where: { id: req.params.id },
        include: includeList,
      },
    });
  });
  router.get("/byCharge/:id", (req, res) => {
    getListSQLHandler(res, Lesson, {
      searchQuery: {
        where: { chargeId: req.params.id },
        include: Book,
      },
    });
  });
  router.get("/byApproval/:id", (req, res) => {
    getListSQLHandler(res, Lesson, {
      searchQuery: {
        where: { approvalId: req.params.id },
        include: Book,
      },
    });
  });
  router.put("/:id", (req, res) => {
    putSQLHandler(res, Lesson, {
      where: { id: req.params.id },
      update: req.body,
    });
  });
  router.delete("/:id", (req, res) => {
    deleteSQLHandler(res, Lesson, {
      where: { id: req.params.id },
    });
  });
  app.use("/lesson", router);
};
