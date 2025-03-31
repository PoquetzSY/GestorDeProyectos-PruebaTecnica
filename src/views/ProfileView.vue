<template>
  <MainLayout>
    <div class="flex flex-col gap-4">
      <h1 class="text-4xl font-bold mb-4">Perfil</h1>
      <div class="flex justify-center items-center h-[calc(100vh-110px)]">
        <div class="border border-gray-500 p-6 rounded-xl w-md">
          <p class="text-2xl font-semibold text-center">Actualiza tu información</p>
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

            <MainButton type="submit">
              <span v-if="!isLoading">Guardar</span>
              <LoadingSpinner v-if="isLoading" />
            </MainButton>
          </form>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import CustomInput from '@/components/form/CustomInput.vue'
import MainButton from '@/components/common/MainButton.vue'
import { useFormValidation } from '@/utils/formValidation'
import UserService from '@/api/UserFacade'
import { useAuthStore } from '@/stores/authStore'
import { showToast } from '@/utils/alerts'
import { onMounted, ref } from 'vue'

const authStore = useAuthStore()
const userId = authStore.user?.id

const isLoading = ref(false)

const formData = ref({
  name: '',
  last_name_p: '',
  last_name_m: '',
})

const errors = ref({
  name: '',
  last_name_p: '',
  last_name_m: '',
})

const fieldValidations = {
  name: { message: 'El nombre es obligatorio' },
  last_name_p: { message: 'El apellido paterno es obligatorio' },
  last_name_m: { message: 'El apellido materno es obligatorio' },
}

const { validateForm } = useFormValidation(formData, errors, fieldValidations)

const getProfile = async () => {
  try {
    const response = await UserService.getProfile(userId)
    formData.value = {
      name: response.data.name,
      last_name_p: response.data.last_name_p,
      last_name_m: response.data.last_name_m,
    }
  } catch (error) {
    showToast('error', 'Error', error.message || 'Ocurrió un error al obtener el perfil')
  }
}

const onSubmit = async () => {
  if (!validateForm()) return
  isLoading.value = true

  try {
    await UserService.updateUser(userId, formData.value)
    showToast(
      'success',
      'Información actualizada',
      'Tu información ha sido actualizada correctamente',
    )
    authStore.setUserData({ ...authStore.user, ...formData.value })
    await getProfile()
  } catch (error) {
    showToast('error', 'Error', error.message || 'Ocurrió un error al guardar el usuario')
  } finally {
    isLoading.value = false
  }
}

onMounted(getProfile)
</script>

<style scoped></style>
