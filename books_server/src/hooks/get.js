import {
  baseRequestSuccessOfGet,
  baseRequestFailOfGet,
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
      const result = await Model.findOne({
        ...config.searchQuery,
      });
      !result
        ? baseRequestFailOfGet(res)
        : baseRequestSuccessOfGet(res, null, { result });
    },
    res,
    config.message
  );
};
