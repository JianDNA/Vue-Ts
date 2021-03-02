import axios from 'axios'
// 进行全局配置
axios.defaults.baseURL = 'http://127.0.0.1:7001'
// axios.defaults.baseURL = 'http://120.26.175.25:7055'
// axios.defaults.baseURL = 'http://admin.ddvt.cn/'
// 设置超时时间
axios.defaults.timeout = 3000
// 让axios在请求头中带上cookie
axios.defaults.withCredentials = true
const CancelToken = axios.CancelToken
const source = CancelToken.source()

// 拦截器
// 请求拦截器
axios.interceptors.request.use(function (config) {
  // 将token放到headers中
  // config.headers.Authorization = sessionStorage.getItem('token')
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
          resolve(response)
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
          resolve(response)
        })
        .catch(function (error) {
          // console.log(error);
          reject(error)
        })
    })
  },
  delete: function (path = '', data = {}) {
    return new Promise(function (resolve, reject) {
      axios.delete(path, { data: data })
        .then(function (response) {
          // console.log(response);
          resolve(response)
        })
        .catch(function (error) {
          // console.log(error);
          reject(error)
        })
    })
  },
  put: function (path = '', data = {}) {
    return new Promise(function (resolve, reject) {
      axios.put(path, data)
        .then(function (response) {
          // console.log(response);
          resolve(response)
        })
        .catch(function (error) {
          // console.log(error);
          reject(error)
        })
    })
  },
  all: function (list: any[]) {
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
