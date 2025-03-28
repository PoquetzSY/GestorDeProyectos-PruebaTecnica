<template>
  <LoginView
    :form-data="formData"
    :errors="errors"
    :is-loading="isLoading"
    @submit="onSubmit"
    @update:formData="(value) => (formData = value)"
  />
</template>

<script setup>
import { ref } from 'vue'
import LoginView from '@/views/LoginView.vue'
import { useFormValidation } from '@/utils/formValidation'
import { showToast } from '@/utils/alerts'
import AuthService from '@/api/AuthFacade'
import { useAuthStore } from '@/stores/authStore'
import router from '@/router'

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

const onSubmit = async () => {
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
      const userRole = authStore.user?.role.id

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
