<script setup lang="ts">
  import { useI18n } from "vue-i18n";
  import router from "src/router";
  import { useUsersStore } from "./store/usersStore";
  import { onMounted, ref } from "vue";
  // import { Cookies } from "quasar";

  const leftDrawer = ref<boolean>(true);
  const usersStore = useUsersStore();

  let { locale, t } = useI18n();

  onMounted(() => {
    usersStore.autoLogin();
  });

  // Watch browser or browser page is close
  window.addEventListener(
    "beforeunload",
    () => {
      if (usersStore.loggedUser) {
        usersStore.closeApp();
      }
    },
    false
  );

  function menuItems() {
    return [
      {
        icon: "mdi-home",
        text: t("startPage"),
        name: "startPage",
        route: "/",
        disabled: false,
        separator: false,
      },
      {
        icon: "mdi-soccer",
        text: t("examples"),
        name: "examples",
        route: "/examples",
        disabled: false,
        separator: false,
      },
      {
        icon: "mdi-grid",
        text: t("gridDemo"),
        name: "gridDemo",
        route: "/grid",
        disabled: false,
        separator: false,
      },
      {
        icon: "mdi-account",
        text: t("account"),
        name: "account",
        route: "/account",
        disabled: false,
        separator: false,
      },
      {
        icon: "mdi-information",
        text: t("about"),
        name: "about",
        route: "/about",
        disabled: false,
        separator: false,
      },
      {
        icon: "mdi-lifebuoy",
        text: "q-help",
        name: "qhelp",
        route: "/qhelp",
        disabled: false,
        separator: true,
      },
    ];
  }

  const links = ref([
    {
      icon: "mdi-github",
      text: "GitHub repo",
      name: "",
      link: "https://github.com/nitslaszlo/jedlik-vite-quasar-template-minimal-dialogs",
      disabled: false,
      separator: false,
    },
    {
      icon: "mdi-language-typescript",
      text: "TypeScript",
      name: "",
      link: "https://www.typescriptlang.org/",
      disabled: false,
      separator: false,
    },
    {
      icon: "mdi-vuejs",
      text: "Vue.js",
      name: "",
      link: "https://vuejs.org/",
      disabled: false,
      separator: false,
    },
    {
      icon: "mdi-tire",
      text: "Quasar",
      name: "",
      link: "https://quasar.dev/",
      disabled: false,
      separator: false,
    },
    {
      icon: "mdi-fruit-pineapple",
      text: "Pinia",
      name: "",
      link: "https://pinia.vuejs.org/introduction.html",
      disabled: false,
      separator: false,
    },
  ]);

  function toggleLanguage() {
    locale.value = locale.value == "hu" ? "en" : "hu";
  }
</script>

<template>
  <div class="q-pa-md">
    <q-layout view="hHh Lpr fFf">
      <q-header class="bg-primary text-white text-left" elevated reveal>
        <q-toolbar>
          <q-btn dense flat icon="mdi-menu" round @click="leftDrawer = !leftDrawer" />
          <q-toolbar-title class="my-title" style="cursor: pointer" @click="router.push({ path: '/' })">
            <q-avatar>
              <img src="./assets/Jedlik_small.png" />
            </q-avatar>
            Jedlik
          </q-toolbar-title>
          <q-btn v-if="usersStore.loggedUser" round>
            <q-avatar size="38px">
              <q-img referrerpolicy="no-referrer" :src="(usersStore.loggedUser.picture as string)" />
            </q-avatar>
          </q-btn>
          <q-btn flat icon="mdi-comment-text-multiple" @click="toggleLanguage">
            <q-badge color="red" floating :label="locale" />
          </q-btn>
          <q-btn flat icon="mdi-theme-light-dark" @click="$q.dark.toggle" />
          <q-btn dense flat icon="mdi-menu" round @click="leftDrawer = !leftDrawer" />
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="leftDrawer"
        bordered
        :breakpoint="500"
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
        show-if-above
        :width="200"
      >
        <q-scroll-area class="fit">
          <!-- routes: -->
          <q-list>
            <template v-for="(menuItem, index) in menuItems()" :key="index">
              <q-item clickable :disable="menuItem.disabled" :to="menuItem.route">
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.text }}
                </q-item-section>
              </q-item>
              <q-separator v-if="menuItem.separator" :key="'sep' + index" />
            </template>
            <q-item clickable :disable="usersStore.loggedUser == null" to="/qtable">
              <q-item-section avatar>
                <q-icon name="mdi-table" />
              </q-item-section>
              <q-item-section>q-table</q-item-section>
            </q-item>
            <q-separator />
          </q-list>
          <!-- links: -->
          <q-list>
            <template v-for="(linkItem, index) in links" :key="index">
              <q-item clickable :href="linkItem.link">
                <q-item-section avatar>
                  <q-icon :name="linkItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ linkItem.text }}
                </q-item-section>
              </q-item>
              <q-separator v-if="linkItem.separator" :key="'sep' + index" />
            </template>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-footer elevated reveal>
        <q-toolbar>
          <q-toolbar-title class="text-center my-title">
            Vite-Quasar minimal {{ $t("template") }} 2022 -
            {{ usersStore.loggedUser ? usersStore.loggedUser?.name : $t("arentLoggedIn") }}
          </q-toolbar-title>
        </q-toolbar>
      </q-footer>

      <q-page-container id="container">
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </router-view>
      </q-page-container>
    </q-layout>
  </div>
</template>

<style lang="scss">
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .my-title {
    font-size: 10px;
    @media (min-width: 400px) {
      font-size: calc(10px + 0.5vw);
    }
    @media (min-width: 800px) {
      font-size: calc(14px + 0.5vw);
    }
    @media (min-width: 1200px) {
      font-size: calc(18px + 0.5vw);
    }
  }
</style>
