import Vue from 'vue'
import VueRouter from 'vue-router'
import nprogress from 'nprogress'
import Login from '@/views/Login'
import store from '@/store'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login, meta: { isPublic: true } },
  { path: '/register', name: 'Register', component: () => import('@/views/Register'), meta: { isPublic: true } },
  {
    path: '/home', name: 'Home', component: () => import('@/views/Home'), redirect: '/book',
    children: [
      { path: '/book', name: 'Book', component: () => import('@/views/Book') },
      { path: '/category', name: 'Category', component: () => import('@/views/Category') },
      { path: '/department', name: 'Department', component: () => import('@/views/Department') },
      { path: '/major', name: 'Major', component: () => import('@/views/Major') },
      { path: '/class', name: 'Class', component: () => import('@/views/Class') },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  nprogress.start()
  if (!to.meta.isPublic && !window.sessionStorage.getItem('userToken')) {
    return next('/login')
  }
  next()
})
router.afterEach(() => {
  nprogress.done()
})
export default router
