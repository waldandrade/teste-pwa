<template>
 <v-flex shrink pa-0>
   <v-card shrink class="animation-block" :class="blockClass[isBlock() ? behaviour.operand : 'simple']">
    <v-card-title pa-0 v-if="isBlock()">
      <div>
        <h5 class="subtitle ma-0">{{ blockTitle[behaviour.operand] }}</h5>
      </div>
    </v-card-title>
    <behaviour :behaviour="behaviour.leftBehaviour" :eventContext="eventContext" v-if="behaviour.leftBehaviour"></behaviour>
    <v-layout v-else shrink align-start justify-end row >
        <v-flex shrink>
          <v-chip :class="{red: behaviour.operand === 'OP_EXIT' || behaviour.operand === 'OP_STOP' }">{{behaviour.operand === 'OP_EXIT' ? 'EXIT' : behaviour.operand === 'OP_STOP' ? 'STOP' : behaviour.identifier.value}}</v-chip>
        </v-flex>
        <v-flex shrink v-if="behaviour.operand === 'OP_EXIT' || behaviour.operand === 'OP_STOP'">
          <v-btn class="red" @click="() => {}" icon small>
            <v-icon>block</v-icon>
          </v-btn>
        </v-flex>
        <v-flex shrink v-else-if="isGateParallel">
          <v-btn class="yellow" @click="() => {}" icon small>
            <v-icon>schedule</v-icon>
          </v-btn>
        </v-flex>
        <v-flex shrink v-else>
          <v-btn @click="() => levelUp()" icon small>
            <v-icon>keyboard_arrow_right</v-icon>
          </v-btn>
        </v-flex>
        <behaviour :behaviour="behaviour.rightBehaviour" :eventContext="eventContext" v-if="level === 1 && behaviour.rightBehaviour"></behaviour>
      </v-layout>
    <behaviour :behaviour="behaviour.rightBehaviour" :origin="behaviour" :eventContext="parallel" v-if="behaviour.operand === 'OP_PALALLELISM' && behaviour.rightBehaviour"></behaviour>
    <behaviour :behaviour="behaviour.rightBehaviour" :origin="behaviour" v-else-if="behaviour.operand === 'OP_CHOICE' && behaviour.rightBehaviour"></behaviour>
   </v-card>
 </v-flex>
</template>

<script>
import Behaviour from '@/views/Behaviour'

export default {
  name: 'Behaviour',
  components: { Behaviour },
  props: {
    behaviour: Object,
    eventContext: Object,
    origin: {
      default: null,
      type: Object
    },
    left: Boolean
  },
  computed: {
    isGateParallel () {
      return this.behaviour.operand !== 'OP_HIDING_EVENT' && !!this.eventContext && this.eventContext.type === 'OP_PALALLELISM' && this.eventContext.gates && this.eventContext.gates.length
    }
  },
  data () {
    return {
      level: 0,
      parallel: null,
      blockTitle: {
        OP_PALALLELISM: 'Palalelismo',
        OP_CHOICE: 'Escolha'
      },
      blockClass: {
        simple: {
          'elevation-0': true
        },
        OP_PALALLELISM: {
          'elevation-2': true,
          'pl-3': true,
          'pb-2': true,
          'ma-1': true
        },
        OP_CHOICE: {
          'elevation-2': true,
          'pl-3': true,
          'pb-2': true,
          'ma-1': true
        }
      }
    }
  },
  mounted () {
    if (this.behaviour.operand === 'OP_PALALLELISM') {
      this.parallel = {
        type: this.behaviour.operand,
        gates: this.behaviour.parsingGates,
        behaviour: this.behaviour
      }
    }
  },
  methods: {
    levelUp () {
      this.level = 1
      this.$nextTick(() => {
        this.$root.$emit('novoElemento')
      })
    },
    isBlock () {
      return !!this.behaviour.operand && ['OP_PALALLELISM', 'OP_CHOICE'].includes(this.behaviour.operand) && !this.origin
    }
  }
}
</script>
<style lang="stylus" scoped>

 .v-card.animation-block {

 }

</style>
