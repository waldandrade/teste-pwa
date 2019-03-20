import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    specifications: [],
    libs: [],
    user: {},
    pessoa: null,
    fotoPerfil: null,
    loading: false,
    error: null,
    headers: null
  },
  mutations: {
    addLib (state, lib) {
      state.lib.push(lib)
    },
    addSpecification (state, specification) {
      state.specifications.push(specification)
    },
    setAuthHeader (state, payload) {
      state.headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${payload}`
      })
    },
    setUser (state, payload) {
      state.user = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setUserImage (state, payload) {
      state.user.image = payload
    },
    clearError (state) {
      state.error = null
    }
  },
  actions: {
    addLib ({ commit }, lib) {
      commit('addLib', lib)
    },
    addSpecification ({ commit, state }, specification) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        let storageRef = firebase.storage().ref()
        let fileRef = storageRef.child(`users/${state.user.id}/geral/${specification.nome}.lotos`)
        fileRef.putString(specification.code).then(snapshot => {
          snapshot.ref.getDownloadURL().then(downloadURL => {
            specification.url = downloadURL
            commit('addSpecification', specification)
            resolve()
          })
        })
      })
    },
    clearError ({ commit }) {
      commit('clearError')
    },
    signUserUp ({ commit }, payload) {
      commit('setLoading', true)
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          (userCred) => {
            const user = userCred.user
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              email: user.email,
              events: []
            }
            user.getIdToken().then(
              token => {
                commit('setUser', newUser)
                commit('setAuthHeader', token)
              }
            )
            // incluir os demais atributos que o usuário pode ter
            // Como postos que administra, perfil de cliente e perfil de frentista
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    signUserIn ({ commit }, payload) {
      commit('setLoading', true)
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    userChanged ({ commit }, payload) {
      const user = payload
      commit('setLoading', false)
      if (user) {
        // let storage = firebase.storage()
        // storage.ref(`users/avatars/${user.uid}.png`).getDownloadURL()
        //   .then(
        //     imageUrl => {
        //       commit('setUserImage', imageUrl)
        //     }
        //   ).catch(
        //     error => {
        //       console.log('erro', error)
        //     }
        //   )

        const newUser = {
          id: user.uid,
          email: user.email,
          image: null,
          events: []
        }

        user.getIdToken().then(
          token => {
            commit('setUser', newUser)
            commit('setAuthHeader', token)
          }
        )
      } else {
        commit('setUser', null)
        commit('setAuthHeader', null)
      }
      // incluir os demais atributos que o usuário pode ter
      // Como postos que administra, perfil de cliente e perfil de frentista
    }
  },
  getters: {
    headers (state) {
      return state.headers
    },
    user (state) {
      return state.user
    },
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    },
    specifications (state) {
      return state.specifications
    },
    libs (state) {
      return state.libs
    }
  }
})
