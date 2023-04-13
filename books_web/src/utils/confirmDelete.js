/**
 * @param deleteApi -- api操作
 * 
 * @param getList -- 重新获取列表数据操作
 */
import { MessageBox, Message } from 'element-ui'
export default (deleteApi, getList) => {
  MessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { data } = await deleteApi.call()
    if (data.status === 200) {
      Message.success('删除成功!')
      getList.call()
    } else {
      Message.error('删除失败!')
    }
  }).catch(() => {
    Message.info('取消操作')
  })
}