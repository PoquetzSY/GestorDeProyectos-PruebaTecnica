<template>
  <div>
    <button class="focus:outline-0 text-sky-600 cursor-pointer" @click="openModal">
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

    <ModalBase v-model="isOpen" title="Editar usuario" @close="resetForm">
      <form class="flex flex-col gap-4 items-end" @submit.prevent="onSubmit">
        <CustomInput v-model="formData.name" :error-message="errors.name" label="Nombre" />
        <FormGroup>
          <CustomInput
            v-model="formData.last_name_p"
            :error-message="errors.last_name_p"
            label="Apellido Paterno"
          />
          <CustomInput
            v-model="formData.last_name_m"
            :error-message="errors.last_name_m"
            label="Apellido Materno"
          />
        </FormGroup>
        <FormGroup>
          <CustomInput
            v-model="formData.email"
            :error-message="errors.email"
            label="Correo electrónico"
          />
          <CustomSelect
            v-model="formData.role_id"
            :error-message="errors.role_id"
            label="Rol"
            :options="roleOptions"
          />
        </FormGroup>
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
    </ModalBase>
  </div>
</template>

<script setup>
import MainButton from '@/components/common/MainButton.vue'
import CustomInput from '@/components/form/CustomInput.vue'
import CustomSelect from '@/components/form/CustomSelect.vue'
import ModalBase from '@/modals/ModalBase.vue'
import FormGroup from '@/components/form/FormGroup.vue'
import { useFormValidation } from '@/utils/formValidation'
import { showToast } from '@/utils/alerts'
import UserService from '@/api/UserFacade'
import { ref } from 'vue'

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['refresh'])

const isOpen = ref(false)
const isLoading = ref(false)

const formData = ref({
  name: '',
  last_name_p: '',
  last_name_m: '',
  email: '',
  role_id: 0,
})

const errors = ref({
  name: '',
  last_name_p: '',
  last_name_m: '',
  email: '',
  role_id: '',
})

const roleOptions = [
  { id: 1, name: 'RH' },
  { id: 2, name: 'Desarrollador' },
  { id: 3, name: 'Planeación' },
  { id: 4, name: 'Tester' },
]

const openModal = async () => {
  if (props.userId) {
    try {
      const response = await UserService.getUser(props.userId)
      formData.value = { ...response.data }
    } catch (error) {
      console.error('Error al cargar el usuario:', error)
      showToast('error', 'Error', error)
      resetForm()
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
    last_name_p: '',
    last_name_m: '',
    email: '',
    role_id: 0,
  }
  errors.value = {
    name: '',
    last_name_p: '',
    last_name_m: '',
    email: '',
    role_id: '',
  }
}

const fieldValidations = {
  name: { message: 'El nombre es obligatorio' },
  last_name_p: { message: 'El apellido paterno es obligatorio' },
  last_name_m: { message: 'El apellido materno es obligatorio' },
  email: { message: 'El correo electrónico es obligatorio', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  role_id: { message: 'El rol es obligatorio' },
}

const { validateForm } = useFormValidation(formData, errors, fieldValidations)

const onSubmit = async () => {
  if (!validateForm()) return
  isLoading.value = true

  try {
    await UserService.updateUser(props.userId, formData.value)
    showToast('success', 'Usuario actualizado correctamente')

    emit('refresh', true)
    closeModal()
  } catch (error) {
    showToast('error', 'Error', error.message || 'Ocurrió un error al actualizar el usuario')
  } finally {
    isLoading.value = false
  }
}
</script>
