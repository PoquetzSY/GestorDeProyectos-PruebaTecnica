<template>
  <div v-if="userRole === 3">
    <MainButton v-show="!props.toUpdate" variant="outline" @buttonClick="openModal">
      Nuevo proyecto
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
    <ModalBase v-model="isOpen">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold mb-4">
          {{ props.toUpdate ? 'Editar proyecto' : 'Nuevo proyecto' }}
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
          v-model="formData.name"
          :error-message="errors.name"
          id="name"
          label="Nombre"
        />
        <CustomInput
          v-model="formData.description"
          :error-message="errors.description"
          id="description"
          label="Descripción"
        />
        <MainButton type="submit">
          <span v-if="!isLoading">Guardar</span>
          <LoadingSpinner v-if="isLoading" />
        </MainButton>
      </form>
    </ModalBase>
  </div>
</template>

<script setup lang="ts">
import MainButton from '@/components/common/MainButton.vue'
import CustomInput from '@/components/form/CustomInput.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ModalBase from '@/modals/ModalBase.vue'
import ProjectService from '@/api/ProjectsFacade'
import { useAuthStore } from '@/stores/authStore'
import { useFormValidation } from '@/utils/formValidation'
import { showToast } from '@/utils/alerts'
import { ref } from 'vue'

const authStore = useAuthStore()

const userRole = authStore.user?.role_id

const props = defineProps({
  toUpdate: { type: Boolean, default: false },
  projectId: { type: Number, default: null },
})

const emit = defineEmits(['refresh'])

const isOpen = ref(false)
const isLoading = ref(false)

const formData = ref({
  name: '',
  description: '',
})

const errors = ref({
  name: '',
  description: '',
})

const openModal = async () => {
  if (props.toUpdate && props.projectId) {
    try {
      const response = await ProjectService.getProject(props.projectId)
      formData.value = { ...response.data }
    } catch (error) {
      console.error(error)
      showToast('error', 'Error al obtener el proyecto', error)
      closeModal()
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
    name: '',
    description: '',
  }
  errors.value = {
    name: '',
    description: '',
  }
}

const fieldValidations = {
  name: { message: 'El nombre es obligatorio' },
  description: { message: 'La descripción es obligatoria' },
}

const { validateForm } = useFormValidation(formData, errors, fieldValidations)

const onSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    if (props.toUpdate && props.projectId) {
      await ProjectService.updateProject(props.projectId, formData.value)
      showToast('success', 'Proyecto actualizado correctamente')
    } else {
      await ProjectService.createProject(formData.value)
      showToast('success', 'Proyecto creado correctamente')
    }

    emit('refresh', true)
    closeModal()
  } catch (error) {
    showToast('error', 'Error', error.message || 'Ocurrió un error al guardar el proyecto')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
