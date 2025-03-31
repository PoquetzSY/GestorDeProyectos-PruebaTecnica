<template>
  <MainLayout>
    <div class="flex flex-col gap-4">
      <h1 class="text-4xl font-bold mb-4">Tareas</h1>
      <div class="flex justify-end">
        <AddEditTask :project-id="projectId" @refresh="fetchTasks" :projectId="1" />
      </div>

      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <LoadingSpinner />
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
            <StatusPillTask v-model="task.status_id" :task-id="task.id" />
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
import CardInfo from '@/components/common/CardInfo.vue'
import AddEditTask from '@/modals/add-edit/AddEditTask.vue'
import DeleteTask from '@/modals/delete/DeleteTask.vue'
import AddDeveloper from '@/modals/add-edit/AddDeveloper.vue'
import StatusPillTask from '@/components/common/StatePillTask.vue'
import { showToast } from '@/utils/alerts'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import TaskService from '@/api/TasksFacade'

const route = useRoute()
const projectId = Number(route.params.projectId)

const isLoading = ref(false)
const tasks = ref([])

const fetchTasks = async () => {
  isLoading.value = true
  try {
    const response = await TaskService.listTasks()
    tasks.value = response.data.data
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
