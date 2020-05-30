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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
