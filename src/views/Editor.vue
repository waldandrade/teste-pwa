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
            console.log('teste')
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
      var lotoslint = function (text, observer) {
        // eslint-disable-next-line no-unused-vars
        if (text && text.length) {
          var lex = new LotosLexer(text)
          var syn = new LotosSyntatic(lex._tokens)
          console.log(syn.raiz)
        }
      }

      lotoslint.data = () => {
        return {
          functions: [],
          errors: [], // é nesta estrutura que ficará os errors que serão apresentados no editor
          options: {}
        }
      }

      window.LOTOSLINT = lotoslint

      cm.on('keypress', (event) => {
        cm.showHint()
      })
    },
    saveText (code) {
      this.$store.dispatch('save', this.spec)
      console.log(code)
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
