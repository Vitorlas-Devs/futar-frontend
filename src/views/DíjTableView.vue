<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDíjStore } from '../store/díjStore'
import { useAppStore } from '../store/appStore'

const díjStore = useDíjStore()
const appStore = useAppStore()

const { t } = useI18n()

interface IColumns {
  name: string
  label: string
  field: string
  align: 'left' | 'right' | 'center' | undefined
  sortable: boolean
}

function columnsI18n(): IColumns[] {
  const columns: IColumns[] = [
    {
      name: 'minKm',
      label: t('minKm'),
      field: 'minKm',
      align: 'left',
      sortable: true,
    },
    {
      name: 'maxKm',
      label: t('maxKm'),
      field: 'maxKm',
      align: 'left',
      sortable: true,
    },
    {
      name: 'összeg',
      label: t('price'),
      field: 'összeg',
      align: 'left',
      sortable: true,
    },
  ]
  return columns
}

// const columns: QTableColumn[] = [
//   { name: "title", label: "Title", field: "title", align: "left", sortable: true },
//   { name: "content", label: "Content", field: "content", align: "left", sortable: true },
// ];

function editDíj(): void {
  díjStore.data = díjStore.selected[0]
  díjStore.getById()
  appStore.showEditDíjDialog = true
}

function newDíj(): void {
  díjStore.data = {}
  appStore.showNewDíjDialog = true
}

function submitEditDíjDialog() {
  díjStore.editById()
  appStore.showEditDíjDialog = false
}

function submitNewDíjDialog() {
  díjStore.create()
  appStore.showNewDíjDialog = false
}

function resetDíjDialog() {
  appStore.showEditDíjDialog = false
  appStore.showNewDíjDialog = false
}

function haho() {
  console.warn(díjStore.dataN)
  console.warn(díjStore.dataN.length)
  console.warn(díjStore.dataN[0])
}

onMounted(() => {
  díjStore.getAll()
})
</script>

<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        v-model:selected="díjStore.selected"
        binary-state-sort
        :columns="columnsI18n()"
        dense
        :pagination="{ rowsPerPage: 10 }"
        row-key="_id"
        :rows="díjStore.dataN"
        selection="multiple"
        :title="$t('price')"
        wrap-cells
      />
      <div class="row justify-center q-ma-sm q-gutter-sm">
        <q-btn v-show="díjStore.selected.length !== 0" color="orange" no-caps @click="díjStore.selected = []">
          {{ díjStore.selected.length > 1 ? $t("clearSelections") : $t("clearSelection") }}
        </q-btn>
        <q-btn color="green" no-caps @click="newDíj">
          {{ $t("newDocument") }}
        </q-btn>
        <q-btn v-show="díjStore.selected.length === 1" color="blue" no-caps @click="editDíj">
          {{ $t("editDocument") }}
        </q-btn>
        <q-btn v-show="díjStore.selected.length !== 0" color="red" no-caps @click="díjStore.deleteById()">
          {{ díjStore.selected.length > 1 ? $t("deleteSelectedDocuments") : $t("deleteSelectedDocument") }}
        </q-btn>
      </div>
    </div>
    <!-- Edit post dialog: -->
  </q-page>
</template>

<style scoped></style>
