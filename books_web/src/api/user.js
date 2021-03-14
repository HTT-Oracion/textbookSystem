import api from '@/utils/request'

export const loginApi = data => {
  return api('post', '/user/login', data)
}

export const getUsersApi = () => {

}

export const addUserApi = data => {
  return api('post', '/user/register', data)
}

export const editUserApi = () => {

}

export const deletetUserApi = () => {

}

export const getChargesApi = () => {

}

export const getApprovalsApi = () => {

}
