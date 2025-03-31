import { useAuthStore } from '@/stores/authStore'

const BASE_URL = 'https://evaluacion2-production-5aec.up.railway.app/api/v1'

const getAuthHeaders = () => {
  const authStore = useAuthStore()
  return {
    'Content-Type': 'application/json',
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
