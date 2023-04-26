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
      name: 'title',
      label: t('title'),
      field: 'title',
      align: 'left',
      sortable: true,
    },
    {
      name: 'content',
      label: t('content'),
      field: 'content',
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

onMounted(() => {
  // load posts on start
  díjStore.getAll()
  // print díjStore to debud console
  console.warn('haho')
})

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
  console.warn(díjStore.getAll().then(res => console.warn(res)))
}
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
      <q-btn color="green" no-caps @click="haho">
        {{ $t("price") }}
      </q-btn>
    </div>
    <!-- Edit post dialog: -->
  </q-page>
</template>

<style scoped></style>
