import { baseRequestFailOfGet, requestFailOfPassword } from "#src/utils";
import { User } from "#src/models";
export const findUser = async (res, params, feedback = true) => {
  const where = {
    ...params
  }
  const user = await User.findOne({ where });
  if (!user && feedback) {
    baseRequestFailOfGet(res, '用户不存在')
  }
  return user
};

export const checkPassword = (res, password, user, fn) => {
    const isPasswordSame = password === user.getDataValue("password")
    if (!isPasswordSame) {
      return requestFailOfPassword(res)
    } else {
        fn()
    }
}

