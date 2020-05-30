import Vue from 'vue'
import VueRouter from 'vue-router'
import TeacherPage from '../pages/TeacherPage.vue'
import EntryPage from '../pages/EntryPage.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'EntryPage',
    component: EntryPage
  },
  {
    path: '/teacher',
    name: 'TeacherPage',
    component: TeacherPage
  },
  {
<<<<<<< HEAD
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
=======
    path: '/entrymobilepage',
    name: 'EntryMobilePage',
    component: EntryMobilePage
  },
>>>>>>> cd1a611eee01905b10e7b2080db611ed9bf04328
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
