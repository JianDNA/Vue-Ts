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


const getActionRights = () => {
  const data = sessionStorage.getItem('userInfo')
  if (!data) return null
  const userInfo = JSON.parse(data)
  // console.log(userInfo)
  const actionRights = userInfo.rightsTree.filter((rights: any) => {
    if (rights.rightsType === 'action') return rights
  })
  return actionRights[0]
}

const isRequest = (actionRights: any, path: string, method: string) => {
  const reg = new RegExp(`^${actionRights.rightsPath}(/[0-9]*)?$`, 'i')
  if (reg.test(path) && actionRights.rightsMethod === method) return true
  if (actionRights.children) {
    for (let i = 0; i < actionRights.children.length; i++) {
      const item = actionRights.children[i]
      if (isRequest(item, path, method)) return true
    }
  }
  return false
}

const actionRights = getActionRights()

// 拦截器
// 请求拦截器
axios.interceptors.request.use(function (config) {
  // 将token放到headers中
  // config.headers.Authorization = sessionStorage.getItem('token')
  // console.log(actionRights)
  const curPath = config.url || ''
  const curMethod = config.method || ''
  if (curPath.startsWith('/api/v1')) {
    const flag = isRequest(actionRights, curPath, curMethod)
    if (!flag) {
      config.cancelToken = source.token
      source.cancel('没有对应的请求权限')
    }
  }
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
      // axios的 delete 方法的body传参需要给一个对象
      axios.delete(path, { data: data })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
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
