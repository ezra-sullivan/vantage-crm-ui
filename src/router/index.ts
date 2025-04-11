import { createRouter, createWebHistory } from 'vue-router'
import LoginView from "../views/auth/LoginView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
  ],
})

export default router
