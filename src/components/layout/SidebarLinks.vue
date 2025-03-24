<template>
  <router-link :to="{ name: props.route }" class="text-white hover:text-gray-300">{{
    props.text
  }}</router-link>
</template>

<script setup>
const props = defineProps({
  route: { type: String, required: true },
  text: { type: String, required: true },
})
</script>

<style scoped></style>
