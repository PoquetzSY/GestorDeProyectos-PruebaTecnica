import ApiService from './ApiService'

export default class UserService {
  static async listUsers() {
    return ApiService.get('/users')
  }

  static async getUser(userId) {
    return ApiService.get(`/users/show/${userId}`)
  }

  static async getDevelopTesters() {
    return ApiService.get(`/users/testers-developers`)
  }

  static async createUser(userData) {
    return ApiService.post('/users/store', userData)
  }

  static async updateUser(userId, userData) {
    return ApiService.put(`/users/update/${userId}`, userData)
  }

  static async updateUserPassword(userId, passwordData) {
    return ApiService.put(`/users/update-password/${userId}`, passwordData)
  }

  static async deleteUser(userId) {
    return ApiService.delete(`/users/delete/${userId}`)
  }

  static async toggleUserStatus(userId) {
    return ApiService.put(`/users/active-inactive/${userId}`)
  }
}
