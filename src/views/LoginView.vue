<template>
  <div>
    <div
      class="bg-white mx-4 px-5 sm:px-10 py-5 sm:mx-auto rounded-lg shadow-lg w=2xs sm:w-sm flex flex-col gap-6 items-center transition"
    >
      <h1 class="text-3xl text-center">Panel de gestión</h1>
      <CustomInput
        id="email"
        v-model="formData.email"
        label="Correo electrónico"
        placeholder="Correo electrónico"
        type="email"
        :error-message="errors.email"
      />
      <CustomInput
        id="password"
        v-model="formData.password"
        label="Contraseña"
        placeholder="Contraseña"
        type="password"
        :error-message="errors.password"
      />
      <button
        class="bg-blue-500 rounded-xl px-6 py-2 text-white cursor-pointer hover:bg-blue-600 transition-all"
        v-on:click="onsubmit"
      >
        <span v-if="!isLoading">Entrar</span>
        <LoadingSpinner v-if="isLoading"/>
      </button>
    </div>
  </div>
</template>

<script setup>
import CustomInput from '@/components/form/CustomInput.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useFormValidation } from '@/utils/formValidation'
import { showToast } from '@/utils/alerts'
import AuthService from '@/api/AuthFacade'
import { useAuthStore } from '@/stores/authStore'
import router from '@/router'
import { ref } from 'vue'

const isLoading = ref(false)

const formData = ref({
  email: '',
  password: '',
})

const errors = ref({
  email: '',
  password: '',
})

const fieldValidations = {
  email: {
    message: 'El correo electrónico es obligatorio',
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    message: 'La contraseña es obligatoria',
    customValidation: (value) =>
      value.length >= 8 || 'La contraseña debe ser de al menos 8 caracteres',
  },
}

const { validateForm } = useFormValidation(formData, errors, fieldValidations)

const onsubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    await AuthService.login(formData.value)

    const lastRoute = sessionStorage.getItem('lastAttemptedRoute')

    if (lastRoute) {
      sessionStorage.removeItem('lastAttemptedRoute')
      router.push(lastRoute)
    } else {
      const authStore = useAuthStore()
      const userRole = authStore.user?.role_id

      if (userRole === 1) {
        router.push('/users')
      } else {
        router.push('/projects')
      }
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    showToast('error', 'Error al iniciar sesión', error.message)
  } finally {
    isLoading.value = false
  }
}
</script>
