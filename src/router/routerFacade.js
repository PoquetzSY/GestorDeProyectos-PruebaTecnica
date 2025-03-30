import { useAuthStore } from '@/stores/authStore'

export default class RouterFacade {
  static isAuthenticated() {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      authStore.loadSession()
    }
    return authStore.isAuthenticated
  }

  static hasPermission(route) {
    const authStore = useAuthStore()
    const userRole = authStore.user?.role_id

    return route.meta.rolesPermitidos.includes(userRole)
  }

  static handleUnauthorizedAccess(userRole, next) {
    if (userRole === 1) {
      return next('/users')
    }
    return next('/projects')
  }
}