import api from '@/utils/request'
/* 院系 */
export const getDepsApi = () => {
  return api('get', '/department/list')
}

export const addDepApi = data => {
  return api('post', '/department', data)
}

export const editDepApi = (depId, data) => {
  return api('put', `/department/${depId}`, data)
}

export const deleteDepApi = (depId) => {
  return api('delelte', `/department/${depId}`)
}
/* 专业 */
export const getMajorsApi = () => {
  return api('get', '/major/list')
}

export const addMajorApi = data => {
  return api('post', '/major', data)
}

export const editMajorApi = (majorId, data) => {
  return api('put', `/major/${MajorId}`, data)
}

export const deleteMajorApi = (majorId) => {
  return api('delelte', `/major/${majorId}`)
}
/* 班级 */
export const getClasssApi = () => {
  return api('get', '/class/list')
}

export const addClassApi = data => {
  return api('post', '/class', data)
}

export const editClassApi = (classId, data) => {
  return api('put', `/class/${classId}`, data)
}

export const deleteClassApi = (classId) => {
  return api('delelte', `/class/${classId}`)
}




