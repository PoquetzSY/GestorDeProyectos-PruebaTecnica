<template>
  <div>
    <MainButton variant="outline" @buttonClick="openModal">
      Nuevo usuario
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

    <Transition>
      <div v-show="isOpen" class="bg-black/50 fixed inset-0 z-20 flex justify-center items-center">
        <div class="bg-white p-10 rounded-xl w-lg">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold mb-4">Nuevo usuario</h2>
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
            <div class="flex gap-4">
              <CustomInput
                v-model="formData.last_name_p"
                :error-message="errors.last_name_p"
                id="firstLastName"
                label="Apellido Paterno"
              />
              <CustomInput
                v-model="formData.last_name_m"
                :error-message="errors.last_name_m"
                id="secondLastName"
                label="Apellido Materno"
              />
            </div>
            <CustomInput
              v-model="formData.email"
              :error-message="errors.email"
              id="email"
              label="Correo electrónico"
            />
            <div class="flex gap-4">
              <CustomInput
                v-model="formData.password"
                :error-message="errors.password"
                id="password"
                label="Contraseña"
                type="password"
              />
              <CustomSelect
                v-model="formData.role"
                :error-message="errors.role"
                id="role"
                label="Rol"
                :options="roleOptions"
              />
            </div>
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
import CustomInput from '@/components/form/CustomInput.vue'
import CustomSelect from '@/components/form/CustomSelect.vue'
import { useFormValidation } from '@/utils/formValidation'
import { showToast } from '@/utils/alerts'
import UserService from '@/api/UserFacade'
import { ref } from 'vue'

const emit = defineEmits(['refresh'])

const isOpen = ref(false)
const isLoading = ref(false)

const formData = ref({
  name: '',
  last_name_p: '',
  last_name_m: '',
  email: '',
  password: '',
  role: 0,
})

const errors = ref({
  name: '',
  last_name_p: '',
  last_name_m: '',
  email: '',
  password: '',
  role: '',
})

const roleOptions = [
  { id: 1, name: 'RH' },
  { id: 2, name: 'Desarrollador' },
  { id: 3, name: 'Planeación' },
  { id: 4, name: 'Tester' },
]

const openModal = () => {
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
    password: '',
    role: 0,
  }
  errors.value = {
    name: '',
    last_name_p: '',
    last_name_m: '',
    email: '',
    password: '',
    role: '',
  }
}

const fieldValidations = {
  name: { message: 'El nombre es obligatorio' },
  last_name_p: { message: 'El apellido paterno es obligatorio' },
  last_name_m: { message: 'El apellido materno es obligatorio' },
  email: { message: 'El correo electrónico es obligatorio', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: {
    message: 'La contraseña es obligatoria',
    customValidation: (value) =>
      value.length >= 8 || 'La contraseña debe ser de al menos 8 caracteres',
  },
  role: { message: 'El rol es obligatorio' },
}

const { validateForm } = useFormValidation(formData, errors, fieldValidations)

const onSubmit = async () => {
  if (!validateForm()) return
  isLoading.value = true

  try {
    await UserService.createUser(formData.value)
    showToast('success', 'Usuario creado correctamente')

    emit('refresh', true)
    closeModal()
  } catch (error) {
    showToast('error', 'Error', error.message || 'Ocurrió un error al guardar el usuario')
  } finally {
    isLoading.value = false
  }
}
</script>
