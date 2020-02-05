<template>
 <v-flex shrink pa-0>
   <behaviour :behaviour="behaviour.leftBehaviour" :eventContext="parallel" v-if="behaviour.leftBehaviour"></behaviour>
   <v-layout v-else shrink align-center justify-end row >
      <v-flex shrink>
        <v-chip>{{behaviour.identifier.value}}</v-chip>
      </v-flex>
      <v-flex shrink>
        <v-btn @click="() => levelUp()" icon small>
          <v-icon>keyboard_arrow_right</v-icon>
        </v-btn>
      </v-flex>
      <behaviour :behaviour="behaviour.rightBehaviour" v-if="level === 1 && behaviour.rightBehaviour"></behaviour>
    </v-layout>
   <behaviour :behaviour="behaviour.rightBehaviour" :eventContext="parallel" v-if="behaviour.operand === 'OP_PALALLELISM' && behaviour.rightBehaviour"></behaviour>
 </v-flex>
</template>

<script>
import Behaviour from '@/views/Behaviour'

export default {
  name: 'Behaviour',
  components: { Behaviour },
  props: {
    behaviour: Object,
    eventContext: Object
  },
  data () {
    return {
      level: 0,
      parallel: null
    }
  },
  mounted () {
    if (this.behaviour.operand === 'OP_PALALLELISM') {
      console.log('parallel', this.behaviour)
      this.parallel = {
        type: this.behaviour.operand,
        gates: this.behaviour.parsingGates
      }
    }
  },
  methods: {
    levelUp () {
      this.level = 1
      this.$nextTick(() => {
        this.$root.$emit('novoElemento')
      })
    }
  }
}
</script>
