<script setup lang="ts">
  import { QTableProps } from "quasar";
  import { usePostsStore } from "../store/postsStore";
  import { useAppStore } from "../store/appStore";
  import { onMounted } from "vue";
  import { useI18n } from "vue-i18n";

  const postsStore = usePostsStore();
  const appStore = useAppStore();

  let { t } = useI18n();

  interface IColumns {
    name: string;
    label: string;
    field: string;
    align: "left" | "right" | "center" | undefined;
    sortable: boolean;
  }

  function columnsI18n(): IColumns[] {
    let columns: IColumns[] = [
      {
        name: "title",
        label: t("title"),
        field: "title",
        align: "left",
        sortable: true,
      },
      {
        name: "content",
        label: t("content"),
        field: "content",
        align: "left",
        sortable: true,
      },
    ];
    return columns;
  }

  // const columns: QTableColumn[] = [
  //   { name: "title", label: "Title", field: "title", align: "left", sortable: true },
  //   { name: "content", label: "Content", field: "content", align: "left", sortable: true },
  // ];

  function onRequest(props: QTableProps) {
    if (props.pagination) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      postsStore.pagination.page = page as number;
      postsStore.pagination.rowsPerPage = rowsPerPage as number;
      postsStore.pagination.sortBy = sortBy as string;
      postsStore.pagination!.descending = descending as boolean;

      postsStore.fetchPaginatedPosts(); // get posts
    }
  }

  onMounted(() => {
    // load posts on start
    onRequest({
      filter: postsStore.filter,
      pagination: postsStore.pagination,
    });
  });

  function editPost(): void {
    postsStore.data = postsStore.selected[0];
    postsStore.getPostById();
    appStore.showEditPostDialog = true;
  }

  function newPost(): void {
    postsStore.data = {};
    appStore.showNewPostDialog = true;
  }

  function submitEditPostDialog() {
    postsStore.editPostById();
    appStore.showEditPostDialog = false;
  }

  function submitNewPostDialog() {
    postsStore.createNewPost();
    appStore.showNewPostDialog = false;
  }

  function resetPostDialog() {
    appStore.showEditPostDialog = false;
    appStore.showNewPostDialog = false;
  }
</script>

<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        v-model:pagination="postsStore.pagination"
        v-model:selected="postsStore.selected"
        binary-state-sort
        :columns="columnsI18n()"
        dense
        :filter="postsStore.filter"
        :loading="postsStore.isLoading"
        :pagination-label="
          (firstRowIndex, endRowIndex, totalRowsNumber) => `${firstRowIndex}-${endRowIndex}/${totalRowsNumber}`
        "
        row-key="_id"
        :rows="postsStore.posts"
        :rows-per-page-label="$t('rowsPerPageLabel')"
        selection="multiple"
        :title="$t('posts')"
        wrap-cells
        @request="onRequest"
      >
        <!-- Search field -->
        <template #top-right>
          <q-input v-model="postsStore.filter" debounce="500" dense :placeholder="$t('search')">
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
      <!-- Action buttons: -->
      <div class="row justify-center q-ma-sm q-gutter-sm">
        <q-btn v-show="postsStore.selected.length != 0" color="orange" no-caps @click="postsStore.selected = []">
          {{ postsStore.selected.length > 1 ? $t("clearSelections") : $t("clearSelection") }}
        </q-btn>
        <q-btn v-show="postsStore.selected.length == 0" color="green" no-caps @click="newPost()">
          {{ $t("newPost") }}
        </q-btn>
        <q-btn v-show="postsStore.selected.length == 1" color="blue" no-caps @click="editPost()">
          {{ $t("editPost") }}
        </q-btn>
        <q-btn v-show="postsStore.selected.length != 0" color="red" no-caps @click="postsStore.deleteById()">
          {{ postsStore.selected.length > 1 ? $t("deletePosts") : $t("deletePost") }}
        </q-btn>
      </div>
    </div>
    <!-- Edit post dialog: -->
    <q-dialog v-model="appStore.showEditPostDialog" persistent>
      <q-card class="q-pa-md" style="width: 60vw; min-width: 300px">
        <q-form class="q-mx-md" @reset="resetPostDialog()" @submit="submitEditPostDialog()">
          <div class="row">
            <div v-if="postsStore.data" class="col-12 q-gutter-md">
              <h4 class="text-center q-mt-lg q-mb-none">{{ $t("editPost") }}</h4>
              <q-input v-model="postsStore.data.title" filled :label="$t('title')" type="text" />
              <q-input v-model="postsStore.data.content" filled :label="$t('content')" type="textarea" />
              <div class="row justify-center">
                <q-btn class="q-mr-md" color="green" :label="$t('save')" no-caps type="submit" />
                <q-btn class="q-mr-md" color="red" :label="$t('cancel')" no-caps type="reset" />
              </div>
            </div>
          </div>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- New post dialog: -->
    <q-dialog v-model="appStore.showNewPostDialog" persistent>
      <q-card class="q-pa-md" style="width: 60vw; min-width: 300px">
        <q-form class="q-mx-md" @reset="resetPostDialog()" @submit="submitNewPostDialog()">
          <div class="row">
            <div v-if="postsStore.data" class="col-12 q-gutter-md">
              <h4 class="text-center q-mt-lg q-mb-none">{{ t("newPost") }}</h4>
              <q-input v-model="postsStore.data.title" filled :label="$t('title')" type="text" />
              <q-input v-model="postsStore.data.content" filled :label="$t('content')" type="textarea" />
              <div class="row justify-center">
                <q-btn class="q-mr-md" color="green" :label="$t('save')" no-caps type="submit" />
                <q-btn class="q-mr-md" color="red" :label="$t('cancel')" no-caps type="reset" />
              </div>
            </div>
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped></style>
