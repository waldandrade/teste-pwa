<template>
  <div class="hello">
    <codemirror v-model="code" fill-height :options="cmOptions"></codemirror>
  </div>
</template>

<script>
// require component
import { codemirror } from 'vue-codemirror'

import 'codemirror/mode/javascript/javascript.js'
// require styles
import '@/assets/css/codemirror.css'
import 'codemirror/theme/base16-dark.css'

export default {
  name: 'HelloWorld',
  components: {
    codemirror
  },
  props: {
    msg: String
  },
  data: () => ({
    code: 'This is a LOTOS Specification',
    cmOptions: {
      // codemirror options
      tabSize: 4,
      mode: 'text/javascript',
      theme: 'base16-dark',
      lineNumbers: true,
      line: true
      // more codemirror options, 更多 codemirror 的高级配置...
    }
  }),
  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
