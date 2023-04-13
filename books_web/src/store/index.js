import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'
Vue.use(Vuex)
const
  USER = 'user',
  USER_TOKEN = 'userToken',
  ACTIVE_INDEX = 'activeIndex',
  ADMIN_REGISTER = 'adminRegister'
// USER_LEVEL = 'userLevel',
// USER_POSITION = 'userPosition'
export default new Vuex.Store({
  state: {
    USER: getItem(USER),
    USER_TOKEN: getItem(USER_TOKEN),
    ACTIVE_INDEX: getItem(ACTIVE_INDEX),
    adminRegister: false
  },
  mutations: {
    SET_USER (state, value) {
      state.USER = value
      setItem(USER, value)
    },
    SET_USER_TOKEN (state, value) {
      state.USER_TOKEN = value
      setItem(USER_TOKEN, value)
    },
    SET_ACTIVEINDEX (state, value) {
      state.ACTIVE_INDEX = value
      setItem(ACTIVE_INDEX, value)
    },
    SET_ADMIN_REGISTER (state, bol) {
      state.adminRegister = bol
    },
  },
  actions: {
    COMMIT_ADMIN_REGISTER (context, bol) {
      context.commit('SET_ADMIN_REGISTER',bol)
    }
  },
  modules: {
  },
  getters: {
    adminRegister: state=> state.adminRegister
  }
})
