<template>
  <button
    class="px-4 py-2 flex items-center gap-2 font-semibold rounded-xl text-center transition-all focus:outline-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    :class="buttonClass"
    :disabled="isLoading"
    @click="emitClick"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'outline'].includes(value),
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['buttonClick'])

const buttonClass = computed(() => ({
  'bg-blue-500 text-white hover:bg-blue-600': props.variant === 'primary',
  'border border-gray-500 text-black hover:bg-gray-500 hover:text-white':
    props.variant === 'outline',
}))

const emitClick = () => {
  if (!props.isLoading) emit('buttonClick')
}
</script>

<style scoped>
.outline-button {
  border: 1px solid #9ca3af;
}
</style>
