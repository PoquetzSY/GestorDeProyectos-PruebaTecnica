import ApiService from './ApiService'

export default class TaskService {
  static async listTasks() {
    return ApiService.get(`/tasks`)
  }

  static async createTask(taskData) {
    return ApiService.post('/tasks', taskData)
  }

  static async updateTask(taskId, taskData) {
    return ApiService.put(`/tasks/update/${taskId}`, taskData)
  }

  static async getTask(taskId) {
    return ApiService.get(`/tasks/show/${taskId}`)
  }

  static async deleteTask(taskId) {
    return ApiService.delete(`/tasks/delete/${taskId}`)
  }

  static async assignUsers(taskId, userIds) {
    return ApiService.put(`/tasks/assign/${taskId}`, { user_ids: userIds })
  }

  static async changeTaskStatus(taskId, status) {
    return ApiService.put(`/tasks/update-status/${taskId}`, { status })
  }
}
