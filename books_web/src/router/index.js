import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: () => import('@/views/Register') },
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

  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
