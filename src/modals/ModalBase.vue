<template>
  <Transition>
    <div
      v-show="modelValue"
      class="bg-black/50 fixed inset-0 z-20 flex justify-center items-center"
    >
      <div
        :class="[
          type === 'delete' ? 'p-10 w-md gap-6' : 'p-7 w-lg gap-4',
          'bg-white flex flex-col rounded-xl',
        ]"
      >
        <slot />
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  type: {
    type: String,
    default: 'base',
    validator: (value) => ['base', 'delete'].includes(value),
  },
})
defineEmits(['update:modelValue'])
</script>

<style scoped></style>
