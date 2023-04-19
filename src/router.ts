import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import AboutView from './views/AboutView.vue'
import AccountView from './views/AccountView.vue'
import QTableView from './views/QTableView.vue'
import StartPageView from './views/StartPageView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'StartPage',
    component: StartPageView,
  },
  {
    path: '/account',
    name: 'account',
    component: AccountView,
  },
  {
    path: '/qtable',
    name: 'qtable',
    component: QTableView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  next()
})
export default router
