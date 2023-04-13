import api from '@/utils/request'

export const getOrdersApi = () => {
  return api('get', '/order/list')
}
export const getOrderById = id => {
  return api('get', `order/${id}`)
}
export const addOrderApi = data => {
  return api('post', '/order/add', data)
}
export const approvalOrderApi = (orderId, data) => {
  return api('put', `/order/approval/${orderId}`, data)
}
export const chargeOrderApi = (orderId, data) => {
  return api('put', `order/charge/${orderId}`, data)
}
export const warehouseOrderApi = id => {
  return api('put', `/order/warehouse/${id}`)
}
export const deleteOrderApi = orderId => {
  return api('delete', `/order/${orderId}`)
}
