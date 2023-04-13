import api from '@/utils/request'
/* 院系 */
export const getDepsApi = queryInfo => {
  return api('get', '/department/list', { params: queryInfo })
}
export const getDepById = id => {
  return api('get', `/department/${id}`)
}

export const addDepApi = data => {
  return api('post', '/department/add', data)
}

export const editDepApi = (depId, data) => {
  return api('put', `/department/${depId}`, data)
}

export const deleteDepApi = (depId) => {
  return api('delete', `/department/${depId}`)
}
/* 专业 */
export const getMajorsApi = queryInfo => {
  return api('get', '/major/list', { params: queryInfo })
}
export const getMajorById = id => {
  return api('get', `/major/${id}`)
}
export const addMajorApi = data => {
  return api('post', '/major/add', data)
}

export const editMajorApi = (majorId, data) => {
  return api('put', `/major/${majorId}`, data)
}

export const deleteMajorApi = (majorId) => {
  return api('delete', `/major/${majorId}`)
}
/* 班级 */
export const getClassesApi = queryInfo => {
  return api('get', '/class/list', { params: queryInfo })
}
export const getClassById = id => {
  return api('get', `/class/${id}`)
}

export const getClassInCharge = id => {
  return api('get', `/class/byCharge/${id}}`)
}
export const addClassApi = data => {
  return api('post', '/class', data)
}

export const editClassApi = (classId, data) => {
  return api('put', `/class/${classId}`, data)
}

export const deleteClassApi = (classId) => {
  return api('delete', `/class/${classId}`)
}
/* 不分页的数据 */

export const getAllListApi = name => {
  return api('get', `/user/information/${name}`)
}



