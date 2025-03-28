import { ref, onMounted } from 'vue'
import { useFormValidation } from '@/utils/formValidation'
import { showToast } from '@/utils/alerts'
import UserService from '@/api/UserFacade'

export function useUserForm(emit) {
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

  const roleOptions = ref([])

  const getRoleOptions = async () => {
    try {
      const response = await UserService.getUserRoles()
      roleOptions.value = response.data.map((role) => ({
        id: role.id,
        name: role.name,
      }))
    } catch (error) {
      console.error('Error al obtener roles:', error)
      roleOptions.value = []
    }
  }

  onMounted(getRoleOptions)

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

  const resetForm = () => {
    Object.keys(formData.value).forEach((key) => (formData.value[key] = key === 'role' ? 0 : ''))
    Object.keys(errors.value).forEach((key) => (errors.value[key] = ''))
  }

  const onSubmit = async () => {
    if (!validateForm()) return
    isLoading.value = true

    try {
      await UserService.createUser(formData.value)
      showToast('success', 'Usuario creado correctamente')
      emit('refresh')
      return true
    } catch (error) {
      showToast('error', 'Error', error.message || 'Ocurrió un error al guardar el usuario')
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    formData,
    errors,
    roleOptions,
    isLoading,
    onSubmit,
    resetForm,
  }
}