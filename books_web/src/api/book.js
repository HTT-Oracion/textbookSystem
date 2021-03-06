import api from '@/utils/request'

export const getBooksApi = (queryInfo) => {
  return api('get', '/book/list', { params: queryInfo })
}
export const addBookApi = data => {
  return api('post', '/book/add', data)
}
export const editBookApi = (bookId, data) => {
  return api('put', `/book/${bookId}`, data)
}
export const deleteBookApi = bookId => {
  return api('delete', `/book/${bookId}`)
}
/* 分类 */
export const getCatesApi = () => {
  return api('get', '/category/list')
}
export const addCateApi = data => {
  return api('post', '/category/add', data)
}

export const editCateApi = (cateId, data) => {
  return api('put', `/category/${cateId}`, data)
}

export const deleteCateApi = () => {
  return api('delete', `/category/${bookId}`)
}