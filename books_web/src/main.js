import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import MyBread from '@/components/MyBread'
import SearchBar from '@/components/SearchBar'
import { mapState } from 'vuex'
Vue.use(ElementUI);
Vue.component(MyBread.name, MyBread)
Vue.component(SearchBar.name, SearchBar)
Vue.mixin({
  computed: {
    ...mapState({
      user: state => state.USER
    }, {
      token: state => state.USER_TOKEN
    })
  }
})
Vue.filter('format', function (dateTime) {
  const date = new Date(Number(dateTime))
  const y = date.getFullYear()
  const m = (date.getMonth() + 1 + '').padStart(2, '0')
  const d = (date.getDate() + '').padStart(2, '0')
  // const h = (date.getHours() + '').padStart(2, '0')
  // const mm = (date.getMinutes() + '').padStart(2, '0')
  // const ss = (date.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d}`
})
Vue.config.productionTip = false

import '@/assets/css/reset.css'
import '@/assets/css/global.css'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
