import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Vue from 'vue';
import VueConfig from 'vue-config';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

Vue.use(VueConfig, {
  API: 'http://localhost/scm-api',
});
Vue.use(BootstrapVue);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
