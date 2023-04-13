import axios from 'axios'
import router, { redirectLogin } from '@/router'
import store from '@/store'
import { errorTip } from '@/utils/viewTools'
const instance = axios.create({
  baseURL: 'http://localhost:3333' || process.env.VUE_APP_URL,
  timeout: 1000 * 12,
  transformResponse: [function (data) {
    try {
      return JSON.parse(data)
    } catch (error) {
      return data
    }
  }]
})

const successMap = [200, 201]
const FORBIDDEN_CODE = 403


instance.interceptors.request.use(config => {
  const token = store.state.token
  if (token) {
    config.headers.token = `Bearer ${token}`
  }
  return config
}, err => {
  Promise.reject(err)
})

instance.interceptors.response.use(response => {
  const status = response.data.status
  if (!successMap.includes(+status)) {
    errorTip(response.data.msg)
  }

  if (+status === FORBIDDEN_CODE) {
    redirectLogin()
    store.dispatch('removeUserCache')
  }

  return response
}, err => {
  // 
  errorTip(response.statusText)
  return Promise.reject(err)
})

const api = (method, uri, data, config) => {
  return new Promise((resolve, reject) => {
    instance[method](uri, data, config)
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
  })
}
export default api