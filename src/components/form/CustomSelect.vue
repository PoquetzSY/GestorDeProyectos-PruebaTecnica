<template>
  <div class="flex flex-col w-full">
    <label v-if="label" class="text-black text-base pb-2">{{ props.label }}</label>
    <div class="tw-relative">
      <select class="select-style" :multiple="multiple" v-model="selectedValue">
        <option disabled value="">{{ props.placeholder }}</option>
        <option v-for="option in props.options" :key="option.id" :value="option.id">
          {{ option.name }}
        </option>
      </select>
    </div>
    <p v-if="props.errorMessage" class="text-xs sm:text-sm text-red-500">
      {{ props.errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Number, String, Array],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Selecciona una opción',
  },
  options: {
    type: Array,
    default: () => [],
  },
  errorMessage: {
    type: String,
    default: '',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const selectedValue = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue),
})
</script>

<style scoped>
.select-style {
  border: 1px solid #d9d9d9;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border-radius: 1rem;
  width: 100%;
}
</style>
