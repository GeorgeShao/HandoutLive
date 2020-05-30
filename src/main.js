import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import io from 'socket.io-client';
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$socket = io(process.env.VUE_APP_SERVER_URL);

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
