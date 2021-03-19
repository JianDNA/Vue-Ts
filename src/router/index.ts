import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Admin from '@/views/Admin.vue'
import Welcome from '../components/Welcome.vue'
import Users from '@/components/Users.vue'
import Rights from '@/components/Rights.vue'
import Roles from '@/components/Roles.vue'
import Cookies from 'js-cookie'
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
    component: Admin,
    redirect: 'welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
const getRouterRights = () => {
  const data = sessionStorage.getItem('userInfo')
  if (!data) return null
  const userInfo = JSON.parse(data)
  const routerRights = userInfo.rightsTree.filter((rights: any) => {
    if (rights.rightsType === 'router') return rights
  })
  return routerRights[0]
}

const isNext = (routerRights: any, path: string) => {
  // console.log(routerRights.rightsPath)
  if (routerRights.rightsPath === path) return true
  if (routerRights.children) {
    for (let i = 0; i < routerRights.children.length; i++) {
      const item = routerRights.children[i]
      if (isNext(item, path)) return true
    }
  }
  return false
}
// 全局前置守卫: 添加路由守卫, 添加权限控制
router.beforeEach((to, from, next) => {
  // 1.白名单, 注册或登录放行
  if (to.path === '/login' || to.path === '/register') {
    return next()
  }
  // 2.其他路由: 获取当前登录状态
  // const token = sessionStorage.getItem('token')
  const token = Cookies.get('token')
  console.log(token, '!!!!')
  // 3. 判断是否已经登录, 如果已经登录就放行, 否则强制跳转到登录界面
  if (!token) {
    return next('/login')
  }
  const routerRights = getRouterRights()
  // console.log(routerRights)
  const flag = isNext(routerRights, to.path)
  if (flag) {
    next()
  } else {
    next(false)
  }
})

export default router
