<template>
  <div class="overflow-auto scroll-auto border border-gray-400 rounded-lg shadow-lg">
    <table class="w-full divide-y divide-gray-400">
      <thead class="bg-gray-200 rounded-t-lg">
        <tr>
          <RowHeader title-column="ID" />
          <RowHeader title-column="Nombre" />
          <RowHeader title-column="Correo electrónico" />
          <RowHeader title-column="Fecha de registro" />
          <RowHeader title-column="Rol" />
          <RowHeader title-column="Acciones" />
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="data in props.data" :key="data.id" class="bg-white">
          <RowInfo class="text-center">
            {{ data.id }}
          </RowInfo>
          <RowInfo class="text-center">
            {{ data.name }}
          </RowInfo>
          <RowInfo class="text-center">
            {{ data.email }}
          </RowInfo>
          <RowInfo class="text-center">
            {{ new Date(data.created_at).toLocaleDateString() }}
          </RowInfo>
          <RowInfo class="text-center">
            {{ getRoleName(data.role.name) }}
          </RowInfo>
          <RowInfo class="flex justify-center gap-2">
            <CustomSwitch
              v-if="data.is_active !== undefined"
              v-model="data.is_active"
              :userId="data.id"
              :modelValue="!!data.is_active"
            />
            <EditUser @refresh="emit('refresh')" :user-id="data.id" />
            <EditPassword :user-id="data.id" @refresh="emit('refresh')" />
            <DeleteUser :title="data.name" :id-to-delete="data.id" @refresh="emit('refresh')" />
          </RowInfo>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import EditUser from '@/modals/add-edit/EditUser.vue'
import DeleteUser from '@/modals/delete/DeleteUser.vue'
import EditPassword from '@/modals/add-edit/EditPassword.vue'
import RowHeader from '@/components/table/RowHeader.vue'
import RowInfo from '@/components/table/RowInfo.vue'
import CustomSwitch from '../form/CustomSwitch.vue'

const props = defineProps({
  data: Array,
})

const emit = defineEmits(['refresh'])

const roleMap = {
  1: 'RH',
  2: 'Desarrollador',
  3: 'Planeación',
  4: 'Tester',
}

function getRoleName(roleId) {
  return roleMap[roleId]
}
</script>
