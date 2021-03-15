import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import MyBread from '@/components/MyBread'
import SearchBar from '@/components/SearchBar'
Vue.use(ElementUI);
Vue.component(MyBread.name, MyBread)
Vue.component(SearchBar.name, SearchBar)
Vue.config.productionTip = false

import '@/assets/css/reset.css'
import '@/assets/css/global.css'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
