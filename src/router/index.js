import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import UserView from '@/views/UserView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import TasksView from '@/views/TasksView.vue'
import ProfileView from '@/views/ProfileView.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/users',
      name: 'users',
      component: UserView,
      meta: { requiresAuth: true, rolesPermitidos: [1] },
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView,
      meta: { requiresAuth: true, rolesPermitidos: [2, 3, 4] },
    },
    {
      path: '/tasks/:projectId',
      name: 'tasks',
      component: TasksView,
      meta: { requiresAuth: true, rolesPermitidos: [2, 3, 4] },
    },
    {
      path: '/profile/:userId',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true, rolesPermitidos: [1, 2, 3, 4] },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    authStore.loadSession()
  }

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next('/')
    }

    const userRole = authStore.user?.role_id

    if (!to.meta.rolesPermitidos.includes(userRole)) {
      if (userRole === 1) {
        return next('/users')
      } else {
        return next('/projects')
      }
    }
  }

  next()
})

export default router
