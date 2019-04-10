import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/database'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedFile: null,
    specifications: [],
    openedSpecifications: [],
    projects: [],
    libs: [],
    explore: false,
    user: {},
    pessoa: null,
    fotoPerfil: null,
    loading: false,
    loadingGeneral: null,
    error: null,
    headers: null,
    mini: false
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
    setLoadingGeneral (state, payload) {
      state.loadingGeneral = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setUserImage (state, payload) {
      state.user.image = payload
    },
    clearError (state) {
      state.error = null
    },
    setSpecifications (state, payload) {
      state.specifications = payload
    },
    setExplore (state, payload) {
      state.explore = payload
    },
    openSpecification (state, specification) {
      state.openedSpecifications.push(specification)
      state.selectedFile = state.openedSpecifications.length - 1
    },
    updateSpecification (state, specification) {
      state.openedSpecifications = state.openedSpecifications.map((oldSpec) => {
        if (oldSpec.abstractName === specification.abstractName) {
          return specification
        } else {
          return oldSpec
        }
      })
    },
    closeSpecification (state, index) {
      state.openedSpecifications.splice(index, 1)
    },
    setSelectedFile (state, selectFile) {
      state.selectedFile = selectFile
    },
    setMini (state, mini) {
      state.mini = mini
    }
  },
  actions: {
    toggleMini ({ commit }, mini) {
      commit('setMini', mini)
    },
    selectFile ({ commit, state }, selectFile) {
      commit('setSelectedFile', selectFile)
    },
    fileUpload ({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        let storageRef = firebase.storage().ref()
        let fileRef = storageRef.child(`users/${state.user.id}/${payload.project}/${payload.file.name}`)
        fileRef.put(payload.file).then(snapshot => {
          snapshot.ref.getDownloadURL().then(downloadURL => {
            var reader = new FileReader()
            reader.readAsBinaryString(payload.file)
            reader.onloadend = function () {
              var specification = {
                url: downloadURL,
                name: snapshot.metadata.name,
                code: reader.result,
                abstractName: snapshot.metadata.fullPath,
                selfLink: downloadURL
              }
              commit('addSpecification', specification)
              resolve()
            }
          })
        })
      })
    },
    toggleExplore ({ commit, state }, explore) {
      commit('setExplore', explore)
    },
    carregarDados ({ commit, state }) {
      var userRef = firebase.database().ref(`users/${state.user.id}`)

      userRef.once('value', (snapshot) => {
        var specifications = []
        snapshot.forEach((child) => {
          specifications.push(child.val())
        })
        commit('setSpecifications', specifications)
      })
    },
    addLib ({ commit }, lib) {
      commit('addLib', lib)
    },
    openSpecification ({ commit, state }, index) {
      var specification = state.specifications[index]

      commit('setExplore', false)
      commit('setLoadingGeneral', 'Aguarde ...')

      var indexFindSpecification = 0
      var findSpecification = state.openedSpecifications.some((spec, index) => {
        indexFindSpecification = index
        return spec.abstractName === specification.abstractName
      })

      if (!findSpecification) {
        if (specification.code === undefined) {
          var storage = firebase.storage()
          storage.ref(specification.abstractName).getDownloadURL().then((url) => {
            var xhr = new XMLHttpRequest()
            xhr.onload = function (event) {
              var blob = xhr.response
              specification.code = blob
              specification.isDirty = false
              console.log('entrou')
              commit('setLoadingGeneral', null)
              commit('openSpecification', specification)
            }
            xhr.open('GET', url)
            xhr.send()
          })
        } else {
          commit('openSpecification', specification)
        }
      } else {
        commit('setSelectedFile', indexFindSpecification)
      }
    },
    addSpecification ({ commit, state }, specification) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        let storageRef = firebase.storage().ref()
        let fileRef = storageRef.child(`users/${state.user.id}/geral/${specification.name}.lotos`)
        fileRef.putString(specification.code).then(snapshot => {
          snapshot.ref.getDownloadURL().then(downloadURL => {
            specification.url = downloadURL
            commit('addSpecification', specification)
            resolve()
          })
        })
      })
    },
    save ({ commit, state }, specification) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        var storage = firebase.storage()
        storage.ref(specification.abstractName).putString(specification.code).then(snapshot => {
          commit('updateSpecification', specification)
          resolve()
        })
      })
    },
    closeSpecification ({ commit }, index) {
      commit('closeSpecification', index)
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
    loadingGeneral (state) {
      return state.loadingGeneral
    },
    error (state) {
      return state.error
    },
    specifications (state) {
      return state.specifications
    },
    openedSpecifications (state) {
      return state.openedSpecifications
    },
    libs (state) {
      return state.libs
    },
    explore (state) {
      return state.explore
    },
    selectedFile (state) {
      return state.selectedFile
    },
    mini (state) {
      return state.mini
    }
  }
})
