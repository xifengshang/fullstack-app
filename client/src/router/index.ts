import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import About from '../views/About.vue'
import Login from '../views/auth/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView
    },
    {
      path: '/about',
      component: About
    },
    {
      path: '/login',
      component: Login
    },
  ],  
})

export default router
