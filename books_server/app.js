import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { common } from '#src/router/modules'
import router from '#src/router'
const app = express()
const port = 3333

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
/* 跨域 */
app.use(cors())

/* 路由 */
common(app)
router(app)
app.listen(port, () => {
  console.log(`server at ${port}`);
})