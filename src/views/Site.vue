<template>
  <v-layout align-space-around justify-start column fill-height>
    <v-flex style="background-color: #0C1021">
      <v-img :src="require('@/assets/background.svg')" conver
              height='100vh'
              alt="Vuetify">
        <v-layout align-space-around justify-start row wrap fill-height>
          <v-flex xs12 md6 lg6 pt-5 pl-5 pr-5>
            <v-layout align-center justify-space-between column fill-height>
              <v-toolbar
                class="elevation-0"
                color="transparent"
                dark
                scroll-off-screen
                extended
                scroll-target="#scrolling-techniques"
              >
                <div slot="extension" class="ml-2">
                  <v-layout justify-space-around>
                    <v-avatar size="65px" tile>
                      <img
                        :src="require('@/assets/lotus.svg')"
                        alt="Vuetify"
                      >
                    </v-avatar>
                    <h1 class="display-3 secondary--text">JLOTOS</h1>
                  </v-layout>
                </div>
              </v-toolbar>
              <v-flex>
                <v-layout align-start justify-center column fill-height>
                  <h1 class="display-2 white--text">Uma ferramenta completa para especificação formal</h1>
                  <h3 class="mt-3 display-1 accent--text">Construa soluções com validação de comportamentos</h3>
                  <div>
                    <v-layout row class="pt-4">
                      <v-btn large color="#FF6400" dark round>Entrar no editor</v-btn>
                      <v-btn large color="secondary" round>Cadastre-se</v-btn>
                    </v-layout>
                  </div>
                </v-layout>
              </v-flex>
              <v-footer
                  height="auto"
                  color="transparent"
                >
                  <v-layout
                    justify-center
                    row
                    wrap
                  >
                    <v-btn
                      v-for="link in links"
                      :key="link"
                      color="white"
                      flat
                      round
                    >
                      {{ link }}
                    </v-btn>
                    <v-flex
                      color="transparent"
                      lighten-2
                      py-3
                      text-xs-center
                      white--text
                      xs12
                    >
                      &copy;2019 — <strong>Waldney Andrade</strong>
                    </v-flex>
                  </v-layout>
                </v-footer>
            </v-layout>
          </v-flex>
          <v-flex xs12 md6 lg6 pa-5>
            <v-layout align-space-around justify-center column fill-height>
              <v-card style="width: auto" dark class="elevation-10">
                <v-card-title>
                  Especifique em LOTOS
                </v-card-title>
                <v-card-text>
                  <codemirror v-model="code" fill-height :options="cmOptions"  @ready="onCmReady"   style="height: calc(100vh - 300px)"></codemirror>
                </v-card-text>
              </v-card>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-img>
    </v-flex>
  </v-layout>
</template>

<script>
// require component
import { codemirror } from 'vue-codemirror'

// require styles
import '@/assets/css/codemirror.css'
import 'codemirror/theme/blackboard.css'
import 'codemirror/addon/lint/lint.css'

// adicionando o modo LNT
import '@/mode/lotos/lotos.js'

// hint
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint.css'

import '@/autocompletion/lotos-hint.js'
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/addon/lint/lint.js'
import '@/lint/lotos-lint.js'

import LotosLexer from '@/analisadores/LotosLexer.js'

var lotoslint = function (text, observer) {
  // eslint-disable-next-line no-unused-vars
  var lex = new LotosLexer(text)
  // console.log(lex)
}

lotoslint.data = () => {
  return {
    functions: [],
    options: {}
  }
}

window.LOTOSLINT = lotoslint

export default {
  components: {
    codemirror
  },
  data () {
    return {
      code: 'specification BIT_ALT [A1, A2] := exit',
      cmOptions: {
        // codemirror options
        smartIndent: true,
        tabSize: 2,
        mode: 'lotos',
        theme: 'blackboard',
        lineNumbers: true,
        line: true,
        autofocus: true,
        hintOptions: {
          completeSingle: false
        },
        electricChars: true,
        gutters: ['CodeMirror-lint-markers'],
        lint: true
        // more codemirror options, 更多 codemirror 的高级配置...
      },
      links: [
        'Home',
        'About Us',
        'Team',
        'Contact Us'
      ]
    }
  },
  methods: {
    onCmReady (cm) {
      cm.on('keypress', () => {
        cm.showHint()
      })
    }
  }
}
</script>

<style scoped>
  .v-toolbar__extension {
    height: 100px !important;
  }
</style>
