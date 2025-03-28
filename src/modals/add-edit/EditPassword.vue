<template>
  <div>
    <button class="focus:outline-0 text-yellow-600 cursor-pointer" @click="openModal">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
      >
        <path
          d="M280-400q-33 0-56.5-23.5T200-480q0-33 23.5-56.5T280-560q33 0 56.5 23.5T360-480q0 33-23.5 56.5T280-400Zm0 160q-100 0-170-70T40-480q0-100 70-170t170-70q67 0 121.5 33t86.5 87h352l120 120-180 180-80-60-80 60-85-60h-47q-32 54-86.5 87T280-240Zm0-80q56 0 98.5-34t56.5-86h125l58 41 82-61 71 55 75-75-40-40H435q-14-52-56.5-86T280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Z"
        />
      </svg>
    </button>

    <Transition>
      <div v-show="isOpen" class="bg-black/50 fixed inset-0 z-20 flex justify-center items-center">
        <div class="bg-white p-10 rounded-xl w-lg">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold mb-4">Editar contraseña</h2>
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
              v-model="formData.password"
              :error-message="errors.password"
              id="password"
              label="Contraseña"
              type="password"
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
import CustomInput from '@/components/form/CustomInput.vue'
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
  password: '',
})

const errors = ref({
  password: '',
})

const openModal = async () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
  resetForm()
}

const resetForm = () => {
  formData.value = {
    password: '',
  }
  errors.value = {
    password: '',
  }
}

const fieldValidations = {
  password: {
    message: 'La contraseña es obligatoria',
    customValidation: (value) =>
      value.length >= 8 || 'La contraseña debe ser de al menos 8 caracteres',
  },
}

const { validateForm } = useFormValidation(formData, errors, fieldValidations)

const onSubmit = async () => {
  if (!validateForm()) return
  isLoading.value = true

  try {
    await UserService.updateUserPassword(props.userId, formData.value)
    showToast('success', 'Contraseña actualizada correctamente')

    emit('refresh', true)
    closeModal()
  } catch (error) {
    showToast('error', 'Error', error.message || 'Ocurrió un error al actualizar la contraseña')
  } finally {
    isLoading.value = false
  }
}
</script>
