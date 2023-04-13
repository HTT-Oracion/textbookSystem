import api from '@/utils/request'

export const loginApi = data => {
  return api('post', '/user/login', data)
}

// 所有用户
export const getUsersApi = () => {

}

export const addUserApi = data => {
  return api('post', '/user/register', data)
}
export const addNormalUserApi = data => {
  return api('post', '/user/register/normal', data)
}
export const editUserApi = (id, data) => {
  return api('put', `/user/${id}`, data)
}
/* id 获取 */
export const getUserById = id => {
  return api('get', `user/${id}`)
}
/* id 删除 */
export const deleteUserById = id => {
  return api('delete', `user/${id}`)
}


/* 订购/ 审核 列表 */
export const getChargesApi = queryInfo => {
  return api('get', '/user/charge/list', { params: queryInfo })
}
export const getApprovalsApi = queryInfo => {
  return api('get', '/user/approval/list', { params: queryInfo })
}

