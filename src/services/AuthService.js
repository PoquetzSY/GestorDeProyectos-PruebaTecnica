import ApiService from './ApiService'

export default class AuthService {
  static async login(credentials) {
    return ApiService.post('/login', credentials)
  }
}
