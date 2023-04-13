import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'
Vue.use(Vuex)
const
  USER = 'user',
  USER_TOKEN = 'userToken',
  ACTIVE_INDEX = 'activeIndex',
  USER_REGISTER = 'userRegister'
// USER_LEVEL = 'userLevel',
// USER_POSITION = 'userPosition'
export default new Vuex.Store({
  state: {
    USER: getItem(USER),
    USER_TOKEN: getItem(USER_TOKEN),
    ACTIVE_INDEX: getItem(ACTIVE_INDEX),
    USER_REGISTER: getItem(USER_REGISTER)
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
    SET_USER_REGISTER (state, value) {
      state.USER_REGISTER = value
      setItem(USER_REGISTER, value)
    },
  },
  actions: {
    removeUserCache () {
      SET_USER(null)
      SET_USER_TOKEN(null)
      SET_USER_REGISTER(false)
    }
  },
  modules: {
  }
})
