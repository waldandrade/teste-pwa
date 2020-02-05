<template>
  <v-layout align-space-around row fill-height>
      <v-flex class="grow">
        <v-layout align-center justify-center column fill-height v-if="!openedSpecifications.length">
          <h1>Criar sua primeira especificação em LOTOS</h1>
          <v-btn flat color="accent" @click="criarEspecificacao = true">Clique aqui para começar!</v-btn>
        </v-layout>
        <v-tabs
          v-else
          hide-slider
          v-model="activeFile"
          dark
          color="grey"
          show-arrows
          left
          height="40"
        >
          <v-tabs-slider color="yellow"></v-tabs-slider>

          <v-tab
            v-for="(specification, i) in openedSpecifications"
            :key="i"
            :href="specifications.abstractName"
          >
            {{ specification.name }}
            <v-btn icon left flat @click="close(i)">
              <v-icon>close</v-icon>
            </v-btn>
          </v-tab>

          <v-tabs-items>
            <v-tab-item
              v-for="(specification, i) in openedSpecifications"
              :key="i"
              :value="specifications.abstractName"
               style="position: relative"
            >
              <editor :specification="specification"></editor>
              <v-fab-transition>
                <v-btn
                  v-show="raiz != null"
                  fixed
                  dark
                  round
                  bottom
                  right
                  color="pink"
                  class="jlotos-btn-simular"
                  @click="() => simular(raiz)"
                >
                  Simular
                  <v-icon>play_arrow</v-icon>
                </v-btn>
              </v-fab-transition>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-flex>
    <v-dialog width="400" persistent v-model="loginUsuario">
      <v-form ref="form" lazy-validation autocomplete="off">
        <v-card>
          <div
            v-if="error" class="form-error"
          >
              <app-alert
                @dismissed="onDismissed"
                :text="error.message"
              ></app-alert>
          </div>
          <v-card-text
            class="pt-4"
            style="position: relative;"
          >
            <v-container>
              <v-layout align-center justify-center column >
                <v-fade-transition leave-absolute>
                  <v-progress-circular
                    v-if="loading"
                    size="24"
                    color="info"
                    indeterminate
                  ></v-progress-circular>
                  <!-- <v-avatar
                    v-else
                    color="transparent"
                    size="120">
                    <img :src="require('@/assets/logo.png')" alt="trevor">
                  </v-avatar> -->
                </v-fade-transition>
                <v-flex xs12 class="pb-3">
                  <h3 class="display-1 font-weight-light grey--text mb-2">Entre no FormalCode</h3>
                </v-flex>
              </v-layout>
              <v-layout column>

                <v-text-field
                  v-model="login.email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="login.password"
                  :rules="passwordRules"
                  label="Password"
                  type="password"
                  required
                ></v-text-field>

                <v-alert
                  v-model="loginErro"
                  type="error"
                  outline
                >
                  <h4>Atenção!</h4>
                  {{errorMessage}}
                </v-alert>

                <div>
                  <v-btn
                    block
                    round
                    dark
                    :loading="loading"
                    :disabled="loading"
                    color="secondary"
                    class="white--text btnLogin"
                    @click="fazerLogin"
                  >
                    Login
                  </v-btn>
                </div>

                <div class="cadastro">
                  <span>Não tem Cadastro? <a @click="cadastroUsuario=true">Cadastre-se</a></span>
                </div>

              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog width="400" persistent v-model="cadastroUsuario">
      <v-form ref="cadForm" lazy-validation autocomplete="off">
        <v-card>
          <div
            v-if="error" class="form-error"
          >
              <app-alert
                @dismissed="onDismissed"
                :text="error.message"
              ></app-alert>
          </div>
          <v-card-text
            class="pt-4"
            style="position: relative;"
          >
            <v-container>
              <v-layout align-center justify-center column >
                <v-fade-transition leave-absolute>
                  <v-progress-circular
                    v-if="loading"
                    size="24"
                    color="info"
                    indeterminate
                  ></v-progress-circular>
                  <!-- <v-avatar
                    v-else
                    color="transparent"
                    size="120">
                    <img :src="require('@/assets/logo.png')" alt="trevor">
                  </v-avatar> -->
                </v-fade-transition>
                <v-flex xs12 class="pb-3">
                  <h3 class="display-1 font-weight-light grey--text mb-2">Cadastre-se no FormalCode</h3>
                </v-flex>
              </v-layout>
              <v-layout column>

                <v-text-field
                  v-model="cadastro.email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="cadastro.password"
                  :rules="passwordRules"
                  label="Password"
                  type="password"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="cadastro.passwordRepeat"
                  :rules="[comparePassowords]"
                  label="Password"
                  type="password"
                  required
                ></v-text-field>

                <div>
                  <v-btn
                    block
                    round
                    dark
                    :loading="loading"
                    :disabled="loading"
                    color="secondary"
                    class="white--text btnLogin"
                    @click="fazerCadastro"
                  >
                    Cadastrar
                  </v-btn>
                </div>

                <div class="cadastro">
                  <span>Já tem cadastro? <a @click="loginUsuario=true">Entre aqui</a></span>
                </div>

              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog fullscreen persistent scrollable :value="temSimulacao" style="overflow-x: hidden">
      <simulacao v-if="temSimulacao" :raiz="simulacao" @encerrarSimulacao="() => simulacao = null"></simulacao>
    </v-dialog>

    <v-dialog width="400" persistent v-model="criarEspecificacao">
      <v-form ref="form" lazy-validation autocomplete="off">
        <v-card>
          <div
            v-if="error" class="form-error"
          >
              <app-alert
                @dismissed="onDismissed"
                :text="error.message"
              ></app-alert>
          </div>
          <v-card-text
            class="pt-4"
            style="position: relative;"
          >
            <v-container>
              <v-layout align-center justify-center column >
                <v-fade-transition leave-absolute>
                  <v-progress-circular
                    v-if="loading"
                    size="24"
                    color="info"
                    indeterminate
                  ></v-progress-circular>
                  <!-- <v-avatar
                    v-else
                    color="transparent"
                    size="120">
                    <img :src="require('@/assets/logo.png')" alt="trevor">
                  </v-avatar> -->
                </v-fade-transition>
                <v-flex xs12 class="pb-3">
                  <h3 class="display-1 font-weight-light grey--text mb-2">Nova especificação</h3>
                </v-flex>
              </v-layout>
              <v-layout column>

                <v-text-field
                  v-model="especificacao.name"
                  label="Nome da especificação"
                  suffix=".lotos"
                  required
                ></v-text-field>

                <div>
                  <v-btn
                    block
                    round
                    dark
                    :loading="loading"
                    :disabled="loading"
                    color="secondary"
                    class="white--text"
                    @click="salvarEspecificacao"
                  >
                    Confirmar
                  </v-btn>
                </div>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog
      v-model="loadingGeneral.visible"
      hide-overlay
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          {{ loadingGeneral.text }}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>

import Editor from '@/views/Editor'
import AppAlert from '@/util/Alert'
import Simulacao from '@/views/Simulacao'

export default {
  components: { Editor, AppAlert, Simulacao },
  data () {
    return {
      simulacao: null,
      activeFile: null,
      loginErro: false,
      errorMessage: '',
      login: {
        email: '',
        password: '',
        tipo: ''
      },
      cadastro: {
        email: '',
        password: '',
        passwordRepeat: '',
        emailRules: [
          v => !!v || 'E-mail obrigatório!',
          v => /.+@.+/.test(v) || 'E-mail inválido'
        ],
        requiredRules: [
          v => !!v || 'Esse campo é obrigatório'
        ],
        passwordRules: [
          v => !!v || 'Insira sua senha!'
        ]
      },
      loginUsuario: false,
      cadastroUsuario: false,
      criarEspecificacao: false,
      especificacao: {
        name: '',
        code: ''
      },
      emailRules: [
        v => !!v || 'Insira seu E-mail!'
      ],
      passwordRules: [
        v => !!v || 'Insira sua senha!'
      ]
    }
  },
  watch: {
    selectedFile (val) {
      if (val !== null && val !== undefined && this.activeFile !== val) {
        this.activeFile = val
      }
    },
    activeFile (val) {
      this.$store.dispatch('selectFile', val)
    },
    user (val) {
      if (val === null || val === undefined || val.id === undefined) {
        this.loginUsuario = true
      } else {
        this.loginUsuario = false
        this.cadastroUsuario = false
        this.$store.dispatch('carregarDados')
      }
    }
  },
  computed: {
    temSimulacao () {
      return this.simulacao != null
    },
    raiz () {
      return this.$store.getters.raiz
    },
    loadingGeneral () {
      var loading = this.$store.getters.loadingGeneral
      return {
        visible: !!loading,
        text: loading
      }
    },
    selectedFile () {
      return this.$store.getters.selectedFile
    },
    specifications () {
      return this.$store.getters.specifications
    },
    openedSpecifications () {
      return this.$store.getters.openedSpecifications
    },
    comparePassowords () {
      return this.cadastro.password !== this.cadastro.passwordRepeat ? 'Senhas não são idênticas!' : true
    },
    loading () {
      return this.$store.getters.loading
    },
    user () {
      return this.$store.getters.user
    },
    error () {
      return this.$store.getters.error
    },
    isUserVerified () {
      return this.$store.getters.isUserVerified
    }
  },
  methods: {
    simular (raiz) {
      this.simulacao = raiz
    },
    close (index) {
      this.$store.dispatch('closeSpecification', index)
    },
    salvarEspecificacao () {
      this.$store.dispatch('addSpecification', this.especificacao).then(() => {
        this.criarEspecificacao = false
      })
    },
    onDismissed () {
      this.$store.dispatch('clearError')
    },
    fazerCadastro () {
      if (this.$refs.cadForm.validate()) {
        this.$store.dispatch('signUserUp', { email: this.cadastro.email, password: this.cadastro.password })
      }
    },
    fazerLogin () {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('signUserIn', { email: this.login.email, password: this.login.password })
      }
    }
  },
  mounted () {
    this.$store.dispatch('toggleMini', true)
    if (!this.$vuetify.breakpoint.mdAndDown) {
      this.$store.dispatch('toggleExplore', true)
    }

    if (this.user === null || this.user === undefined || this.user.id === undefined) {
      this.loginUsuario = true
    } else {
      this.loginUsuario = false
      this.cadastroUsuario = false
      this.$store.dispatch('carregarDados')
    }
  }
}
</script>
