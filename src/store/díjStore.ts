import { defineStore } from 'pinia'
import { Loading, Notify } from 'quasar'
import { useAxios } from '@vueuse/integrations/useAxios'
import { reactive, toRefs } from 'vue'
import instance from './axios.instance'

Notify.setDefaults({
  position: 'bottom',
  textColor: 'white',
  timeout: 3000,
  actions: [{ icon: 'close', color: 'white' }],
})

interface IDíj {
  _id?: number
  minKm?: number
  maxKm?: number
  összeg?: number
}

interface IState {
  dataN: Array<IDíj> // store documents (records) after get method(s)
  data: IDíj // temporary object for create, edit and delete methods
  dataOld: IDíj // temporary object for patch method (store data here before edit)
  selected: Array<IDíj>
  isLoading: boolean
}

export const useDíjStore = defineStore('díjStore', () => {
  const state = reactive<IState>({
    dataN: [],
    data: {},
    dataOld: {},
    selected: [],
    isLoading: false,
  })

  const getAll = async (): Promise<void> => {
    Loading.show()
    state.dataN = []
    const { response, error } = await useAxios('/dij', { method: 'GET' }, instance)
    if (response && response.value) {
      Loading.hide()
      state.dataN = response.value.data
    }
    else {
      Loading.hide()
      Notify.create({
        message: `Error: ${error.value}`,
        color: 'negative',
      })
    }
  }

  const getById = async (): Promise<void> => {
    Loading.show()
    state.data = {}
    const { response, error } = await useAxios(`/dij/${state.data._id}`, { method: 'GET' }, instance)
    if (response && response.value) {
      Loading.hide()
      state.data = response.value.data
      state.dataOld = JSON.parse(JSON.stringify(state.data))
    }
    else {
      Loading.hide()
      Notify.create({
        message: `Error: ${error.value}`,
        color: 'negative',
      })
    }
  }

  const create = async (): Promise<void> => {
    if (state.data) {
      Loading.show()
      const { response, error } = await useAxios('/dij', { method: 'POST', data: state.data }, instance)
      if (response && response.value) {
        Loading.hide()
        state.dataN.push(response.value.data)
        Notify.create({
          message: `New document with id: ${response.value.data._id} created`,
          color: 'positive',
        })
      }
      else {
        Loading.hide()
        Notify.create({
          message: `Error: ${error.value}`,
          color: 'negative',
        })
      }
    }
  }

  const editById = async (): Promise<void> => {
    if (state.data && state.data._id) {
      const diff: any = {}
      Object.keys(state.data).forEach((k, i) => {
        const newValue = Object.values(state.data)[i]
        const oldValue = Object.values(state.dataOld)[i]
        if (newValue !== oldValue)
          diff[k] = newValue
      })
      if (Object.keys(diff).length === 0) {
        Notify.create({
          message: 'No changes',
          color: 'warning',
        })
        process.exit(0)
      }
      Loading.show()
      const { response, error } = await useAxios(`/dij/${state.data._id}`, { method: 'PATCH', data: diff }, instance)
      if (response && response.value) {
        Loading.hide()
        state.dataN = state.dataN.map(d => (d._id === state.data._id ? response.value?.data : d))
        Notify.create({
          message: `Document with id: ${state.data._id} updated`,
          color: 'positive',
        })
      }
      else {
        Loading.hide()
        Notify.create({
          message: `Error: ${error.value}`,
          color: 'negative',
        })
      }
    }
  }

  const deleteById = async (): Promise<void> => {
    Loading.show()
    state.isLoading = true
    while (state.selected.length > 0) {
      const idToDelete = state.selected[0]._id
      const { response, error } = await useAxios(`/dij/${idToDelete}`, { method: 'DELETE' }, instance)
      if (response && response.value) {
        Loading.hide()
        state.dataN = state.dataN.filter(d => d._id !== idToDelete)
        state.selected = state.selected.filter(d => d._id !== idToDelete)
        Notify.create({
          message: `Document with id: ${idToDelete} deleted`,
          color: 'positive',
        })
      }
      else {
        Loading.hide()
        Notify.create({
          message: `Error: ${error.value}`,
          color: 'negative',
        })
      }
    }
    Loading.hide()
    state.isLoading = false
  }

  return {
    ...toRefs(state),
    getAll,
    getById,
    create,
    editById,
    deleteById,
  }
})
