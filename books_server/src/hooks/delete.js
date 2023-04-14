import { baseRequestFailOfDelete, baseSQLErrorHandler } from "#src/utils";
export default (
  res,
  Model,
  config = {
    message: "",
    where: {},
  }
) => {
  baseSQLErrorHandler(
    async () => {
      const result = await Model.destroy({
        where: config.where,
      });
      !result
        ? baseRequestFailOfDelete(res)
        : baseRequestSuccessOfModify(res, "删除成功");
    },
    res,
    config.message ?? '删除失败'
  );
};
