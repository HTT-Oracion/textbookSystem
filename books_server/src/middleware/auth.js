import { User } from "#src/models";
import { tokenExpiredHandler } from "#src/utils";
import { decodeToken } from "#src/utils/token";
import { tokenRE } from "#src/settings/reg";
import { existRedisKey } from "#src/redis/client";
const withListRE = /^(\/user\/(logout|login|register\/*\w*))/g
export async function checkTokenValid(token) {
    let valid = false
    if (!token) return valid 
    if(!tokenRE.test(token)) return valid

    const splitToken = token.split(' ')[1]
    const decoded = decodeToken(splitToken)
    // 先检查Redis token黑名单里有没有这个token
    // why Redis:
    // 退出登录后，让token失效，并且由于Jwt没有让token失效的方法，
    // 加上Redis也支持过期时间，因此把token放到黑名单里
    // 如果token在Redis里，则说明是已退出登录的，token无效
    // 保存在Redis里的过期token，3天后就会自动清空
    const tokenExistInBlacklist = !!await existRedisKey(splitToken) 
    if (tokenExistInBlacklist) return false
    if (decoded?.id) {
        const user = await User.findOne({
            where: { id: decoded.id }
        })
        valid = !!user   
    } 
    return valid
}

export default (app) => {
  app.use("/", async (req, res, next) => {
    const token = req.headers.token ?? null
    if (withListRE.test(req.path)) {
        return next()
    } else {
        const isTokenValid = await checkTokenValid(token)
        if (!isTokenValid) {
            return tokenExpiredHandler(res)
        }
    } 
    next()
  });
};

