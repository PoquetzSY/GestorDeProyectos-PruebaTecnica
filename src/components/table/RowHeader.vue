<template>
  <th class="text-gray-700 uppercase text-sm p-2">
    {{ props.titleColumn }}
  </th>
</template>

<script setup>
const props = defineProps({
  titleColumn: String,
})
</script>

<style scoped></style>
