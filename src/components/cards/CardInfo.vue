<template>
  <div class="bg-white rounded-lg shadow-lg p-4 flex flex-col min-h-[200px] gap-5">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-semibold text-neutral-900">{{ props.title }}</h2>
      <slot name="delete" />
    </div>
    <p class="text-sm text-neutral-700 flex-1 line-clamp-3">
      {{ props.description }}
    </p>
    <div class="flex justify-between items-center">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})
</script>

<style scoped></style>
