<template>
  <div class="min-h-screen flex inset-0 justify-center items-center">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
authStore.loadSession()
</script>

<style scoped></style>
