<template>
  <v-layout align-space-around row fill-height>
    <v-flex>
      <codemirror v-model="spec.code" @ready="onCmReady" fill-height :class="{'dirty': isDirty}" style="height: calc(100vh - 40px)" :options="cmOptions"></codemirror>
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
import LotosSyntatic from '@/analisadores/LotosSyntatic.js'
import LotosSemantic from '@/analisadores/LotosSemantic.js'

function SyntaticExpection (message, token) {
  this.reason = message
  this.name = 'SyntaticExpection'
  this.column = token.column
  this.line = token.line
}

var LOTOSHINT = (function () {
  'use strict'

  function importType (libraryToken) {
    var xhr = new XMLHttpRequest()
    let code = null
    xhr.onload = function (event) {
      code = xhr.response
    }
    try {
      xhr.open('GET', require(`../assets/libs/${libraryToken.value}.lib`), false)
      xhr.send()
      return code
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        throw new SyntaticExpection(`Lib ${libraryToken.value} não encontrada`, libraryToken)
      } else {
        throw new SyntaticExpection(`Erro ao carregar a lib ${libraryToken.value}`, libraryToken)
      }
    }
  }

  var importLib = function (token, scope) {
    /**
     * Compilar o código das bibliotecas e na análise semântica importar as já compiladas
     */
    try {
      var libCode = importType(token)
      var libLex = new LotosLexer(libCode)

      let libSyn = null
      if (libLex._errors.length) {
        LOTOSHINT.errors = libLex._errors || []
      } else {
        /**
         * Adicionar no analisador sinático a possibilidade de analisar um tipo diretamente
         */
        libSyn = new LotosSyntatic(libLex._tokens)
        if (libSyn._errors.length) {
          LOTOSHINT.errors = libSyn._errors || []
        } else {
          if (libSyn.raiz.operationList && libSyn.raiz.operationList.length) {
            scope.operationList = !scope.operationList ? libSyn.raiz.operationList : libSyn.raiz.operationList.concat(scope.operationList)
          }
          if (libSyn.raiz.sorts && libSyn.raiz.sorts.length) {
            scope.sorts = !scope.sorts ? libSyn.raiz.sorts : libSyn.raiz.sorts.concat(scope.sorts)
          }
          if (libSyn.raiz.types && libSyn.raiz.types.length) {
            scope.types = !scope.types ? libSyn.raiz.types : libSyn.raiz.types.concat(scope.types)
          }
        }
      }
    } catch (e) {
      throw e
    }
  }

  var itself = function (text, observer) {
    // eslint-disable-next-line no-unused-vars
    let syn = null

    LOTOSHINT.errors = []

    if (text && text.length) {
      var lex = new LotosLexer(text)

      if (lex._errors.length) {
        LOTOSHINT.errors = lex._errors || []
      } else {
        syn = new LotosSyntatic(lex._tokens)
        if (syn.raiz.libraryTokens) {
          syn.raiz.libraryTokens.reverse().forEach(element => {
            try {
              importLib(element, syn.raiz)
            } catch (e) {
              LOTOSHINT.errors.push(e)
            }
          })
        }

        if (syn._errors.length) {
          LOTOSHINT.errors = (LOTOSHINT.errors || []).concat(syn._errors)
        } else {
          var semantic = new LotosSemantic(syn.raiz)
          semantic.start()
          LOTOSHINT.errors = (LOTOSHINT.errors || []).concat(semantic._errors)
          if (!LOTOSHINT.errors.length) {
            LOTOSHINT.store.dispatch('storeRaiz', syn.raiz)
          }
        }
      }
    }

    return LOTOSHINT.errors.length === 0
  }

  itself.data = function () {
    var data = {
      functions: [],
      errors: [],
      options: {}
    }

    if (itself.errors.length) {
      data.errors = itself.errors
    }

    return data
  }

  itself.lotoslint = itself

  return itself
}())

export default {
  name: 'HelloWorld',
  components: {
    codemirror
  },
  props: {
    msg: String,
    specification: Object
  },
  data () {
    return {
      spec: { ...this.specification },
      cmOptions: {
        // codemirror options
        smartIndent: true,
        tabSize: 2,
        mode: 'lotos',
        theme: 'blackboard',
        lineNumbers: true,
        matchBrackets: true,
        line: true,
        autofocus: true,
        hintOptions: {
          completeSingle: false
        },
        electricChars: true,
        extraKeys: {
          'Ctrl-S': (instance) => {
            this.saveText(instance.getValue())
          }
        },
        gutters: ['CodeMirror-lint-markers'],
        lint: true
        // more codemirror options, 更多 codemirror 的高级配置...
      }
    }
  },
  methods: {
    onCmReady (cm) {
      LOTOSHINT.store = this.$store
      window.LOTOSLINT = LOTOSHINT

      cm.on('keypress', (event) => {
        cm.showHint()
      })
    },
    saveText (code) {
      this.$store.dispatch('save', this.spec)
    }
  },
  computed: {
    isDirty () {
      return this.spec.code !== this.specification.code
    },
    internalLibraries () {
      return this.$store.getters.internalLibraries
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .dirty {
    border-top: 1px solid red
  }

</style>
