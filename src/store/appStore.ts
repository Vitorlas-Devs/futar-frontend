import { defineStore } from 'pinia'

interface IState {
  showLoginDialog: boolean
  showEditDíjDialog: boolean
  showNewDíjDialog: boolean
}

export const useAppStore = defineStore({
  id: 'appStore',
  state: (): IState => ({
    showLoginDialog: false,
    showEditDíjDialog: false,
    showNewDíjDialog: false,
  }),
  persist: {
    enabled: true,
  },
  // presist sample settings:
  // persist: {
  //   enabled: true,
  //   strategies: [
  //     { storage: sessionStorage, paths: ["showLoginDialog", "showEditPostDialog"] },
  //     { storage: localStorage, paths: ["otherField"] },
  //   ],
  // },
})
