<template>
  <div class="flex flex-col sm:flex-row min-h-screen w-full">
    <MainSidebar />

    <div class="grow px-6 py-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import MainSidebar from '@/components/layout/MainSidebar.vue'
</script>

<style scoped></style>
