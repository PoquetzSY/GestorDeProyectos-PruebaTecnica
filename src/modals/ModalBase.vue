<template>
  <Transition>
      <div v-show="modelValue" class="bg-black/50 fixed inset-0 z-20 flex justify-center items-center">
        <div class="bg-white p-7 rounded-xl w-lg flex flex-col gap-4">
          <slot />
        </div>
      </div>
    </Transition>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
})
defineEmits(['update:modelValue'])
</script>

<style scoped></style>
