import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import firebase from 'firebase/app'
import store from './store'
import './registerServiceWorker'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@/styles/index.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyA22n4MkrGXaZOlsT83TiBCdG84_sRfbTM',
      authDomain: 'optiarts-58885.firebaseapp.com',
      databaseURL: 'https://optiarts-58885.firebaseio.com',
      projectId: 'optiarts-58885',
      storageBucket: 'optiarts-58885.appspot.com',
      messagingSenderId: '980912405037',
      appId: '1:980912405037:web:975de856144c14194496a4'
    })
  },
  render: h => h(App),
  mounted () {
    firebase.auth().onAuthStateChanged((user) => {
      this.$store.dispatch('userChanged', user)
    })
  }
}).$mount('#app')
