import { statusMap, Success, Fail } from "#src/settings/status";
import { extend } from "./general";
export const baseRequest = (res, status, message) => {
  return res.send({
    status,
    message,
  });
};

export const baseRequestSuccessOfGet = (res, message, data) => {
  const response = {
    status: statusMap.get(Success.GET_REQUEST),
    message: message ?? "查询成功",
  };
  data && extend(response, { result: data });
  return res.send(response);
};

export const baseRequestFailOfGet = (res, message, data) => {
  const result = {
    status: statusMap.get(Fail.GET_REQUEST),
    message: message ?? "查询失败",
  };
  data && extend(result, { data });
  return res.send(result);
};
export const baseRequestFailOfPost = (res, message ) => {
  return baseRequest(res, statusMap.get(Fail.POST_REQUEST), message ?? '创建失败')
};
export const baseRequestFailOfPut = (res, message) => {
  return baseRequest(res, statusMap.get(Fail.PUT_REQUEST), message ?? '修改失败')
};
export const baseRequestFailOfDelete = (res, message) => {
  return baseRequest(res, statusMap.get(Fail.DELETE_REQUEST), message ?? '删除失败')
};

export const baseRequestSuccessOfModify = (res, message) => {
  return res.send({
    status: statusMap.get(Success.MODIFY_REQUEST),
    message: message ?? "操作成功",
  });
};

export const requestFailOfPassword = (res, message) => {
  return res.send({
    status: statusMap.get(Fail.PASSWORD),
    message: message ?? "密码不正确",
  });
};

export const baseSQLErrorHandler = (fn, res, message) => {
  try {
    fn && fn();
  } catch (error) {
    console.log("error", error);
    res.send({
      status: statusMap.get(Fail.DATA_BASE),
      message: message ?? "接口请求失败，ERROR:" + error,
    });
  }
};

export const tokenExpiredHandler = (res, fn) => {
  fn && fn();
  res.send({
    status: statusMap.get(Fail.FORBIDDEN),
    message: "token失效",
  });
};
