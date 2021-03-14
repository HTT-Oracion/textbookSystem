import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'
Vue.use(Vuex)
const USER_TOKEN = 'user',
  ACTIVE_INDEX = 'activeIndex',
  USER_LEVEL = 'userLevel',
  USER_POSITION = 'userPosition'
export default new Vuex.Store({
  state: {
    USER_TOKEN: getItem(USER_TOKEN),
    ACTIVE_INDEX: getItem(ACTIVE_INDEX)
  },
  mutations: {
    SET_USER (state, value) {
      state.USER_TOKEN = value
      setItem(USER_TOKEN, value)
    },

    SET_USER_LEVEL (state, value) {
      state.USER_LEVEL = value
      setItem(USER_LEVEL, value)
    },
    SET_USER_POSITION (state, value) {
      state.USER_POSITION = value
      setItem(USER_POSITION, value)
    },
    SET_ACTIVEINDEX (state, value) {
      state.ACTIVE_INDEX = value
      setItem(ACTIVE_INDEX, value)
    }
  },
  actions: {
  },
  modules: {
  }
})
