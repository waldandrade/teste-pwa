<template>
 <v-flex shrink pa-0>
   <v-card shrink class="animation-block" :class="blockClass[isBlock ? behaviour.operand : 'simple']">
    <v-card-title pa-0 v-if="isBlock">
      <div>
        <h5 class="subtitle ma-0">{{ blockTitle[behaviour.operand] }}</h5>
      </div>
    </v-card-title>
    <template v-if="behaviour.operand === 'OP_CHOICE'">
      <behaviour v-for="(b, i) in choices" :label="gateLabel" :choice="choice != null ? choice : i" @choose="behaviourChoose(i)" :key="i" :pBehaviour="b" :origin="behaviour"></behaviour>
    </template>
    <template v-else>
      <behaviour :syncEnv="channel || syncEnv" :choice="choice" @choose="$emit('choose')" @newEvent="evaluateNewEvent" :pBehaviour="behaviour.leftBehaviour" @disabled="occurDisable" :hasDisable="behaviour.operand === 'OP_DISABLE' ? disableActive : hasDisable" @return="processReturn" :label="gateLabel" :syncGates="behaviour.operand === 'OP_PROCESS_INSTANTIATION' ? processSyncGates : (behaviour.parsingGates || []).concat(syncGates || [])" @event="eventOccour" :origin="behaviour" v-if="behaviour.operand !== 'OP_ACTION_PREFIX' && behaviour.operand !== 'OP_HIDING_EVENT' && behaviour.leftBehaviour"></behaviour>
      <behaviour :syncEnv="channel || syncEnv" :choice="choice" @choose="$emit('choose')" @newEvent="evaluateNewEvent" :pBehaviour="behaviour.rightBehaviour" @disabled="occurDisable" :hasDisable="hasDisable" @return="processReturn" v-if="(behaviour.operand != 'OP_ENABLE' || this.enable) && (behaviour.operand != 'OP_DISABLE' || this.disable) && behaviour.operand !== 'OP_ACTION_PREFIX' && behaviour.operand !== 'OP_HIDING_EVENT' && behaviour.rightBehaviour" :label="gateLabel" :syncGates="(behaviour.parsingGates || []).concat(syncGates || [])" @event="eventOccour" :origin="behaviour"></behaviour>
      <v-layout v-if="behaviour.operand === 'OP_EXIT' || behaviour.operand === 'OP_STOP'" shrink align-start justify-end row >
        <v-flex shrink>
          <v-chip :class="{'white--text': true, 'red': behaviour.operand === 'OP_STOP', 'green': behaviour.operand === 'OP_EXIT' }">{{behaviour.operand === 'OP_EXIT' ? 'EXIT' : 'STOP'}}</v-chip>
        </v-flex>
        <v-flex shrink>
          <v-btn :class="{'white--text': true, 'red': behaviour.operand === 'OP_STOP', 'green': behaviour.operand === 'OP_EXIT' }" @click="() => {}" icon small>
            <v-icon>{{behaviour.operand === 'OP_STOP' ? 'block' : 'check' }}</v-icon>
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
        <v-flex shrink v-if="!!isGateParallel && eventState !== 'GO'">
          <v-layout column>
            <v-btn v-if="disable" class="red darken-3 white--text" @click="() => message(`This event was disabled by the environment.`)" icon small>
              <v-icon>block</v-icon>
            </v-btn>
            <v-btn v-else-if="!eventState" class="yellow" @click="notifyGate" icon small>
              <v-icon>schedule</v-icon>
            </v-btn>
            <v-btn v-else-if="eventState === 'READY'" class="yellow" @click="notifyGate" icon small>
              <v-icon>swap_horiz</v-icon>
            </v-btn>
            <v-btn v-else class="green" @click="() => message(`It's waiting for sincronizing with other ${gate.value} event`)" icon small>
              <v-icon>play_arrow</v-icon>
            </v-btn>
            <v-btn v-if="hasDisable" class="red darken-3 white--text" @click="clickDisable" icon small>
              <v-icon>last_page</v-icon>
            </v-btn>
          </v-layout>
        </v-flex>
        <v-flex shrink v-else>
          <v-btn v-if="behaviour.operand === 'OP_HIDING_EVENT'" @click="() => runEvent()" icon small>
            <v-icon>keyboard_arrow_right</v-icon>
          </v-btn>
          <v-btn v-else-if="behaviour.operand === 'OP_ACTION_PREFIX'" @click="() => runEvent()" icon small>
            <v-icon>keyboard_arrow_right</v-icon>
          </v-btn>
        </v-flex>
        <behaviour :syncEnv="channel || syncEnv" :choice="choice" @choose="$emit('choose')" @newEvent="evaluateNewEvent" :pBehaviour="behaviour.rightBehaviour" @disabled="occurDisable" :hasDisable="hasDisable" @return="processReturn" :label="gateLabel" @event="eventOccour" :origin="behaviour" :syncGates="syncGates" v-if="eventState === 'GO' && behaviour.rightBehaviour"></behaviour>
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
  data () {
    return {
      eventState: null,
      channel: null,
      enable: false,
      disable: false,
      disableActive: false,
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
      }
    }
  },
  props: {
    choice: null,
    syncEnv: null,
    label: String,
    hasDisable: Boolean,
    syncGates: Array,
    pBehaviour: Object,
    origin: {
      default: null,
      type: Object
    }
  },
  watch: {
    'syncEnv': function (channel) {
      if (this.behaviour.operand === 'OP_ACTION_PREFIX') {
        if (this.behaviour.identifier.value === channel.event.value) {
          console.log(this.eventState)
          // if (this.eventState === 'WAIT') {
          //  this.$emit('newEvent', this.behaviour.identifier, 'GO')
          // }
          // this.eventState = (this.eventState === 'WAIT' || this.eventState === 'GO') ? 'GO' : (channel.type !== 'GO' ? 'READY' : null)
          if (!this.eventState) {
            console.log('isNull')
            if (this.behaviour.identifier === channel.event) {
              this.eventState = 'WAIT'
            } else {
              this.eventState = 'READY'
            }
          } else if (this.eventState === 'READY' && !!channel.type) {
            this.eventState = 'GO'
            console.log('isReady')
          } else if (this.eventState === 'WAIT') {
            if (!channel.type) {
              this.$emit('newEvent', this.behaviour.identifier, 'GO')
            }
            this.eventState = 'GO'
            console.log('está preso aqui')
          }
        }
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
  beforeMount () {
    if (this.behaviour.operand === 'OP_PALALLELISM' && this.behaviour.variacao !== 'INTERLEAVING') {
      this.channel = {
        event: null
      }
    } else if (this.behaviour.operand === 'OP_CHOICE') {
      this.choices.push(this.behaviour.leftBehaviour)
      let rb = this.behaviour.rightBehaviour
      while (rb.operand === 'OP_CHOICE') {
        this.choices.push(rb.leftBehaviour)
        rb = rb.rightBehaviour
      }
      this.choices.push(rb)
    } else if (this.behaviour.operand === 'OP_EXIT') {
      this.$emit('return')
    } else if (this.behaviour.operand === 'OP_DISABLE') {
      this.disableActive = true
      this.disable = false
    }
  },
  methods: {
    evaluateNewEvent (event, type) {
      if (this.channel) {
        this.channel = { ...this.channel, event: event, type: type }
      } else if (this.syncEnv) {
        if (this.behaviour.operand === 'OP_PROCESS_INSTANTIATION') {
          let g = this.behaviour.parsingGates.find((pGate, i) => {
            return this.behaviour.processDeclaration.visibleGateList[i].value === event
          })
          if (g) event = g
        }
        this.$emit('newEvent', event, type)
      }
    },
    clickDisable () {
      this.disable = true
      this.occurDisable()
    },
    occurDisable () {
      if (this.behaviour.operand === 'OP_DISABLE') {
        this.disableActive = false
        this.disable = true
      } else {
        this.$emit('disabled')
      }
    },
    processReturn () {
      if (this.behaviour.operand === 'OP_ENABLE') {
        this.enable = true
      } else {
        this.$emit('return')
      }
    },
    runEvent () {
      // this.$emit('hidingEvent', this.index)
      if (this.choice != null) {
        this.$emit('choose', this.choice)
      } else {
        this.$store.dispatch('eventHappen', this.behaviour.gate)
        this.levelUp()
      }
    },
    levelUp () {
      this.eventState = 'GO'
      this.$nextTick(() => {
        this.$root.$emit('novoElemento')
      })
    },
    notifyGate () {
      if (this.behaviour.operand === 'OP_ACTION_PREFIX') {
        this.$emit('newEvent', this.behaviour.identifier, this.eventState)
        this.$store.dispatch('eventHappen', this.behaviour.gate)
      }
    },
    /*
     Substituir essa sintaxe por uma chamada da ação do próprio gate, ou tendo o gate como variação do evento
    */
    behaviourChoose (index) {
      this.selectedBehaviour = this.choices[index]
    },
    eventOccour (gateName, index) {
      if (this.behaviour.operand === 'OP_PROCESS_INSTANTIATION') {
        let g = this.behaviour.parsingGates.find((pGate, i) => {
          return this.behaviour.processDeclaration.visibleGateList[i].value === gateName
        })
        this.$emit('event', g.value, this.index)
      } else if (this.behaviour.operand === 'OP_PALALLELISM' && this.behaviour.variacao !== 'INTERLEAVING') {
        if (this.behaviour.variacao === 'PART' && this.behaviour.parsingGates.find(g => g.value === gateName)) {
          this.behaviour.parsingGates = this.behaviour.parsingGates.map(pGate => {
            return pGate.value === gateName ? { ...pGate, count: (pGate.count || 0) + 1 } : pGate
          })
        } else {
          this.$emit('event', gateName, this.index)
        }
      } else if (this.behaviour.operand === 'OP_CHOICE') {
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
