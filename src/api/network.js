import axios from 'axios'
// 进行全局配置
axios.defaults.baseURL = 'http://127.0.0.1:7001'
// 设置超时时间
axios.defaults.timeout = 3000
// 让axios在请求头中带上cookie
axios.defaults.withCredentials = true
// 拦截器
// 请求拦截器
axios.interceptors.request.use(function (config) {
  return config
}, function (error) {
  return Promise.reject(error)
})
// 响应拦截器
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error)
})
// 封装自己的get/post请求方法
export default {
  get: function (path = '', data = {}) {
    return new Promise(function (resolve, reject) {
      axios.get(path, {
        params: data
      })
        .then(function (response) {
          // console.log(response);
          resolve(response.data)
        })
        .catch(function (error) {
          // console.log(error);
          reject(error)
        })
    })
  },
  post: function (path = '', data = {}) {
    return new Promise(function (resolve, reject) {
      axios.post(path, data, { withCredentials: true })
        .then(function (response) {
          // console.log(response);
          resolve(response.data)
        })
        .catch(function (error) {
          // console.log(error);
          reject(error)
        })
    })
  },
  all: function (list) {
    return new Promise(function (resolve, reject) {
      axios.all(list)
        .then(axios.spread(function (...res) {
          // 两个请求现在都执行完成
          resolve(res)
        }))
        .catch(function (err) {
          reject(err)
        })
    })
  }
}
