<script setup lang="ts">
  import { computed } from "vue";
  import { useUsersStore } from "../store/usersStore";
  import { useAppStore } from "../store/appStore";
  import LoginDialog from "src/components/LoginDialog.vue";

  const usersStore = useUsersStore();
  const appStore = useAppStore();

  const anyLoggedUser = computed(() => (usersStore.getLoggedUser ? true : false));
</script>

<template>
  <q-page>
    <div class="row window-height flex-center justify-evenly">
      <q-btn
        v-if="!appStore.showLoginDialog"
        class="shadow-10"
        color="info"
        data-cy="btnLoginLogout"
        data-test="btnLoginLogout"
        :label="anyLoggedUser ? 'Show logout dialog' : 'Show login dialog'"
        no-caps
        @click="appStore.showLoginDialog = true"
      />
      <LoginDialog email="student001@jedlik.eu" password="student001" :show-dialog="appStore.showLoginDialog" />
    </div>
  </q-page>
</template>

<style scoped></style>
