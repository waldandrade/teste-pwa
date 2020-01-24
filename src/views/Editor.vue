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

var LOTOSHINT = (function () {
  'use strict'

  function importType (libraryTokenValue) {
    var xhr = new XMLHttpRequest()
    let code = null
    xhr.onload = function (event) {
      code = xhr.response
    }
    xhr.open('GET', require(`../assets/libs/${libraryTokenValue}.lib`), false)
    xhr.send()
    return code
  }

  var importLib = function (token, scope) {
    /**
     * Compilar o código das bibliotecas e na análise semântica importar as já compiladas
     */
    var libCode = importType(token.value)
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
        if (syn._errors.length) {
          LOTOSHINT.errors = syn._errors || []
        } else {
          if (syn.raiz.libraryTokens) {
            syn.raiz.libraryTokens.reverse().forEach(element => {
              importLib(element, syn.raiz)
            })
          }
          var semantic = new LotosSemantic(syn.raiz)
          semantic.start()
          LOTOSHINT.errors = semantic._errors || []
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
      // var lotoslint = function (text, observer) {
      //   // eslint-disable-next-line no-unused-vars
      //   let syn = null

      //   if (text && text.length) {
      //     var lex = new LotosLexer(text)
      //     syn = new LotosSyntatic(lex._tokens)
      //     console.log(syn.raiz)
      //   }

      //   this.prototype.data = () => {
      //     return {
      //       functions: [],
      //       errors: syn.errors, // é nesta estrutura que ficará os errors que serão apresentados no editor
      //       options: {}
      //     }
      //   }
      // }

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
