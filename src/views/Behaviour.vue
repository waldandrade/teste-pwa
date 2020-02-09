<template>
 <v-flex shrink pa-0>
   <v-card shrink class="animation-block" :class="blockClass[isBlock ? behaviour.operand : 'simple']">
    <v-card-title pa-0 v-if="isBlock">
      <div>
        <h5 class="subtitle ma-0">{{ blockTitle[behaviour.operand] }}</h5>
      </div>
    </v-card-title>
    <behaviour :behaviour="behaviour.leftBehaviour" :syncGates="behaviour.operand === 'OP_PROCESS_INSTANTIATION' ? processSyncGates : (behaviour.parsingGates || []).concat(syncGates || [])" @event="eventOccour" :origin="behaviour" v-if="behaviour.operand !== 'OP_ACTION_PREFIX' && behaviour.operand !== 'OP_HIDING_EVENT' && behaviour.leftBehaviour"></behaviour>
    <behaviour :behaviour="behaviour.rightBehaviour" :syncGates="(behaviour.parsingGates || []).concat(syncGates || [])" @event="eventOccour" :origin="behaviour" v-if="behaviour.operand !== 'OP_ACTION_PREFIX' && behaviour.operand !== 'OP_HIDING_EVENT' && behaviour.rightBehaviour"></behaviour>
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
        <v-chip>{{behaviour.identifier.value}}{{behaviour.identifier.count}}</v-chip>
      </v-flex>
      <v-flex shrink v-if="!!isGateParallel && (gate.count || 0) < 2">
        <v-btn v-if="!gate.count" class="yellow" @click="notifyGate" icon small>
          <v-icon>schedule</v-icon>
        </v-btn>
        <v-btn v-else-if="!gateClick" class="yellow" @click="notifyGate" icon small>
          <v-icon>swap_horiz</v-icon>
        </v-btn>
        <v-btn v-else class="green" @click="() => message(`It's waiting for sincronizing with other ${gate.value} event`)" icon small>
          <v-icon>play_arrow</v-icon>
        </v-btn>
      </v-flex>
      <v-flex shrink v-else>
        <v-btn @click="() => levelUp()" icon small>
          <v-icon>keyboard_arrow_right</v-icon>
        </v-btn>
      </v-flex>
      <behaviour :behaviour="behaviour.rightBehaviour" @event="eventOccour" :origin="behaviour"  :syncGates="syncGates" v-if="(level === 1 || (gate && gate.count > 1)) && behaviour.rightBehaviour"></behaviour>
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
    syncGates: Array,
    behaviour: Object,
    origin: {
      default: null,
      type: Object
    },
    left: Boolean
  },
  watch: {
    'syncGates': function (val) {
      if (this.gate) {
      }
    }
  },
  computed: {
    processSyncGates () {
      let gates = []
      if (this.syncGates) {
        this.behaviour.processDeclaration.visibleGateList.forEach((pGate, i) => {
          let sGate = this.syncGates.find(pGate => pGate.value === this.behaviour.parsingGates[i].value)
          if (sGate) {
            pGate.count = sGate.count
            gates.push(pGate)
          }
        })
      }
      return gates
    },
    gate () {
      return (!!this.behaviour.identifier && !!this.syncGates) ? this.syncGates.find((g) => g.value === this.behaviour.identifier.value) : null
    },
    isGateParallel () {
      return this.behaviour.operand === 'OP_ACTION_PREFIX' && !!this.gate
    },
    isBlock () {
      return !!this.behaviour.operand && ['OP_PALALLELISM', 'OP_CHOICE'].includes(this.behaviour.operand) && (!this.origin || this.origin.operand !== this.behaviour.operand)
    }
  },
  data () {
    return {
      level: 0,
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
      },
      gateClick: false
    }
  },
  mounted () {
  },
  methods: {
    levelUp () {
      this.level = 1
      this.$nextTick(() => {
        this.$root.$emit('novoElemento')
      })
    },
    notifyGate () {
      if (this.behaviour.operand === 'OP_ACTION_PREFIX' && !this.gateClick) {
        this.gateClick = true
        this.$emit('event', this.behaviour.identifier.value)
      }
    },
    /*
     Substituir essa sintaxe por uma chamada da ação do próprio gate, ou tendo o gate como variação do evento
    */
    eventOccour (gateName) {
      if (this.behaviour.operand === 'OP_PROCESS_INSTANTIATION') {
        let g = this.behaviour.parsingGates.find((pGate, i) => {
          return this.behaviour.processDeclaration.visibleGateList[i].value === gateName
        })
        this.$emit('event', g.value)
      } else if (this.behaviour.operand === 'OP_PALALLELISM' && this.behaviour.variacao !== 'INTERLEAVING') {
        console.log('chegou')
        // difernciar os tipos de paralelismo
        if (this.behaviour.variacao === 'PART' && this.behaviour.parsingGates.find(g => g.value === gateName)) {
          // console.log(gate.count)
          // gate.count = (gate.count || 0) + 1
          // console.log(gate.count)
          this.behaviour.parsingGates = this.behaviour.parsingGates.map(pGate => {
            return pGate.value === gateName ? { ...pGate, count: (pGate.count || 0) + 1 } : pGate
          })
        } else {
          this.$emit('event', gateName)
        }
      } else {
        this.$emit('event', gateName)
      }
    },
    message (txt) {
      alert(txt)
    }
  }
}
</script>
<style lang="stylus" scoped>

 .v-card.animation-block {

 }

</style>
