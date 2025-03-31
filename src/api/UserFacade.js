import ApiService from './ApiService'

export default class UserService {
  static async listUsers() {
    return ApiService.get('/users')
  }

  static async getUser(userId) {
    return ApiService.get(`/users/${userId}`)
  }

  static async getProfile(userId) {
    return ApiService.get(`/profile/${userId}`)
  }

  static async getUserRoles() {
    return ApiService.get('/users/roles')
  }

  static async createUser(userData) {
    return ApiService.post('/users', userData)
  }

  static async updateUser(userId, userData) {
    return ApiService.put(`/users/${userId}`, userData)
  }

  static async updateUserPassword(userId, passwordData) {
    return ApiService.put(`/users/${userId}/password`, passwordData)
  }

  static async deleteUser(userId) {
    return ApiService.delete(`/users/${userId}`)
  }

  static async toggleUserStatus(userId) {
    return ApiService.put(`/users/${userId}/status`)
  }
}
