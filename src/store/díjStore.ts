import $axios from "./axios.instance";
import { defineStore } from "pinia";
import { Notify, Loading } from "quasar";

Notify.setDefaults({
  position: "bottom",
  textColor: "white",
  timeout: 3000,
  actions: [{ icon: "close", color: "white" }],
});

interface IDíj {
  _id?: number;
  minKm?: number;
  maxKm?: number;
  összeg?: number;
}

interface IState {
  dataN: Array<IDíj>; // store documents (records) after get method(s)
  data: IDíj; // temporary object for create, edit and delete methods
  dataOld: IDíj; // temporary object for patch method (store data here before edit)
  selected: Array<IDíj>;
  isLoading: boolean;
}

export const useDíjStore = defineStore({
  id: "díjStore",
  state: (): IState => ({
    dataN: [],
    data: {},
    dataOld: {},
    selected: [],
    isLoading: false,
  }),
  getters: {},
  actions: {
    async getAll(): Promise<void> {
      Loading.show();
      this.dataN = [];
      $axios
        .get("dij")
        .then((response) => {
          Loading.hide();
          if (response && response.data) {
            this.dataN = response.data;
          }
        })
        .catch((error) => {
          Loading.hide();
          Notify.create({
            message: `Error (${error.response.data.status}) while get all: ${error.response.data.message}`,
            color: "negative",
          });
        });
    },
    async getById(): Promise<void> {
      Loading.show();
      this.data = {};
      $axios
        .get(`dij/${this.data._id}`)
        .then((response) => {
          Loading.hide();
          if (response && response.data) {
            this.data = response.data;
            // make a copy of object into dataOld for edit (for reset and PATCH)
            Object.assign(this.dataOld, this.data);
          }
        })
        .catch((error) => {
          Loading.hide();
          Notify.create({
            message: `Error while get by id: ${error.message}`,
            color: "negative",
          });
        });
    },
    async create(): Promise<void> {
      if (this.data) {
        Loading.show();
        $axios
          .post("dij", this.data)
          .then((response) => {
            Loading.hide();
            if (response && response.data) {
              // update dataN for q-table too:
              this.dataN.push({ ...this.data });
              Notify.create({
                message: `New document with id=${response.data._id} has been saved successfully!`,
                color: "positive",
              });
            }
          })
          .catch((error) => {
            Loading.hide();
            Notify.create({
              message: `Error (${error.response.data.status}) while create: ${error.response.data.message}`,
              color: "negative",
            });
          });
      }
    },
    async editById(): Promise<void> {
      if (this.data && this.data._id) {
        const diff: any = {};
        Object.keys(this.data).forEach((k, i) => {
          const newValue = Object.values(this.data)[i];
          const oldValue = Object.values(this.dataOld)[i];
          if (newValue != oldValue) diff[k] = newValue;
        });
        if (Object.keys(diff).length == 0) {
          Notify.create({
            message: "Nothing changed!",
            color: "negative",
          });
          process.exit(0);
        }
        Loading.show();
        $axios
          .patch(`dij/${this.data._id}`, diff)
          .then((response) => {
            Loading.hide();
            if (response && response.data) {
              // update dataN for q-table too:
              const editedItemIndex = this.dataN.findIndex((x) => x._id === this.data._id);
              this.dataN[editedItemIndex] = { ...this.data };
              this.dataOld = { ...this.data };
              Notify.create({
                message: `Document with id=${this.data._id} has been updated successfully!`,
                color: "positive",
              });
            }
          })
          .catch((error) => {
            Loading.hide();
            Notify.create({
              message: `Error (${error.response.data.status}) while edit by id: ${error.response.data.message}`,
              color: "negative",
            });
          });
      }
    },
    async deleteById(): Promise<void> {
      Loading.show();
      this.isLoading = true;
      while (this.selected.length) {
        const id_for_delete = this.selected.pop()?._id;
        $axios
          .delete(`dij/${id_for_delete}`)
          .then(() => {
            this.dataN = this.dataN.filter((X) => X._id != id_for_delete);
            Notify.create({
              message: `Document with id=${id_for_delete} has been deleted successfully!`,
              color: "positive",
            });
          })
          .catch((error) => {
            Notify.create({
              message: `Error (${error.response.data.status}) while delete by id: ${error.response.data.message}`,
              color: "negative",
            });
          });
      }
      this.isLoading = false;
      Loading.hide();
    },
  },
});
