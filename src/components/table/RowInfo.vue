<template>
  <td class="py-3 px-4 text-center">
    {{ props.info }}
  </td>
</template>

<script setup>
const props = defineProps({
  info: [String, Number],
})
</script>

<style scoped></style>
