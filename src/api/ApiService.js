import { useAuthStore } from '@/stores/authStore'

const BASE_URL = 'https://71d1-2806-103e-27-3781-ddfa-d5e0-66ab-d5ee.ngrok-free.app/api/v1'

const getAuthHeaders = () => {
  const authStore = useAuthStore()
  return {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    Authorization: `Bearer ${authStore.token}`,
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error en la solicitud')
  }
  return response.json()
}

export default class ApiService {
  static async request(endpoint, method, data = null) {
    const options = {
      method,
      headers: getAuthHeaders(),
      body: data ? JSON.stringify(data) : null,
      mode: 'cors',
    }
    const response = await fetch(`${BASE_URL}${endpoint}`, options)
    return handleResponse(response)
  }

  static get(endpoint) {
    return this.request(endpoint, 'GET')
  }

  static post(endpoint, data) {
    return this.request(endpoint, 'POST', data)
  }

  static put(endpoint, data) {
    return this.request(endpoint, 'PUT', data)
  }

  static delete(endpoint) {
    return this.request(endpoint, 'DELETE')
  }
}
