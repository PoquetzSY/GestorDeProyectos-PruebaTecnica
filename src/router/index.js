import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'
import UserView from '@/views/UserView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import TasksView from '@/views/TasksView.vue'
import ProfileView from '@/views/ProfileView.vue'
import RouterFacade from '@/api/RouterFacade'

const routes = [
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
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (!RouterFacade.isAuthenticated()) {
      sessionStorage.setItem('lastAttemptedRoute', to.fullPath)
      return next('/')
    }

    if (!RouterFacade.hasPermission(to)) {
      return RouterFacade.handleUnauthorizedAccess(useAuthStore().user?.role_id, next)
    }
  }

  next()
})


export default router