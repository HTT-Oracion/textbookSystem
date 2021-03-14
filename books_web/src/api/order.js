import api from '@/utils/request'

export const getOrdersApi = () => {
  return api('get', '/order/list')
}

export const addOrderApi = data => {
  return api('post', '/order', data)
}
export const addOrderApi = (orderId, data) => {
  return api('put', `/order/${orderId}`, data)
}
export const deleteOrderApi = orderId => {
  return api('get', `/order/${orderId}`)
}
