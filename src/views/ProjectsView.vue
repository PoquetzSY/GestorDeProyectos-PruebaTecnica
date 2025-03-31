<template>
  <MainLayout>
    <div class="flex flex-col gap-6">
      <h1 class="text-4xl font-bold">Proyectos</h1>
      <div class="flex justify-end">
        <AddEditProject @refresh="fetchProjects" />
      </div>

      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <LoadingSpinner/>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardInfo
          v-for="project in projects"
          :key="project.id"
          :id="project.id"
          :title="project.name"
          :description="project.description"
        >
          <template #delete>
            <DeleteProject
              :title="project.name"
              :id-to-delete="project.id"
              @refresh="fetchProjects"
            />
          </template>
          <template #actions>
            <StatusPillProjects
              v-model="project.status.id"
              :project-id="project.id"
            />

            <div class="flex gap-2 items-center">
              <AddEditProject :project-id="project.id" :to-update="true" @refresh="fetchProjects" />
              <AddDeveloper :projectId="project.id" />
              <button class="cursor-pointer text-gray-700" @click="toRoute(`/tasks/${project.id}`)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="currentColor"
                >
                  <path
                    d="m438-240 226-226-58-58-169 169-84-84-57 57 142 142ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"
                  />
                </svg>
              </button>
            </div>
          </template>
        </CardInfo>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import CardInfo from '@/components/common/CardInfo.vue'
import AddEditProject from '@/modals/add-edit/AddEditProject.vue'
import AddDeveloper from '@/modals/add-edit/AddDeveloper.vue'
import DeleteProject from '@/modals/delete/DeleteProject.vue'
import StatusPillProjects from '@/components/common/StatusPillProjects.vue'
import ProjectService from '@/api/ProjectsFacade'
import { showToast } from '@/utils/alerts'

const projects = ref([])
const isLoading = ref(false)
const router = useRouter()

const toRoute = (route) => {
  router.push(route)
}

const fetchProjects = async () => {
  isLoading.value = true
  try {
    const response = await ProjectService.listProjects()
    projects.value = response.data.data
  } catch (error) {
    console.error('Error al obtener los proyectos:', error)
    showToast('error', 'Error al cargar los proyectos', error.message)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchProjects)
</script>

<style scoped></style>
