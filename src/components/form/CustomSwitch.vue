<template>
  <div
    :class="!!modelValue ? 'bg-green-700' : 'bg-gray-500'"
    @click="toggle"
    class="w-10 h-6 p-1 cursor-pointer rounded-full transition-all duration-500 flex items-center"
  >
    <div
      :class="{ 'translate-x-4': modelValue }"
      class="size-4 transition-all duration-500 transform bg-white rounded-full shadow-md"
    ></div>
  </div>
</template>

<script setup>
import UserService from '@/api/UserFacade'

const props = defineProps({
  modelValue: {
    type: [Boolean, Number],
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const toggle = async () => {
  const newStatus = !props.modelValue
  emit('update:modelValue', newStatus)

  try {
    await UserService.toggleUserStatus(props.userId)
  } catch (error) {
    console.error('Error al actualizar el estado del usuario:', error)
    emit('update:modelValue', props.modelValue)
  }
}
</script>

<style scoped></style>
