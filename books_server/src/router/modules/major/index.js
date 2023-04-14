import { Sequelize } from "sequelize";
import { Department } from '#src/models'
import { getRouter } from '#utils/index'

export default (app, Major) => {
  const router = getRouter()
  const Op = Sequelize.Op
  router.get('/list', async (req, res) => {
    const query = req.query.query,
      pageNum = parseInt(req.query.pageNum) || 1,
      pageSize = parseInt(req.query.pageSize) || 5
    console.log(req.query);
    let whereObj = {
      [Op.or]: [
        { major_name: { [Op.like]: '%' + query + '%' } }
      ]
    }
    let total = 0
    let dataList = []
    if (query) {
      const { count, rows } = await Major.findAndCountAll({
        raw: true,
        where: whereObj,
        include: [{ model: Department }],
        offset: (pageNum - 1) * pageSize,
        limit: pageSize
      })
      total = count
      dataList = rows
    } else {
      const { count, rows } = await Major.findAndCountAll({
        include: [{ model: Department }],
        offset: (pageNum - 1) * pageSize,
        limit: pageSize
      })
      total = count
      dataList = rows
    }
    if (dataList.length === 0) return res.send({ status: 422, msg: '没有任何数据!' })
    return res.send({ status: 200, msg: `获取列表成功`, result: dataList, total })
  })
  router.post('/add', async (req, res) => {
    const { id } = req.body
    const result = await Major.findOne({ where: { id } })
    if (result) return res.send({ status: 401, msg: '相同编号!' })
    try {
      await Major.create(req.body)
      return res.send({ status: 200, msg: '创建成功!' })
    } catch {
      return res.send({ status: 401, msg: '创建失败!' })
    }
  })
  router.get('/:id', async (req, res) => {
    const result = await Major.findOne({
      where: { id: req.params.id },
      include: { model: Department }
    })
    if (!result) return res.send({ status: 401, msg: '查找失败' })
    return res.send({ status: 200, msg: '查找成功', result })
  })
  router.put('/:id', async (req, res) => {
    console.log(req.body, req.params.id);
    const result = await Major.update(req.body, {
      where: { id: req.params.id }
    })
    if (!result) return res.send({ status: 401, msg: '修改失败!' })
    return res.send({ status: 200, msg: '修改成功!' })
  })
  router.delete('/:id', async (req, res) => {
    try {
      await Major.destroy({
        where: { id: req.params.id }
      })
      return res.send({ status: 200, msg: '删除成功!' })
    } catch {
      return res.send({ status: 400, msg: '删除失败!' })
    }
  })
  app.use('/major', router)
}