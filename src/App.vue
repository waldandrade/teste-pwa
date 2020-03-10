<template>
  <v-app id="inspire">
    <v-navigation-drawer
      :value="mini"
      mini-variant-width="45"
      disable-resize-watcher
      stateless
      fixed
      app
      class="jlotos-navigation"
    >
      <v-list dense>

        <v-toolbar
          color="transparent"
          clipped-left
        >
          <v-toolbar-title class="primary--text">Formal Code</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon large>
            <v-avatar size="32px" tile>
              <img
                :src="require('@/assets/lotus.svg')"
                alt="Vuetify"
              >
            </v-avatar>
          </v-btn>
        </v-toolbar>
        <v-list>
          <v-list-group
            value="true"
          >
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>Projetos</v-list-tile-title>
              </v-list-tile>
            </template>
            <v-list-group
              no-action
              sub-group
              value="true"
            >
              <template v-slot:activator>
                <v-list-tile exact>
                  <v-list-tile-title>Geral</v-list-tile-title>
                  <v-dialog width="300" lazy>
                    <v-btn slot="activator" flat icon color="pink">
                      <v-icon>cloud_upload</v-icon>
                    </v-btn>
                    <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" v-on:vdropzone-sending="sendingEvent"></vue-dropzone>
                  </v-dialog>
                </v-list-tile>
              </template>

              <template v-for="(specification, i) in specifications">
                <v-list-tile
                  :key="i"
                  @click="execute('openSpecification', i)"
                >
                  <v-list-tile-title v-text="specification.name"></v-list-tile-title>
                </v-list-tile>
              </template>
            </v-list-group>
          </v-list-group>
          <v-list-group
            value="true"
          >
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>Libs</v-list-tile-title>
              </v-list-tile>
            </template>
            <v-list-group
              no-action
              sub-group
              value="true"
            >
              <template v-slot:activator>
                <v-list-tile exact>
                  <v-list-tile-title>Internal</v-list-tile-title>
                </v-list-tile>
              </template>

              <template v-for="(lib, i) in internalLibraries">
                <v-list-tile
                  :key="i"
                  @click="execute('openInternalLib', i)"
                >
                  <v-list-tile-title v-text="lib.name"></v-list-tile-title>
                </v-list-tile>
              </template>
            </v-list-group>
            </v-list-group>
        </v-list>
        <template v-for="item in items">
          <v-list-tile @click="execute(item.action)" :key="item.text">
            <v-list-tile-title>
              {{item.text}}
            </v-list-tile-title>
            <v-list-tile-action>
              <v-icon small>{{ item.icon }}</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-content >
      <v-container pa-0 fluid fill-height>
      <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {
  name: 'App',
  components: {
    vueDropzone: vue2Dropzone
  },
  data: () => ({
    dialog: false,
    items: [
      { icon: 'exit_to_app', text: 'Sair do App', action: 'exitToApp' }
    ],
    dropzoneOptions: {
      url: 'https://localhost:8080/post',
      method: 'put',
      thumbnailWidth: 150,
      maxFilesize: 0.5,
      dictDefaultMessage: "<i class='v-icon material-icons upload_icon'>cloud_upload</i>File upload"
    }
  }),
  methods: {
    execute (action, data) {
      this.$store.dispatch(action, data)
    },
    sendingEvent (file, xhr, formData) {
      this.$store.dispatch('fileUpload', { file: file, project: 'geral' })
      // formData.append('paramName', 'some value or other')
    },
    exitToApp () {
      this.$store.dispatch('exitToApp')
    }
  },
  computed: {
    mini () {
      return this.$store.getters.mini
    },
    specifications () {
      return this.$store.getters.specifications
    },
    explore () {
      return this.$store.getters.explore
    },
    internalLibraries () {
      return this.$store.getters.internalLibraries
    }
  },
  props: {
    source: String
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #162C9B;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.upload_icon {
  vertical-align: bottom;
  padding-top: 10px;
  margin-right: 10px;
}

.v-navigation-drawer .v-divider {
  display: flex !important
}

.v-navigation-drawer.jlotos-navigation {
  background-color: #fafafa
}

.v-navigation-drawer.jlotos-navigation .v-list__group__header .v-list__group__header__prepend-icon{
  width: 50px;
  min-width: 50px;
  margin-right: 0;
  padding: 0 16px;
}

.v-navigation-drawer.jlotos-navigation  .v-list__group__items--no-action .v-list__tile {
  padding-left: 50px;
}

</style>
