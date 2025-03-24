<template>
  <MainLayout>
    <div class="flex flex-col gap-4">
      <h1 class="text-4xl font-bold mb-4">Tareas</h1>
      <div class="flex justify-end">
        <AddEditTask :project-id="projectId" @refresh="fetchTasks" :projectId="1" />
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
          v-for="task in tasks"
          :key="task.id"
          :id="task.id"
          :title="task.title"
          :description="task.description"
        >
          <template #delete>
            <DeleteTask :title="task.title" :id-to-delete="task.id" @refresh="fetchTasks" />
          </template>
          <template #actions>
            <StatusPillTask
              v-model="task.status"
              :task-id="task.id"
              :states="['En proceso', 'Finalizada', 'En pruebas', 'Bug', 'En espera de asignación']"
            />
            <div class="flex gap-2">
              <AddEditTask
                :task-id="task.id"
                :project-id="projectId"
                :to-update="true"
                @refresh="fetchTasks"
              />
              <AddDeveloper :task-id="task.id" :is-task="true" />
            </div>
          </template>
        </CardInfo>
      </div>
    </div>
  </MainLayout>
</template>
<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
import CardInfo from '@/components/cards/CardInfo.vue'
import AddEditTask from '@/components/modals/add-edit/AddEditTask.vue'
import DeleteTask from '@/components/modals/delete/DeleteTask.vue'
import AddDeveloper from '@/components/modals/add-edit/AddDeveloper.vue'
import StatusPillTask from '@/components/common/StatePillTask.vue'
import ProjectService from '@/api/ProjectsFacade'
import { showToast } from '@/utils/alerts'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const projectId = Number(route.params.projectId)

const isLoading = ref(false)
const tasks = ref([])

const fetchTasks = async () => {
  isLoading.value = true
  try {
    const response = await ProjectService.getTasksByProject(projectId)
    tasks.value = response.data
  } catch (error) {
    console.error('Error al obtener las tareas:', error)
    showToast('error', 'Error al cargar las tareas', error.message)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchTasks)
</script>

<style scoped></style>
