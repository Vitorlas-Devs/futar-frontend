import $axios from "./axios.instance";
import { defineStore } from "pinia";
import { Notify, Loading } from "quasar";

Notify.setDefaults({
  position: "bottom",
  textColor: "white",
  timeout: 3000,
  actions: [{ icon: "close", color: "white" }],
  progress: true,
});

interface IPost {
  _id?: string;
  author?: string;
  content?: string;
  title?: string;
}

interface IPagination {
  page: number;
  rowsPerPage: number;
  rowsNumber: number;
  sortBy: string;
  descending: boolean;
}
interface IState {
  posts: Array<IPost>;
  data: IPost; // temporary object for create, edit and delete method
  dataOld: IPost; // temporary object for patch method (store data here before edit)
  isLoading: boolean;
  selected: Array<IPost>;
  pagination: IPagination;
  filter: string;
}

export const usePostsStore = defineStore({
  id: "postsStore",
  state: (): IState => ({
    posts: [],
    data: {},
    dataOld: {},
    isLoading: false,
    selected: [],
    filter: "",
    pagination: {
      sortBy: "title",
      descending: false,
      page: 0,
      rowsPerPage: 5,
      rowsNumber: 0,
    },
  }),

  getters: {
    // example getter, not in use
    getPosts(): Array<IPost> {
      return this.posts;
    },
  },

  actions: {
    async getPostById(): Promise<void> {
      if (this.data && this.data._id) {
        Loading.show();
        this.isLoading = false;
        $axios
          .get(`posts/${this.data._id}`)
          .then((res) => {
            Loading.hide();
            if (res && res.data) {
              this.data = res.data;
              Object.assign(this.dataOld, this.data); // for compare after submit
            }
          })
          .catch((error) => {
            Notify.create({
              message: `Error while get post by id: ${error.response.data.message}`,
              color: "negative",
            });
          })
          .finally(() => {
            Loading.hide();
            this.isLoading = false;
          });
      }
    },

    async createNewPost(): Promise<void> {
      Loading.show();
      this.isLoading = true;
      $axios
        .post("posts", {
          title: this.data.title,
          content: this.data.content,
        })
        .then((res) => {
          if (res && res.data.post._id) {
            Notify.create({
              message: `Post with id=${res.data.post._id} has been created successfully!`,
              color: "positive",
            });
          }
        })
        .catch((error) => {
          Notify.create({
            message: `Error in create post: ${error.response.data.message}`,
            color: "negative",
          });
        })
        .finally(() => {
          this.fetchPaginatedPosts();
        });
    },

    async editPostById(): Promise<void> {
      if (this.data && this.data._id) {
        const diff: any = {}; // only the changed fields are included
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
        } else {
          Loading.show();
          this.isLoading = true;
          $axios
            .patch(`posts/${this.data._id}`, diff)
            .then((res) => {
              if (res && res.data) {
                this.selected[0] = res.data;
                Notify.create({
                  message: `Post with id=${res.data._id} has been edited successfully!`,
                  color: "positive",
                });
              }
            })
            .catch((error) => {
              Notify.create({
                message: `Error (${error.response.data.status}) while edit by id: ${error.response.data.message}`,
                color: "negative",
              });
            })
            .finally(() => {
              this.fetchPaginatedPosts();
            });
        }
      }
    },

    async deleteById(): Promise<void> {
      if (this.selected.length > 0) {
        Loading.show();
        this.isLoading = true;
      }
      while (this.selected.length) {
        const id_for_delete = this.selected.pop()?._id;
        await $axios
          .delete(`posts/${id_for_delete}`)
          .then(() => {
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
          })
          .finally(() => {
            if (this.selected.length == 0) this.fetchPaginatedPosts();
          });
      }
    },

    async fetchPaginatedPosts(): Promise<void> {
      Loading.show();
      this.isLoading = true;
      $axios
        .get(
          `posts/${(this.pagination.page - 1) * this.pagination.rowsPerPage!}/${this.pagination.rowsPerPage!}/${
            this.pagination.sortBy
          }/${this.pagination!.descending ? -1 : 1}/${this.filter}`
        )
        .then((res) => {
          if (res && res.data) {
            this.posts = res.data.posts;
            this.pagination!.rowsNumber = res.data.count;
          }
        })
        .catch((error) => {
          const status = error.response.data.status;
          Notify.create({
            message: `${error.response.data.message} (${status})`,
            color: "negative",
          });
        })
        .finally(() => {
          Loading.hide();
          this.isLoading = false;
        });
    },
  },
});
