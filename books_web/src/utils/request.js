import axios from "axios";
import router from "@/router";
// import store from '@/store'
import { errorTip } from "@/utils/viewTools";
const instance = axios.create({
  baseURL: "http://localhost:3333" || process.env.VUE_APP_URL,
  timeout: 1000 * 12,
  transformResponse: [
    function(data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        return data;
      }
    }
  ]
});

instance.interceptors.request.use(
  config => {
    const userToken = window.sessionStorage.getItem("userToken");
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    return config;
  },
  err => {
    Promise.reject(err);
  }
);

instance.interceptors.response.use(
  response => {
    console.log(response);
    const status = response.data.status
    if (status !== 200 && status !== 201) {
      errorTip(response.data.msg ?? response.data.message ?? '请求失败');
    }
    return response;
  },
  err => {
    //
    errorTip(err);
    return Promise.reject(err);
  }
);
const redirectLogin = () => {
  router.replace({
    name: "login",
    query: {
      redirect: router.currentRoute.fullPath
    }
  });
};
const api = (method, uri, data, config) => {
  return new Promise((resolve, reject) => {
    instance[method](uri, data, config)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
};
export default api;
