<template>
  <UsersView :users="users" :isLoading="isLoading" :columns="columns" :fetchUsers="fetchUsers" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import UsersView from '@/views/UserView.vue'
import UserService from '@/api/UserFacade'
import { showToast } from '@/utils/alerts'

const columns = [
  { name: 'name', value: 'Nombre' },
  { name: 'email', value: 'Correo electrónico' },
  { name: 'created_at', value: 'Fecha' },
  { name: 'role.name', value: 'Rol' },
]

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