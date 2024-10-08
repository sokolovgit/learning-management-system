import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/HomePage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/LoginPage.vue')
  },
  {
    path: '/auth/google/callback',
    name: 'GoogleCallback',
    component: () => import('../pages/GoogleCallbackPage.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../pages/DashboardPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/courses',
    name: 'Courses',
    component: () => import('../pages/CoursesPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/courses/:id',
    name: 'Course',
    component: () => import('../pages/CoursePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFoundPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    console.log('Not authenticated')
    authStore.logout()
    next({ name: 'Login' })
  } else if (to.meta.requiresAuth && authStore.isTokenExpired()) {
    console.log('Token expired')
    authStore.logout()
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
