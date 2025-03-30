<template>
  <div v-if="userRole === 3">
    <button @click="openModal" class="text-emerald-600 cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
      >
        <path
          d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z"
        />
      </svg>
    </button>

    <Transition>
      <div v-show="isOpen" class="bg-black/50 fixed inset-0 z-20 flex justify-center items-center">
        <div class="bg-white p-7 rounded-xl w-lg flex flex-col gap-4">
          <div class="flex justify-end items-center">
            <button @click="closeModal" class="focus:outline-0 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
              >
                <path
                  d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
                />
              </svg>
            </button>
          </div>
          <h2 class="text-2xl font-bold text-center">Asignar desarrolladores</h2>

          <form class="flex flex-col gap-4 items-end" @submit.prevent="onSubmit">
            <CustomSelect
              v-model="selectedUsers"
              :error-message="errors.developers"
              id="developers"
              label="Seleccionar desarrolladores"
              :options="userOptions"
              multiple
            />

            <MainButton type="submit">
              <span v-if="!isLoading">Guardar</span>
              <svg
                v-else
                class="animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
              >
                <path
                  d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z"
                />
              </svg>
            </MainButton>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import MainButton from '@/components/common/MainButton.vue'
import CustomSelect from '@/components/form/CustomSelect.vue'
import UserService from '@/api/UserFacade'
import ProjectService from '@/api/ProjectsFacade'
import TaskService from '@/api/TasksFacade'
import { useAuthStore } from '@/stores/authStore'
import { showToast } from '@/utils/alerts'
import { ref } from 'vue'

const authStore = useAuthStore()

const userRole = authStore.user?.role_id

const props = defineProps({
  projectId: {
    type: Number,
    default: null,
  },
  isTask: {
    type: Boolean,
    default: false,
  },
  taskId: {
    type: Number,
    default: null,
  },
})

const isOpen = ref(false)
const isLoading = ref(false)
const selectedUsers = ref([])
const userOptions = ref([])

const errors = ref({
  developers: '',
})

const fetchUsers = async () => {
  try {
    const response = await UserService.getDevelopTesters()
    userOptions.value - response.data
  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
    showToast('error', 'Error al obtener la lista de usuarios')
  }
}

const openModal = async () => {
  await fetchUsers()
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
  selectedUsers.value = []
  errors.value.developers = ''
}

const validateForm = () => {
  if (selectedUsers.value.length === 0) {
    errors.value.developers = 'Debes seleccionar al menos un desarrollador'
    return false
  }
  errors.value.developers = ''
  return true
}

const onSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    if (props.isTask) {
      await TaskService.assignDevelopers(props.taskId, selectedUsers.value)
    } else {
      await ProjectService.assignDevelopers(props.projectId, selectedUsers.value)
    }
    showToast('success', 'Desarrolladores asignados correctamente')
    closeModal()
  } catch (error) {
    console.error('Error asignando usuarios:', error)
    showToast(
      'error',
      'Error al asignar usuarios',
      error.response?.data?.message || 'Ocurrió un error',
    )
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
