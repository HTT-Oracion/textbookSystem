import axios from 'axios'
import router from '@/router'
import store from '@/store'
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

instance.interceptors.request.use(config => {
  // const user = store.state.user
  // if (user) {
  //   config.headers.Authorization = `Bearer ${user}`
  // }
  return config
}, err => {
  Promise.reject(err)
})

instance.interceptors.response.use(response => {
  return response
}, err => {
  const status = err.response.status
  // if (status === 400) {
  //   Toast.fail('客户端请求参数异常')
  // } else if (status === 401) {
  //   redirectLogin()
  // } else if (status === 403) {
  //   Toast.fail('没有操作权限')
  // } else if (status >= 500) {
  //   Toast.fail('服务端异常，请稍后重试')
  // }
  return Promise.reject(err)
})
const redirectLogin = () => {
  router.replace({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}
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