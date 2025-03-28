<template>
  <div>
    <MainButton variant="outline" @buttonClick="isOpen = true">
      Nuevo usuario
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
      </svg>
    </MainButton>

    <BaseModal v-model="isOpen" title="Nuevo usuario" @close="resetForm">
      <form class="flex flex-col gap-4 items-end" @submit.prevent="submitForm">
        <CustomInput v-model="formData.name" :error-message="errors.name" id="name" label="Nombre" />
        <FormGroup>
          <CustomInput v-model="formData.last_name_p" :error-message="errors.last_name_p" id="firstLastName" label="Apellido Paterno" />
          <CustomInput v-model="formData.last_name_m" :error-message="errors.last_name_m" id="secondLastName" label="Apellido Materno" />
        </FormGroup>
        <CustomInput v-model="formData.email" :error-message="errors.email" id="email" label="Correo electrónico" />
        <FormGroup>
          <CustomInput v-model="formData.password" :error-message="errors.password" id="password" label="Contraseña" type="password" />
          <CustomSelect v-model="formData.role" :error-message="errors.role" id="role" label="Rol" :options="roleOptions" />
        </FormGroup>
        <MainButton type="submit">
          <span v-if="!isLoading">Guardar</span>
          <LoadingSpinner v-else />
        </MainButton>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MainButton from '@/components/common/MainButton.vue'
import CustomInput from '@/components/form/CustomInput.vue'
import CustomSelect from '@/components/form/CustomSelect.vue'
import BaseModal from '@/modals/ModalBase.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useUserForm } from '@/utils/forms/useUserForm'
import FormGroup from '@/components/form/FormGroup.vue'

const isOpen = ref(false)
const emit = defineEmits(['refresh'])

const { formData, errors, roleOptions, isLoading, onSubmit, resetForm } = useUserForm(emit)

const submitForm = async () => {
  if (await onSubmit()) isOpen.value = false
}
</script>