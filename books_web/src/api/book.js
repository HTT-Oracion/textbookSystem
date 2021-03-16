import api from '@/utils/request'

export const getBooksApi = (queryInfo) => {
  return api('get', '/book/list', { params: queryInfo })
}
export const getBookById = id => {
  return api('get', `/book/${id}`)
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

export const getCateById = id => {
  return api('get', `/category/${id}`)
}
export const addCateApi = data => {
  return api('post', '/category/add', data)
}

export const editCateApi = (cateId, data) => {
  return api('put', `/category/${cateId}`, data)
}

export const deleteCateApi = catId => {
  return api('delete', `/category/${catId}`)
}