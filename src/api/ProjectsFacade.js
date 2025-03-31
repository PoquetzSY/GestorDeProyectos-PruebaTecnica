import ApiService from './ApiService'

export default class ProjectService {
  static async listProjects() {
    return ApiService.get('/projects')
  }

  static async createProject(projectData) {
    return ApiService.post('/projects', projectData)
  }

  static async getProject(projectId) {
    return ApiService.get(`/projects/${projectId}`)
  }

  static async updateProject(projectId, projectData) {
    return ApiService.put(`/projects/${projectId}`, projectData)
  }

  static async getDevelopTesters() {
    return ApiService.get(`/projects/assignable-developers`)
  }

  static async deleteProject(projectId) {
    return ApiService.delete(`/projects/${projectId}`)
  }

  static async assignDevelopers(projectId, developerIds) {
    return ApiService.post(`/projects/${projectId}/developers`, {
      developer_ids: developerIds,
    })
  }

  static async getTasksByProject(projectId) {
    return ApiService.get(`/projects/${projectId}/tasks`)
  }

  static async changeProjectStatus(projectId, statusId) {
    return ApiService.put(`/projects/${projectId}/status`, { status_id: statusId })
  }

  static async getProjectStatus() {
    return ApiService.get('/projects/project-statuses')
  }
}
