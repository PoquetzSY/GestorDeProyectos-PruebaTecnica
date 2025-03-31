<template>
  <div v-if="userRole === 3">
    <MainButton v-show="!props.toUpdate" variant="outline" @buttonClick="openModal">
      Nueva tarea
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
      >
        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
      </svg>
    </MainButton>

    <button
      v-show="props.toUpdate"
      class="focus:outline-0 text-sky-600 cursor-pointer"
      @click="openModal"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
      >
        <path
          d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
        />
      </svg>
    </button>

    <Transition>
      <div v-show="isOpen" class="bg-black/50 fixed inset-0 z-20 flex justify-center items-center">
        <div class="bg-white p-10 rounded-xl w-lg">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold mb-4">
              {{ props.toUpdate ? 'Editar tarea' : 'Nueva tarea' }}
            </h2>
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

          <form class="flex flex-col gap-4 items-end" @submit.prevent="onSubmit">
            <CustomInput
              v-model="formData.title"
              :error-message="errors.title"
              id="title"
              label="Título"
            />
            <CustomInput
              v-model="formData.description"
              :error-message="errors.description"
              id="description"
              label="Descripción"
            />
            <MainButton type="submit">
              <span v-if="!isLoading">Guardar</span>
              <LoadingSpinner v-if="isLoading"/>
            </MainButton>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import MainButton from '@/components/common/MainButton.vue'
import CustomInput from '@/components/form/CustomInput.vue'
import TaskService from '@/api/TasksFacade'
import { useAuthStore } from '@/stores/authStore'
import { useFormValidation } from '@/utils/formValidation'
import { showToast } from '@/utils/alerts'
import { ref } from 'vue'

const authStore = useAuthStore()

const userRole = authStore.user?.role_id

const props = defineProps({
  toUpdate: { type: Boolean, default: false },
  projectId: { type: Number, required: true },
  taskId: { type: Number, default: null },
})

const emit = defineEmits(['refresh'])

const isOpen = ref(false)
const isLoading = ref(false)

const formData = ref({
  title: '',
  description: '',
  project_id: props.projectId,
})

const errors = ref({
  title: '',
  description: '',
})

const openModal = async () => {
  if (props.toUpdate && props.taskId) {
    try {
      const response = await TaskService.getTask(props.taskId)
      formData.value = {
        title: response.data.title,
        description: response.data.description,
        project_id: response.data.project_id,
      }
    } catch (error) {
      console.error('Error al cargar la tarea:', error)
      showToast('error', 'Error', 'No se pudo cargar la tarea')
      return
    }
  }
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
  resetForm()
}

const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    project_id: props.projectId,
  }
  errors.value = {
    title: '',
    description: '',
  }
}

const fieldValidations = {
  title: { message: 'El título es obligatorio' },
  description: { message: 'La descripción es obligatoria' },
}

const { validateForm } = useFormValidation(formData, errors, fieldValidations)

const onSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    if (props.toUpdate && props.taskId) {
      await TaskService.updateTask(props.taskId, formData.value)
      showToast('success', 'Éxito', 'Tarea actualizada correctamente')
    } else {
      await TaskService.createTask(formData.value)
      showToast('success', 'Éxito', 'Tarea creada correctamente')
    }

    emit('refresh')
    closeModal()
  } catch (error) {
    console.error('Error al guardar tarea:', error)
    showToast('error', 'Error', 'No se pudo guardar la tarea')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
