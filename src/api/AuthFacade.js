import ApiService from './ApiService'
import { useAuthStore } from '@/stores/authStore'

export default class AuthService {
  static async login(credentials) {
    try {
      const response = await ApiService.post('/login', credentials)
      const authStore = useAuthStore()
      authStore.setUserData({ token: response.token, user: response.user })
      return response
    } catch (error) {
      console.error('Error en login:', error.message)
      throw error
    }
  }
}