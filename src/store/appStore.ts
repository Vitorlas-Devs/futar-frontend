import { defineStore } from "pinia";

interface IState {
  showLoginDialog: boolean;
  showEditPostDialog: boolean;
  showNewPostDialog: boolean;
}

export const useAppStore = defineStore({
  id: "appStore",
  state: (): IState => ({
    showLoginDialog: false,
    showEditPostDialog: false,
    showNewPostDialog: false,
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
});
