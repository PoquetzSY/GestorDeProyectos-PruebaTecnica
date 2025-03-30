<template>
  <div class="relative">
    <header class="bg-gray-800 text-white w-full flex items-center justify-end px-4 py-2 sm:hidden">
      <svg
        v-on:click="toggleSidebar"
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
      >
        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
      </svg>
    </header>

    <div
      v-show="isOpen"
      class="w-full bg-black/50 h-full fixed top-0 left-0 z-10 transition sm:hidden"
      @click="toggleSidebar"
    ></div>

    <Transition name="slide-fade">
      <aside
        v-show="isOpen"
        class="fixed top-0 right-0 w-48 h-screen bg-gray-800 text-white z-20 rounded-l-xl flex flex-col gap-4 p-4 sm:hidden"
      >
        <div class="flex w-full justify-between items-center">
          <h1 class="text-2xl">Menú</h1>
          <svg
            @click="toggleSidebar"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
          >
            <path
              d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
            />
          </svg>
        </div>

        <nav class="flex flex-col gap-2">
          <SidebarLinks v-if="userRole === 1" route="projects" text="Proyectos" />
          <SidebarLinks v-if="userRole != 1" route="projects" text="Proyectos" />
          <SidebarLinks route="profile" :params="{userId: userId}" text="Perfil" />
          <SidebarLinks route="login" text="Cerrar sesion" @click="logout" />
        </nav>
      </aside>
    </Transition>

    <aside
      class="hidden sm:flex rounded-r-xl min-h-screen h-full bg-gray-800 text-white z-20 flex-col gap-10 p-4"
    >
      <h1 class="text-2xl">Panel de gestión</h1>
      <nav class="flex flex-col gap-6">
        <SidebarLinks v-if="userRole === 1" route="projects" text="Proyectos" />
        <SidebarLinks v-if="userRole != 1" route="projects" text="Proyectos" />
        <SidebarLinks route="profile" :params="{userId: userId}" text="Perfil" />
        <SidebarLinks route="login" text="Cerrar sesion" @click="logout" />
      </nav>
    </aside>
  </div>
</template>

<script setup>
import router from '@/router'
import SidebarLinks from './SidebarLinks.vue'
import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue'

const authStore = useAuthStore()

const userRole = authStore.user?.role_id
const userId = authStore.user?.id

const isOpen = ref(false)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const logout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped></style>
