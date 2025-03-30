<template>
  <div class="overflow-auto scroll-auto border border-gray-400 rounded-lg shadow-lg">
    <table class="w-full divide-y divide-gray-400">
      <thead class="bg-gray-200 rounded-t-lg">
        <tr>
          <RowHeader
            v-for="column in props.columns"
            :key="column.name"
            :titleColumn="column.value"
          />
          <th class="text-gray-700 uppercase text-sm p-2">Acciones</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="data in props.data" :key="data.id" class="bg-white">
          <RowInfo
            v-for="column in props.columns"
            :key="column"
            :info="column.name === 'role_id' ? getRoleName(data[column.name]) : data[column.name]"
          />
          <td class="py-3 px-4 flex justify-center gap-2">
            <CustomSwitch
              v-if="data.is_active !== undefined"
              v-model="data.is_active"
              :userId="data.id"
              :modelValue="!!data.is_active"
            />
            <EditUser @refresh="emit('refresh')" :user-id="data.id" />
            <EditPassword :user-id="data.id" @refresh="emit('refresh')" />
            <DeleteUser :title="data.name" :id-to-delete="data.id" @refresh="emit('refresh')" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import EditUser from '@/components/modals/add-edit/EditUser.vue'
import DeleteUser from '@/components/modals/delete/DeleteUser.vue'
import RowHeader from '@/components/table/RowHeader.vue'
import RowInfo from '@/components/table/RowInfo.vue'
import CustomSwitch from '../form/CustomSwitch.vue'
import EditPassword from '../modals/add-edit/EditPassword.vue'

const props = defineProps({
  columns: Array,
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
