import Vue from 'vue'
import VueRouter from 'vue-router'
import RoomPage from '../pages/RoomPage.vue'
import EntryPage from '../pages/EntryPage.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'EntryPage',
    component: EntryPage
  },
  {
    path: '/room',
    name: 'RoomPage',
    component: RoomPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
