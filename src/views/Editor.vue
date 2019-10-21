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
