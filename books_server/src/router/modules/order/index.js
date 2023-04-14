import { Sequelize } from "sequelize";
import {
  Book,
  Charge,
  Approval,
  Department,
  Lesson,
  Class,
  Major,
} from "#src/models";
import {
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
export default (app, Order) => {
  let includeList = [
    { model: Book },
    { model: Lesson },
    { model: Department },
    { model: Charge },
    { model: Approval },
    { model: Class },
    { model: Major },
  ];
  router.get("/list", (req, res) => {
    const query = req.query.query;
    const where = {
      [Op.or]: [{ book_name: { [Op.like]: "%" + query + "%" } }],
    };
    const searchQuery = {
      where,
      include: includeList,
    };
    getListSQLHandler(res, Order, {
      searchQuery,
    });
  });
  router.get("/list/all", async (_, res) => {
    getListSQLHandler(res, Order, {
      searchQuery: {
        include: includeList,
      },
    });
  });
  router.post("/add", (req, res) => {
    const { bookId, id, departmentId, chargeId, classId, majorId } = req.body;

    postSQLHandler(res, Order, {
      where: null,
      create: {
        bookId,
        lessonId: id,
        departmentId,
        chargeId,
        classId,
        majorId,
        charge_status: 1,
        charge_date: Date.now(),
        approval_status: 0,
        id: `order${id}`,
      },
    });
  });
  router.get("/:id", (req, res) => {
    getSQLHandler(res, Order, {
      searchQuery: [{ include: includeList }, { where: { id: req.params.id } }],
    });
  });
  // 订购
  router.put("/approval/:id", async (req, res) => {
    putSQLHandler(res, Order, {
      where: { id: `order${req.params.id}` },
      update: {
        approvalId: req.body.approvalId,
        approval_status: 1,
        approval_date: Date.now(),
      },
    });
  });
  // 入库
  router.put("/warehouse/:id", async (req, res) => {
    putSQLHandler(res, Order, {
      where: { id: req.params.id },
      update: { charge_status: 2 },
    });
  });
  router.delete("/:id", async (req, res) => {
    deleteSQLHandler(res, Order, {
      where: { id: req.params.id },
    });
  });
  app.use("/order", router);
};
