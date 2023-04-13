import { baseRequestFailOfGet, baseSQLErrorHandler, getRouter } from "#utils/index";
export default (app, Category) => {
  const router = getRouter();
  router.get("/list", async (req, res) => {
    baseSQLErrorHandler(async () => {
      const list = await Category.findAll();
      return baseRequestFailOfGet(res, null, { list })
    });
  });
  app.use("/category", router);
};
