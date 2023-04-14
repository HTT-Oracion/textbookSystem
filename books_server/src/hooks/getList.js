import {
  baseRequestSuccessOfGet,
  baseSQLErrorHandler,
} from "#src/utils";
export default (
  res,
  Model,
  config = {
    message: "",
    searchQuery: {},
  }
) => {
  baseSQLErrorHandler(
    async () => {
      const { count, rows } = await Model.findAndCountAll({ ...config.searchQuery });
      baseRequestSuccessOfGet(res, "查询成功", { list: rows, total: count });
    },
    res,
    config.message
  );
};
