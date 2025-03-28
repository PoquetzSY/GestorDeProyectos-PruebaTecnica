<template>
  <Transition>
    <div v-show="modelValue" class="bg-black/50 fixed inset-0 z-20 flex justify-center items-center">
      <div class="bg-white p-10 rounded-xl w-lg">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold mb-4">{{ title }}</h2>
          <button @click="$emit('update:modelValue', false)" class="focus:outline-0 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: String,
})
defineEmits(['update:modelValue'])
</script>