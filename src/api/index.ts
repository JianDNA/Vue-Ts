import Network from './network'
// 登录注册相关
export const registerUser = (data: {}) => Network.post('/register', data)
export const sendCode2Email = (data: {}) => Network.get('/emailCode', data)
export const sendCode2Phone = (data: {}) => Network.get('/smsCode', data)
export const loginUser = (data: {}) => Network.post('/login', data)
export const isLogin = () => Network.get('/isLogin')
// 用户管理相关
export const getUsers = (data: {}) => Network.get('/api/v1/users', data)
export const createUsers = (data: {}) => Network.post('/api/v1/users', data)
export const deleteUsers = (id: string) => Network.delete(`/api/v1/users/${id}`)
export const updateUsers = (id: string, data: {}) => Network.put(`/api/v1/users/${id}`, data)

// 角色管理相关
export const getRoles = (data: {}) => Network.get('/api/v1/roles', data)
export const createRoles = (data: {}) => Network.post('/api/v1/roles', data)
export const destroyRoles = (id: string) => Network.delete(`/api/v1/roles/${id}`)
export const updateRoles = (id: string, data: {}) => Network.put(`/api/v1/roles/${id}`, data)
