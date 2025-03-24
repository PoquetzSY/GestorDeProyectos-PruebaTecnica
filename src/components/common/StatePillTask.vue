<template>
  <div class="relative">
    <button
      class="px-3 py-1 text-sm font-medium rounded-full transition-all"
      :class="statusClasses"
      @click="toggleDropdown"
      :disabled="isLoading"
    >
      {{ modelValue }}
    </button>
    <div v-if="isOpen" class="absolute top-full mt-2 w-40 bg-white rounded-lg shadow-lg z-10">
      <ul class="text-sm">
        <li
          v-for="state in states"
          :key="state"
          @click="updateStatus(state)"
          class="px-4 py-2 cursor-pointer hover:bg-gray-100"
        >
          {{ state }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TaskService from '@/api/TasksFacade'
import { showToast } from '@/utils/alerts'
import { useAuthStore } from '@/stores/authStore'

const props = defineProps({
  modelValue: { type: String, required: true },
  states: { type: Array, required: true },
  taskId: { type: Number, required: true },
})

const authStore = useAuthStore()

const userRole = authStore.user?.role_id

const emit = defineEmits(['update:modelValue', 'statusUpdated'])
const isOpen = ref(false)
const isLoading = ref(false)

const toggleDropdown = () => {
  if (userRole !== 3) return
  isOpen.value = !isOpen.value
}

const updateStatus = async (newStatus) => {
  if (newStatus === props.modelValue) return

  isLoading.value = true
  try {
    await TaskService.changeTaskStatus(props.taskId, newStatus)
    console.log(newStatus + ' ' + props.taskId)
    emit('update:modelValue', newStatus)
    emit('statusUpdated')
    showToast('success', 'Éxito', 'Estado actualizado correctamente')
  } catch (error) {
    console.error('Error al actualizar el estado:', error)
    showToast('error', 'Error', error.response?.data?.message || 'No se pudo actualizar el estado')
  } finally {
    isLoading.value = false
    isOpen.value = false
  }
}

const statusClasses = computed(() => {
  switch (props.modelValue) {
    case 'En proceso':
      return 'bg-yellow-100 text-yellow-600'
    case 'Finalizada':
      return 'bg-green-100 text-green-600'
    case 'En pruebas':
      return 'bg-blue-100 text-blue-600'
    case 'Bug':
      return 'bg-red-100 text-red-600'
    case 'En espera de asignación':
      return 'bg-gray-100 text-gray-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
})
</script>
