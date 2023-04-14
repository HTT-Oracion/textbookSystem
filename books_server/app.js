import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import auth from '#src/middleware/auth'
import router from '#src/router'
import { port } from '#settings/system'

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// 跨域
app.use(cors())

// token校验中间件
auth(app)
// 路由
router(app)
app.listen(port, () => {
  console.log(`server is running at port: ${port}`);
})