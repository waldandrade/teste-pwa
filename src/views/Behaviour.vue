<template>
 <v-flex shrink pa-0>
   <v-card shrink class="animation-block" :class="blockClass[isBlock ? behaviour.operand : 'simple']">
    <v-card-title pa-0 v-if="isBlock">
      <div>
        <h5 class="subtitle ma-0">{{ blockTitle[behaviour.operand] }}</h5>
      </div>
    </v-card-title>
    <template v-if="behaviour.operand === 'OP_CHOICE'">
      <behaviour v-for="(b, i) in choices" @hidingEvent="hidingEventOccour" :label="gateLabel" :index="i" :key="i" :pBehaviour="b" :syncGates="(behaviour.parsingGates || []).concat(syncGates || [])" @event="eventOccour" :origin="behaviour"></behaviour>
    </template>
    <template v-else>
      <behaviour :pBehaviour="behaviour.leftBehaviour" @return="processReturn" :label="gateLabel" @hidingEvent="hidingEventOccour" :syncGates="behaviour.operand === 'OP_PROCESS_INSTANTIATION' ? processSyncGates : (behaviour.parsingGates || []).concat(syncGates || [])" @event="eventOccour" :origin="behaviour" v-if="behaviour.operand !== 'OP_ACTION_PREFIX' && behaviour.operand !== 'OP_HIDING_EVENT' && behaviour.leftBehaviour"></behaviour>
      <behaviour :pBehaviour="behaviour.rightBehaviour" @return="processReturn" v-if="(behaviour.operand != 'OP_ENABLE' || this.enable) && behaviour.operand != 'OP_DISABLE' && behaviour.operand !== 'OP_ACTION_PREFIX' && behaviour.operand !== 'OP_HIDING_EVENT' && behaviour.rightBehaviour" :label="gateLabel" @hidingEvent="hidingEventOccour" :syncGates="(behaviour.parsingGates || []).concat(syncGates || [])" @event="eventOccour" :origin="behaviour"></behaviour>
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
          <v-chip>
            <v-layout pa-1 column>
              <v-flex style="font-size: 10px">
                {{label}}
              </v-flex>
              <v-flex>
                {{behaviour.identifier.value}}
              </v-flex>
            </v-layout>
          </v-chip>
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
          <v-btn v-if="behaviour.operand === 'OP_HIDING_EVENT'" @click="() => runEvent()" icon small>
            <v-icon>keyboard_arrow_right</v-icon>
          </v-btn>
          <v-btn v-else-if="behaviour.operand === 'OP_ACTION_PREFIX'" @click="() => runEvent()" icon small>
            <v-icon>keyboard_arrow_right</v-icon>
          </v-btn>
        </v-flex>
        <behaviour :pBehaviour="behaviour.rightBehaviour" @return="processReturn" :label="gateLabel" @hidingEvent="hidingEventOccour" @event="eventOccour" :origin="behaviour"  :syncGates="syncGates" v-if="(level === 1 || (gate && gate.count > 1)) && behaviour.rightBehaviour"></behaviour>
      </v-layout>
    </template>
   </v-card>
 </v-flex>
</template>

<script>
import Behaviour from '@/views/Behaviour'

export default {
  name: 'Behaviour',
  components: { Behaviour },
  props: {
    label: String,
    index: null,
    syncGates: Array,
    pBehaviour: Object,
    origin: {
      default: null,
      type: Object
    }
  },
  watch: {
    'syncGates': function (val) {
      if (this.gate) {
      }
    }
  },
  computed: {
    gateLabel () {
      return this.behaviour.operand === 'OP_PROCESS_INSTANTIATION' ? this.behaviour.identifier.value : this.label
    },
    behaviour () {
      return this.selectedBehaviour || this.pBehaviour
    },
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
      enable: false,
      level: 0,
      choices: [],
      selectedBehaviour: null,
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
    if (this.behaviour.operand === 'OP_CHOICE') {
      this.choices.push(this.behaviour.leftBehaviour)
      let rb = this.behaviour.rightBehaviour
      while (rb.operand === 'OP_CHOICE') {
        this.choices.push(rb.leftBehaviour)
        rb = rb.rightBehaviour
      }
      this.choices.push(rb)
    }
  },
  methods: {
    processReturn () {
      if (this.behaviour.operand === 'OP_ENABLE') {
        this.enable = true
      } else {
        this.$emit('return')
      }
    },
    runEvent () {
      this.$emit('hidingEvent', this.index)
      this.levelUp()
    },
    levelUp () {
      this.level = 1
      this.$nextTick(() => {
        this.$root.$emit('novoElemento')
      })
    },
    notifyGate () {
      if (this.behaviour.operand === 'OP_ACTION_PREFIX' && !this.gateClick) {
        this.gateClick = true
        this.$emit('event', this.behaviour.identifier.value, this.index)
      }
    },
    /*
     Substituir essa sintaxe por uma chamada da ação do próprio gate, ou tendo o gate como variação do evento
    */
    hidingEventOccour (index) {
      if (this.behaviour.operand === 'OP_CHOICE') {
        // modificar a sintaxe do choice para um array?
        this.selectedBehaviour = this.choices[index]
      } else {
        this.$emit('hidingEvent', index)
      }
    },
    eventOccour (gateName, index) {
      if (this.behaviour.operand === 'OP_PROCESS_INSTANTIATION') {
        let g = this.behaviour.parsingGates.find((pGate, i) => {
          return this.behaviour.processDeclaration.visibleGateList[i].value === gateName
        })
        this.$emit('event', g.value, this.index)
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
          this.$emit('event', gateName, this.index)
        }
      } else if (this.behaviour.operand === 'OP_CHOICE') {
        // modificar a sintaxe do choice para um array?
        this.selectedBehaviour = this.choices[index]
      } else {
        this.$emit('event', gateName, this.index)
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
