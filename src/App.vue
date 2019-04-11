<template>
  <v-app id="inspire">
    <v-navigation-drawer
        :value="explore"
        clipped
        stateless
        disable-resize-watcher
        fixed
        app
        right
      >
      <v-toolbar
        color="primary"
        dark
        clipped-right
      >
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
          prepend-icon="account_circle"
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
              <v-list-tile>
                <v-list-tile-title>Geral</v-list-tile-title>
                <v-dialog width="300" lazy>
                  <v-btn slot="activator" flat left icon color="pink">
                    <v-icon>cloud_upload</v-icon>
                  </v-btn>
                  <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" v-on:vdropzone-sending="sendingEvent"></vue-dropzone>
                </v-dialog>
              </v-list-tile>
            </template>

            <v-list-tile
              v-for="(specification, i) in specifications"
              :key="i"
              @click="execute('openSpecification', i)"
            >
              <v-list-tile-title v-text="specification.name"></v-list-tile-title>
            </v-list-tile>
          </v-list-group>
        </v-list-group>
      </v-list>
     </v-navigation-drawer>
    <v-navigation-drawer
      :value="mini"
      mini-variant
      dark
      mini-variant-width="45"
      disable-resize-watcher
      stateless
      fixed
      app
      class="jlotos-navigation"
    >
      <v-list dense>
        <template v-for="(item, index) in items">
          <v-list-tile @click="execute(item.action, !explore)" :key="item.text">
            <v-list-tile-action>
              <v-icon small>{{ item.icon }}</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider v-if="item.divider" :key="`divider-${index}`"></v-divider>
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
      { icon: 'contacts', text: 'Contacts', action: 'toggleExplore' },
      { icon: 'history', text: 'Frequently contacted', action: 'toggleExplore' },
      { icon: 'content_copy', text: 'Duplicates', action: 'toggleExplore' },
      { icon: 'settings', text: 'Settings', action: 'toggleExplore' },
      { icon: 'chat_bubble', text: 'Send feedback', action: 'toggleExplore' },
      { icon: 'help', text: 'Help', action: 'toggleExplore' },
      { icon: 'phonelink', text: 'App downloads', action: 'toggleExplore' },
      { divider: true, icon: 'keyboard', text: 'Go to the old version', action: 'toggleExplore' },
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
  background-color: #0C1021
}

.v-navigation-drawer.jlotos-navigation > .v-list .v-list__tile {
  padding: 0;
}
</style>
