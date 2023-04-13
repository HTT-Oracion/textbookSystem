import api from '@/utils/request'
/* 课程 */
export const getLessonsApi = queryInfo => {
  return api('get', '/lesson/list', { params: queryInfo })
}
export const getLessonById = LessonId => {
  return api('get', `/lesson/${LessonId}`)
}

export const addLessonApi = data => {
  return api('post', '/lesson/add', data)
}

export const editLessonApi = (LessonId, data) => {
  return api('put', `/lesson/${LessonId}`, data)
}

export const deleteLessonApi = (LessonId) => {
  return api('delete', `/lesson/${LessonId}`)
}


export const getLessonInCharge = id => {
  return api('get', `/lesson/byCharge/${id}`)
}

export const getLessonInApproval = id => {
  return api('get', `/lesson/byApproval/${id}`)
}