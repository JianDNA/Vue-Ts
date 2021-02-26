import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Admin from '@/views/Admin.vue'
Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/register',
    name: 'Register ',
    component: Register
  },
  {
    path: '/login',
    name: 'Login ',
    component: Login
  },
  {
    path: '/admin',
    name: 'Admin ',
    component: Admin
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 全局前置守卫: 添加路由守卫, 添加权限控制
router.beforeEach((to, from, next) => {
  // 1.白名单, 注册或登录放行
  if (to.path === '/login' || to.path === '/register') {
    return next()
  }
  // 2.其他路由: 获取当前登录状态
  const token = sessionStorage.getItem('token')
  // 3. 判断是否已经登录, 如果已经登录就放行, 否则强制跳转到登录界面
  if (!token) {
    return next('/login')
  }
  next()
})

export default router
