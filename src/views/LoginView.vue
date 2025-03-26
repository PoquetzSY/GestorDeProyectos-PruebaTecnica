<template>
  <div>
    <div
      class="bg-white mx-4 px-5 sm:px-10 py-5 sm:mx-auto rounded-lg shadow-lg w-2xs sm:w-sm flex flex-col gap-6 items-center transition"
    >
      <h1 class="text-3xl text-center">Panel de gestión</h1>

      <CustomInput
        id="email"
        v-model="email"
        label="Correo electrónico"
        placeholder="Correo electrónico"
        type="email"
        :error-message="errors.email"
      />
      <CustomInput
        id="password"
        v-model="password"
        label="Contraseña"
        placeholder="Contraseña"
        type="password"
        :error-message="errors.password"
      />

      <button
        class="bg-blue-500 rounded-xl px-6 py-2 text-white cursor-pointer hover:bg-blue-600 transition-all"
        @click="$emit('submit')"
      >
        <span v-if="!isLoading">Entrar</span>
        <svg
          v-else
          class="animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
        >
          <path
            d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import CustomInput from '@/components/form/CustomInput.vue'
import { computed } from 'vue'

const props = defineProps({
  formData: Object,
  errors: Object,
  isLoading: Boolean,
})

const emit = defineEmits(['submit', 'update:formData'])

const email = computed({
  get: () => props.formData.email,
  set: (value) => emit('update:formData', { ...props.formData, email: value }),
})

const password = computed({
  get: () => props.formData.password,
  set: (value) => emit('update:formData', { ...props.formData, password: value }),
})
</script>
