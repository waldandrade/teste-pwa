<template>
 <v-flex shrink pa-0>
   <v-card shrink class="animation-block" :class="blockClass[isBlock ? behaviour.operand : 'simple']">
    <v-card-title pa-0 v-if="isBlock">
      <div>
        <h5 class="subtitle ma-0">{{ blockTitle[behaviour.operand] }}</h5>
      </div>
    </v-card-title>
    <behaviour :behaviour="behaviour.leftBehaviour" :origin="behaviour" v-if="behaviour.operand !== 'OP_ACTION_PREFIX' && behaviour.operand !== 'OP_HIDING_EVENT' && behaviour.leftBehaviour"></behaviour>
    <behaviour :behaviour="behaviour.rightBehaviour" :origin="behaviour" v-if="behaviour.operand !== 'OP_ACTION_PREFIX' && behaviour.operand !== 'OP_HIDING_EVENT' && behaviour.rightBehaviour"></behaviour>
    <v-layout v-if="behaviour.operand === 'OP_EXIT' || behaviour.operand === 'OP_STOP'" shrink align-start justify-end row >
      <v-flex shrink>
        <v-chip class="red">{{behaviour.operand === 'OP_EXIT' ? 'EXIT' : 'STOP'}}</v-chip>
      </v-flex>
      <v-flex shrink>
        <v-btn class="red" @click="() => {}" icon small>
          <v-icon>block</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout v-if="behaviour.operand === 'OP_ACTION_PREFIX' || behaviour.operand === 'OP_HIDING_EVENT'" shrink align-start justify-end row >
      <v-flex shrink>
        <v-chip>{{behaviour.identifier.value}}</v-chip>
      </v-flex>
      <v-flex shrink v-if="isGateParallel">
        <v-btn class="yellow" @click="() => {}" icon small>
          <v-icon>schedule</v-icon>
        </v-btn>
      </v-flex>
      <v-flex shrink v-else>
        <v-btn @click="() => levelUp()" icon small>
          <v-icon>keyboard_arrow_right</v-icon>
        </v-btn>
      </v-flex>
      <behaviour :behaviour="behaviour.rightBehaviour" v-if="level === 1 && behaviour.rightBehaviour"></behaviour>
    </v-layout>
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
    origin: {
      default: null,
      type: Object
    },
    left: Boolean
  },
  computed: {
    isGateParallel () {
      return this.behaviour.operand === 'OP_ACTION_PREFIX'
    },
    isBlock () {
      return !!this.behaviour.operand && ['OP_PALALLELISM', 'OP_CHOICE'].includes(this.behaviour.operand) && (!this.origin || this.origin.operand !== this.behaviour.operand)
    }
  },
  data () {
    return {
      level: 0,
      contexts: {
        OP_PALALLELISM: {
          type: this.behaviour.operand,
          behaviours: [this.behaviour]
        },
        OP_CHOICE: {
          type: this.behaviour.operand,
          behaviours: [this.behaviour]
        }
      },
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
    this.checkContext()
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
<style lang="stylus" scoped>

 .v-card.animation-block {

 }

</style>
