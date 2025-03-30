<template>
  <MainLayout>
    <div class="flex flex-col gap-6">
      <h1 class="text-4xl font-bold">Proyectos</h1>
      <div class="flex justify-end">
        <AddEditProject @refresh="fetchProjects" />
      </div>

      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <svg
          class="animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          viewBox="0 -960 960 960"
          width="32px"
          fill="currentColor"
        >
          <path
            d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z"
          />
        </svg>
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
            <StatusPill
              v-model="project.status"
              :project-id="project.id"
              :states="['En pausa', 'En desarrollo', 'Finalizado', 'Cancelado']"
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
import MainLayout from '@/layouts/MainLayout.vue'
import CardInfo from '@/components/cards/CardInfo.vue'
import AddEditProject from '@/components/modals/add-edit/AddEditProject.vue'
import AddDeveloper from '@/components/modals/add-edit/AddDeveloper.vue'
import DeleteProject from '@/components/modals/delete/DeleteProject.vue'
import StatusPill from '@/components/common/StatusPillProjects.vue'
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
