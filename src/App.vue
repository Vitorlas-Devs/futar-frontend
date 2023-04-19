<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import router from 'src/router'
import { onMounted, ref } from 'vue'
import { useUsersStore } from './store/usersStore'
// import { Cookies } from "quasar";

const leftDrawer = ref<boolean>(true)
const usersStore = useUsersStore()

const { locale, t } = useI18n()

onMounted(() => {
  usersStore.autoLogin()
})

// Watch browser or browser page is close
window.addEventListener(
  'beforeunload',
  () => {
    if (usersStore.loggedUser)
      usersStore.closeApp()
  },
  false,
)

function menuItems() {
  return [
    {
      icon: 'mdi-home',
      text: t('startPage'),
      name: 'startPage',
      route: '/',
      disabled: false,
      separator: false,
    },
    {
      icon: 'mdi-account',
      text: t('account'),
      name: 'account',
      route: '/account',
      disabled: false,
      separator: false,
    },
    {
      icon: 'mdi-information',
      text: t('about'),
      name: 'about',
      route: '/about',
      disabled: false,
      separator: true,
    },
  ]
}

const links = ref([
  {
    icon: 'mdi-github',
    text: 'Frontend',
    name: '',
    link: 'https://github.com/14A-A-Lyedlik-Devs/futar-frontend',
    disabled: false,
    separator: false,
  },
  {
    icon: 'mdi-github',
    text: 'Backend',
    name: '',
    link: 'https://github.com/14A-A-Lyedlik-Devs/futar-backend',
    disabled: false,
    separator: false,
  },
])

function toggleLanguage() {
  locale.value = locale.value === 'hu' ? 'en' : 'hu'
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
              <img src="./assets/Jedlik_small.png">
            </q-avatar>
            Futár
          </q-toolbar-title>
          <q-btn v-if="usersStore.loggedUser" round>
            <q-avatar size="38px">
              <q-img referrerpolicy="no-referrer" :src="usersStore.loggedUser.picture as string" />
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
              <q-separator v-if="menuItem.separator" :key="`sep${index}`" />
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
              <q-item clickable :href="linkItem.link" target="_blank">
                <q-item-section avatar>
                  <q-icon :name="linkItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ linkItem.text }}
                </q-item-section>
              </q-item>
              <q-separator v-if="linkItem.separator" :key="`sep${index}`" />
            </template>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-footer elevated reveal>
        <q-toolbar>
          <q-toolbar-title class="text-center my-title">
            Futár Frontend 2023 -
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
