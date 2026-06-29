import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'

import HomeView from '../views/HomeView.vue'
import About from '../views/About.vue'
import Login from '../views/auth/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomeView',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
  ],  
})

const whiteList = ['/login']
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (whiteList.includes(to.path) && !authStore.token) {
    next()
  } else {
    if (authStore.token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
