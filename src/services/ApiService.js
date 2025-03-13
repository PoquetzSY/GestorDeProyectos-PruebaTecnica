import { useAuthStore } from '@/stores/authStore'

const BASE_URL = 'https://8fdc-2806-103e-27-bcf0-c961-98c3-b2f4-68b6.ngrok-free.app/api/v1'

const getAuthHeaders = () => {
  const authStore = useAuthStore()
  return {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    Authorization: `Bearer ${authStore.token}`,
  }
}

export default class ApiService {
  static async get(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return response.json()
  }

  static async post(endpoint, data) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return response.json()
  }

  static async put(endpoint, data) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return response.json()
  }

  static async delete(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    return response.json()
  }
}
