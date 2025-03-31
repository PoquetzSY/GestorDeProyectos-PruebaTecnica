<template>
  <MainLayout>
    <div class="flex flex-col gap-4">
      <h1 class="text-4xl font-bold mb-4">Usuarios</h1>

      <div class="w-full flex justify-end">
        <AddUser />
      </div>

      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <svg
          class="animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          viewBox="0 -960 960 960"
          width="32px"
          fill="currentColor"
        >
          <path
            d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z"
          />
        </svg>
      </div>

      <TableInfo v-else :data="users" @refresh="fetchUsers" />
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AddUser from '@/modals/add-edit/AddUser.vue'
import TableInfo from '@/components/table/TableInfo.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import UserService from '@/api/UserFacade'
import { showToast } from '@/utils/alerts'

const users = ref([])
const isLoading = ref(true)

const fetchUsers = async () => {
  try {
    const response = await UserService.listUsers()
    users.value = response.data.data
  } catch (error) {
    showToast('error', 'Error al cargar usuarios', error.message)
    console.error('Error al obtener usuarios:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchUsers)
</script>

<style scoped></style>
