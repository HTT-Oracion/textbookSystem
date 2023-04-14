import {
  baseSQLErrorHandler,
  baseRequestFailOfPost,
} from "#src/utils";
export default (
  res,
  Model,
  config = {
    message: "",
    where: {},
    create: {},
  }
) => {
  baseSQLErrorHandler(
    async () => {
      if (config.where) {
        const exist = await Modal.findOne({ where: config.where });
        if (exist) return baseRequestFailOfPost(res, '已存在相同名称或id的数据');
      }

      const result = await Model.create(create);
      !result
        ? baseRequestFailOfPost(res)
        : baseRequestSuccessOfModify(res, "创建成功");
    },
    res,
    config.message
  );
};
