import $axios from "./axios.instance";
import { defineStore } from "pinia";
import { Notify, Loading } from "quasar";

Notify.setDefaults({
  position: "bottom",
  textColor: "white",
  timeout: 3000,
  actions: [{ icon: "close", color: "white" }],
});

interface IAddress {
  _id: string;
  city: string;
  country: string;
  street: string;
}

interface IUser {
  _id?: string;
  email?: string;
  email_verified?: string;
  auto_login?: boolean;
  name?: string;
  password?: string;
  picture?: string;
  address?: null | IAddress;
  roles: string[];
}

interface IState {
  loggedUser: null | IUser;
  isLoading: boolean;
}

export const useUsersStore = defineStore({
  id: "usersStore",
  state: (): IState => ({
    loggedUser: null,
    isLoading: false,
  }),

  getters: {
    getLoggedUser(): null | IUser {
      return this.loggedUser;
    },
  },

  actions: {
    async loginRegisterWithGoogle(accessToken: string) {
      Loading.show();
      this.isLoading = true;
      $axios
        .post("auth/google", { atoken: accessToken })
        .then((res) => {
          this.loggedUser = res.data;
          Notify.create({
            message: `${res.data.name} with ${res.data.email} e-mail is logged in`,
            color: "positive",
          });
        })
        .catch(() => {
          this.loggedUser = null;
          Notify.create({ message: "Error on Authentication", color: "negative" });
        })
        .finally(() => {
          Loading.hide();
          this.isLoading = false;
        });
    },

    async loginUser(params: IUser): Promise<void> {
      Loading.show();
      this.isLoading = true;
      $axios
        .post("auth/login", {
          email: params.email,
          password: params.password,
        })
        .then((res) => {
          this.loggedUser = res.data;
          Notify.create({
            message: `${res.data.name} with ${res.data.email} e-mail is logged in`,
            color: "positive",
          });
        })
        .catch(() => {
          this.loggedUser = null;
          Notify.create({ message: "Error on Authentication", color: "negative" });
        })
        .finally(() => {
          Loading.hide();
          this.isLoading = false;
        });
    },

    async autoLogin(): Promise<void> {
      Loading.show();
      this.isLoading = true;
      $axios
        .post("auth/autologin")
        .then((res) => {
          if (res.status == 404) {
            this.loggedUser = null;
          } else {
            this.loggedUser = res.data;
            Notify.create({
              message: `Auto login success with ${this.loggedUser?.email}}`,
              color: "positive",
            });
          }
        })
        .catch((error) => {
          this.loggedUser = null;
          Notify.create({
            message: `Auto login not aviable! ${error.response.data.message}`,
            color: "negative",
          });
        })
        .finally(() => {
          Loading.hide();
          this.isLoading = false;
        });
    },

    async logOut(withNotify = true): Promise<void> {
      Loading.show();
      this.isLoading = true;
      $axios
        .post("auth/logout")
        .then(() => {
          this.loggedUser = null;
          if (withNotify) {
            Notify.create({
              message: "Successful logout",
              color: "positive",
            });
          }
        })
        .catch(() => {
          this.loggedUser = null;
          Notify.create({ message: "Error on log out", color: "negative" });
        })
        .finally(() => {
          this.isLoading = false;
          Loading.hide();
        });
    },

    async closeApp(): Promise<void> {
      $axios.post("auth/closeapp").then(() => {
        this.loggedUser = null;
      });
    },
  },

  persist: {
    enabled: true,
  },
  // presist sample settings:
  // persist: {
  //   enabled: true,
  //   strategies: [
  //     { storage: sessionStorage, paths: ["loggedUser", "otherField1"] },
  //     { storage: localStorage, paths: ["otherField2"] },
  //   ],
  // },
});
