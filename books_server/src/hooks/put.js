import { baseRequestFailOfPut, baseSQLErrorHandler } from "#src/utils";
export default (
  res,
  Model,
  config = {
    message: "",
    where: {},
    update: {},
  }
) => {
  baseSQLErrorHandler(
    async () => {
      const result = await Model.update(config.update, {
        where,
      });
      !result
        ? baseRequestFailOfPut(res)
        : baseRequestSuccessOfModify(res, "修改成功");
    },
    res,
    config.message
  );
};
