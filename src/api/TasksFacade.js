import ApiService from './ApiService'

export default class TaskService {
  static async listTasks() {
    return ApiService.get(`/tasks`)
  }

  static async createTask(taskData) {
    return ApiService.post(`/tasks`, taskData)
  }

  static async updateTask(taskId, taskData) {
    return ApiService.put(`/tasks/${taskId}`, taskData)
  }

  static async getTask(taskId) {
    return ApiService.get(`/tasks/${taskId}`)
  }

  static async deleteTask(taskId) {
    return ApiService.delete(`/tasks/${taskId}`)
  }

  static async assignDevelopers(taskId, userIds) {
    return ApiService.put(`/tasks/${taskId}/assing`, { user_ids: userIds })
  }

  static async changeTaskStatus(taskId, status) {
    return ApiService.put(`/tasks/${taskId}/status`, { status })
  }
  static async getTaskStatus() {
    return ApiService.get('/tasks/task-statuses')
  }
}
