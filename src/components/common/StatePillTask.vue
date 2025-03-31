<template>
  <div class="relative">
    <button
      class="px-3 py-1 text-sm font-medium rounded-full transition-all"
      :class="statusClasses"
      @click="toggleDropdown"
      :disabled="isLoading"
    >
      {{ states.find((state) => state.id === modelValue)?.name || 'Planeación' }}
    </button>
    <div v-if="isOpen" class="absolute top-full mt-2 w-40 bg-white rounded-lg shadow-lg z-10">
      <ul class="text-sm">
        <li
          v-for="state in states"
          :key="state.id"
          @click="updateStatus(state)"
          class="px-4 py-2 cursor-pointer hover:bg-gray-100"
        >
          {{ state.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TaskService from '@/api/TasksFacade'
import { showToast } from '@/utils/alerts'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const userRole = authStore.user?.role_id

const props = defineProps({
  modelValue: { type: Number, required: true },
  taskId: { type: Number, required: true },
})

const emit = defineEmits(['update:modelValue', 'statusUpdated'])

const states = ref([])
const isLoading = ref(false)
const isOpen = ref(false)

const fetchStates = async () => {
  isLoading.value = true
  try {
    const response = await TaskService.getTaskStatus()
    states.value = response.data
  } catch (error) {
    console.error('Error al obtener los estados:', error)
  } finally {
    isLoading.value = false
  }
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const updateStatus = async (newStatus) => {
  if (newStatus.id === props.modelValue) return

  isLoading.value = true
  try {
    await TaskService.changeTaskStatus(props.projectId, newStatus.id)
    emit('update:modelValue', newStatus.id)
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
    case 1:
      return 'bg-gray-100 text-gray-600'
    case 2:
      return 'bg-yellow-100 text-yellow-600'
    case 3:
      return 'bg-blue-100 text-blue-600'
    case 4:
      return 'bg-red-100 text-red-600'
    case 5:
      return 'bg-green-100 text-green-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
})

onMounted(fetchStates)
</script>
