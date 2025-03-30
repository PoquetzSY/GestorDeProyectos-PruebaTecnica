import ApiService from './ApiService'

export default class ProjectService {
  static async listProjects() {
    return ApiService.get('/projects/index')
  }

  static async createProject(projectData) {
    return ApiService.post('/projects/store', projectData)
  }

  static async getProject(projectId) {
    return ApiService.get(`/projects/show/${projectId}`)
  }

  static async updateProject(projectId, projectData) {
    return ApiService.put(`/projects/update/${projectId}`, projectData)
  }

  static async deleteProject(projectId) {
    return ApiService.delete(`/projects/delete/${projectId}`)
  }

  static async assignDevelopers(projectId, developerIds) {
    return ApiService.post(`/projects/assign-developers/${projectId}`, {
      developer_ids: developerIds,
    })
  }

  static async getTasksByProject(projectId) {
    return ApiService.get(`/projects/task-project/${projectId}`)
  }

  static async changeProjectStatus(projectId, status) {
    return ApiService.put(`/projects/update-status/${projectId}`, { status })
  }

  static async listDevelopers() {
    return ApiService.get('/developers')
  }

  static async listTesters() {
    return ApiService.get('/testers')
  }
}
