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
                scroll-target="#scrolling-techniques"
              >
                <div>
                  <v-layout justify-space-around>
                    <v-avatar :size="$vuetify.breakpoint.mdAndDown?'30px':'65px'" tile>
                      <img
                        :src="require('@/assets/lotus.svg')"
                        alt="Vuetify"
                      >
                    </v-avatar>
                    <h4 v-if="$vuetify.breakpoint.mdAndDown" class="headline secondary--text">FormalCode</h4>
                    <h1 v-else class="display-3 secondary--text">FormalCode</h1>
                  </v-layout>
                </div>
              </v-toolbar>
              <v-flex>
                <v-layout align-start justify-center column fill-height>
                  <h4 v-if="$vuetify.breakpoint.mdAndDown" class="display-1 white--text">Uma ferramenta para especificação formal</h4>
                  <h1 v-else class="display-2 white--text">Uma ferramenta para especificação formal</h1>

                  <h4 v-if="$vuetify.breakpoint.mdAndDown" class="mt-3 headline accent--text">Construa soluções com validação de comportamentos</h4>
                  <h3 v-else class="mt-3 display-1 accent--text">Construa soluções com validação de comportamentos</h3>
                  <div>
                    <v-layout v-if="$vuetify.breakpoint.mdAndDown" row class="pt-4">
                      <v-btn @click="() => {$router.push('editor')}" small color="#FF6400" dark round>Entrar no editor</v-btn>
                    </v-layout>
                    <v-layout v-else row class="pt-4">
                      <v-btn @click="() => {$router.push('editor')}" large color="#FF6400" dark round>Entrar no editor</v-btn>
                    </v-layout>
                  </div>
                </v-layout>
              </v-flex>
              <v-footer
                  height="auto"
                  color="transparent"
                  v-if="!$vuetify.breakpoint.mdAndDown"
                >
                  <v-layout
                    justify-center
                    row
                    wrap
                  >
                    <v-btn
                      :outline="link.window === onboarding"
                      v-for="link in links"
                      :key="link.title"
                      color="white"
                      @click="onboarding = link.window"
                      flat
                      round
                    >
                      {{ link.title }}
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
          <v-flex v-if="!$vuetify.breakpoint.mdAndDown" xs12 md6 lg6 pa-5 @mouseover="hover = true" @mouseleave="hover = false">
            <v-layout align-space-around justify-center column fill-height>
               <v-window v-model="onboarding">
                <v-window-item>
                  <v-card style="width: auto" dark class="elevation-10">
                    <v-card-title>
                      Especifique em LOTOS
                    </v-card-title>
                    <v-card-text>
                      <codemirror v-model="code" fill-height :options="cmOptions"  @ready="onCmReady"   style="height: calc(100vh - 300px)"></codemirror>
                    </v-card-text>
                  </v-card>
                </v-window-item>
                <v-window-item>
                  <v-layout
                    align-center
                    justify-center
                    column
                  >
                    <v-avatar
                      size="80"
                      color="grey lighten-4"
                    >
                      <img src="@/assets/me.jpeg" alt="avatar">
                    </v-avatar>
                    <h3 class="display-1 font-weight-light orange--text mb-2">Waldney Andrade</h3>
                    <div dark class="white--text font-weight-light title mb-2">
                      Bacharel em Ciência da Computação<br>
                      Desenvolvedor FullStack<br>
                      UI/UX Designer
                    </div>
                  </v-layout>
                </v-window-item>
                <v-window-item>
                  <v-layout
                    align-center
                    justify-center
                    column
                  >
                    <h3 class="display-1 font-weight-light orange--text mb-2">Soluções verificadas</h3>
                    <div dark class="white--text font-weight-light title mb-2">
                      Existe uma demanda crescente de softwares validados<br>
                      com alta confiabilidade e tolerância a falha<br>
                      em ambientes com processos concorrentes
                    </div>
                    <h3 class="display-1 font-weight-light orange--text mb-2">Colaboração</h3>
                    <div dark class="white--text font-weight-light title mb-2">
                      Vamos criar uma comunidade que cria e compartilha<br>
                      descrições formais, o que provocará uma evolução<br>
                      significativa da qualidade de software
                    </div>
                  </v-layout>
                </v-window-item>
                <v-window-item>
                  <v-card style="width: auto" dark class="elevation-10">
                    <v-toolbar
                      color="#eee"
                      class="elevation-0 secondary--text" >
                    <v-toolbar-title>Contato</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn flat icon @click="sendEmail" color="info">
                        <v-icon>send</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-form>
                      <v-autocomplete
                        v-model="mail.to"
                        :items="['contato@jlotos.com.br']"
                        chips
                        label="Para"
                        readonly
                        full-width
                        hide-details
                        hide-no-data
                        hide-selected
                        single-line
                      ></v-autocomplete>
                      <v-divider></v-divider>
                      <v-text-field
                        label="Assunto"
                        v-model="mail.assunto"
                        single-line
                        full-width
                        hide-details
                      ></v-text-field>
                      <v-divider></v-divider>
                      <v-textarea
                        v-model="mail.message"
                        label="Informe seus dados para contato"
                        counter
                        maxlength="120"
                        full-width
                        single-line
                      ></v-textarea>
                    </v-form>
                  </v-card>
                </v-window-item>
               </v-window>
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

var lotoslint = function (text, observer) {}
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
      carrouselTimer: null,
      hover: false,
      mail: {
        message: '',
        assunto: 'Seu nome: Tenho uma sugestão ou dúvida',
        to: 'contato@jlotos.com.br'
      },
      onboarding: 0,
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
        {
          title: 'Home',
          window: 0
        },
        {
          title: 'About Me',
          window: 1
        },
        {
          title: 'Objetive',
          window: 2
        },
        {
          title: 'Contact me',
          window: 3
        }
      ]
    }
  },
  watch: {
    hover (val) {
      if (val) {
        clearInterval(this.carrouselTimer)
      } else {
        this.activateCarroursel()
      }
    }
  },
  methods: {
    onCmReady (cm) {
      cm.on('keypress', () => {
        cm.showHint()
      })
    },
    sendEmail () {
      this.$store.dispatch('sendContactMail', this.mail).then(() => {
        this.mail = {
          message: '',
          assunto: 'Seu nome: Tenho uma sugestão ou dúvida',
          to: 'contato@jlotos.com.br'
        }
        alert('Email enviado com sucesso!')
      }).catch((error) => {
        alert(error)
      })
    },
    activateCarroursel () {
      this.carrouselTimer = setInterval(() => {
        let window = this.onboarding + 1
        if (window > 3) {
          window = window - 4
        }
        this.onboarding = window
      }, 5000)
    }
  },
  mounted () {
    this.activateCarroursel()
  }
}
</script>

<style scoped>
  .v-toolbar__extension {
    height: 100px !important;
  }
</style>
