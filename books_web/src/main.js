import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.config.productionTip = false

import '@/assets/css/reset.css'
import '@/assets/css/global.css'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
