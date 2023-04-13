const secretKey = require('../key')
const jwt = require('jsonwebtoken')
const whiteRequestList = ['login', 'register']
const authTagMap = {
    FAIL: 0,
    PASS: 1
}


// 校验token并返回校验msg
const authAndGetMessage = async (token) => {
    console.log('authAndGetMessage', token);
    if (!token) return ''
    let msg
    let authTag = authTagMap.FAIL
    if (token.indexOf('Bearer') === -1) return msg = 'token不合法'
    const realToken = token.split('Bearer ')[1]
    const verifyInfo = jwt.verify(realToken, secretKey)
    if (!verifyInfo) {
        msg = 'token已过期'
    } else {
        const username = verifyInfo.username
        const user = await User.findOne({ where: { username } })
        if (!(!user || !user.length)) {
            authTag = authTagMap.PASS
        }
        msg = !authTag ? '用户不存在' : ''
    }
    return {
        msg
    }
}


/**
 * 权限校验中间件
 * @return
 */
const auth = async (req, res, next) => {
    console.log('auth 中间件', req.headers)
    // if (whiteRequestList.test(new RegExp(req.originalUrl))) {
    //     isAuthPass = true
    // }
    const requestUrl = req.originalUrl
    if (requestUrl.indexOf('login') !== -1 ||
        requestUrl.indexOf('register') !== -1
    ) {
        next()
    }

    const authMsg = await authAndGetMessage(req.headers?.token ?? '')
    if (authMsg) {
        res.send({ status: 403, msg: authMsg })
    } else {
        next()
    }
}

module.exports = auth