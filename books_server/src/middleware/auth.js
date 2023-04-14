import { User } from "#src/models";
import { tokenExpiredHandler } from "#src/utils";
import { decodeToken } from "#src/utils/token";

const withListRE = /^(\/user\/(login|register\/*\w*))/g

async function checkTokenValid(token) {
    let valid = false
    if (!token) return valid 
    const decoded = decodeToken(token)
    console.log('verify', token, decoded)
    if (decoded?.id) {
        const user = await User.findOne({
            id: decoded.id
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
        console.log('isTokenValid', isTokenValid);
        if (!isTokenValid) {
            return tokenExpiredHandler(res)
        }
    } 
    next()
  });
};

