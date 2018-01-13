import 'bootstrap/dist/css/bootstrap.css';
import Vue from 'vue';
import VueConfig from 'vue-config';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

Vue.use(VueConfig, {
  API: 'http://localhost/scm-api',
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
