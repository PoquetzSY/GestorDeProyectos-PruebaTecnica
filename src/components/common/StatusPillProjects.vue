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
import ProjectService from '@/api/ProjectsFacade'
import { useAuthStore } from '@/stores/authStore'
import { showToast } from '@/utils/alerts'
import { ref, computed } from 'vue'

const authStore = useAuthStore()

const userRole = authStore.user?.role_id

const props = defineProps({
  modelValue: { type: String, required: true },
  states: { type: Array, required: true },
  projectId: { type: Number, required: true },
})

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
    await ProjectService.changeProjectStatus(props.projectId, newStatus)
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
    case 'En desarrollo':
      return 'bg-blue-100 text-blue-600'
    case 'En pausa':
      return 'bg-yellow-100 text-yellow-600'
    case 'Finalizado':
      return 'bg-green-100 text-green-600'
    case 'Cancelado':
      return 'bg-red-100 text-red-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
})
</script>
