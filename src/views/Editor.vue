<template>
  <v-layout align-space-around row fill-height>
    <v-flex>
        <codemirror v-model="specification.code" @ready="onCmReady" fill-height  style="height: calc(100vh - 40px)" :options="cmOptions"></codemirror>
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
  var lex = new LotosLexer(text)

  console.log(lex)
}

lotoslint.data = () => {
  return {
    functions: [],
    options: {}
  }
}

window.LOTOSLINT = lotoslint

export default {
  name: 'HelloWorld',
  components: {
    codemirror
  },
  props: {
    msg: String,
    specification: Object
  },
  data: () => ({
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
    }
  }),
  mounted () {
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
