import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft, faChevronDown, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ValidationProvider } from 'vee-validate/dist/vee-validate.full'

// CSS
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/assets/style.css'

Vue.use(BootstrapVue)
library.add(faArrowLeft, faChevronDown, faShoppingCart)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('ValidationProvider', ValidationProvider)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
