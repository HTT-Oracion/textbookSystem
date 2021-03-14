const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 3333

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
/* 跨域 */
app.use(cors())

/* 路由 */
require('./router')(app)
app.listen(port, () => {
  console.log(`server at ${port}`);
})