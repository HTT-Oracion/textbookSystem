import { User } from "#src/models";
import { tokenExpiredHandler } from "#src/utils";
import { decodeToken } from "#src/utils/token";
import { tokenRE } from "#src/settings/reg";
import { getRedisValue } from "#src/redis/client";
const withListRE = /^(\/user\/(logout|login|register\/*\w*))/g
export async function checkTokenValid(token) {
    let valid = false
    if (!token) return valid 
    if(!tokenRE.test(token)) return valid

    const splitToken = token.split(' ')[1]
    const decoded = decodeToken(splitToken)
    // 先检查redis token黑名单里有没有这个token
    const redisToken = await getRedisValue(splitToken)
    if (redisToken) return false
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

