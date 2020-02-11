<template>
  <v-card >
    <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">ANIMAÇÃO</h3>
            <div> {{ raiz.title.value }} </div>
          </div>
        </v-card-title>
    <v-layout row>
      <v-flex shrink>
        <v-layout pa-1 fill-height justify-center column>
          <v-fab-transition>
            <v-btn
              dark
              icon
              color="pink"
              class="jlotos-btn-simular"
              @mousedown="startPlusPan" @mouseleave="stopPlusPan" @mouseup="stopPlusPan" @touchstart="startPlusPan" @touchend="stopPlusPan" @touchcancel="stopPlusPan"
            >
              <v-icon>arrow_back</v-icon>
            </v-btn>
          </v-fab-transition>
        </v-layout>
      </v-flex>
      <v-divider vertical></v-divider>
      <v-flex :style="{'max-width': `calc(100% - 120px)`}">
        <v-layout
          pa-4
          class="simulationContainer"
          ref="simulation"
          :style="{'max-width': `calc(100%)`, 'overflow-x': 'scroll', 'white-space': 'nowrap', 'flex-wrap': 'wrap'}"
          fill-height
          column
          align-end
          justify-center
        >
          <div>
            <behaviour v-if="initialBehaviour" :label="raiz.title.value" :pBehaviour="initialBehaviour"></behaviour>
          </div>
        </v-layout>
      </v-flex>
      <v-divider vertical></v-divider>
      <v-flex shrink>
        <v-layout pa-1 fill-height justify-center column>
          <v-fab-transition>
            <v-btn
              dark
              icon
              color="pink"
              class="jlotos-btn-simular"
              @mousedown="startMinusPan" @mouseleave="stopMinusPan" @mouseup="stopMinusPan" @touchstart="startMinusPan" @touchend="stopMinusPan" @touchcancel="stopMinusPan"
            >
              <v-icon>arrow_forward</v-icon>
            </v-btn>
          </v-fab-transition>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-card-actions>
      <v-btn @click="() => this.$emit('encerrarSimulacao')">Encerrar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Behaviour from '@/views/Behaviour'

export default {
  name: 'simulador',
  components: { Behaviour },
  props: {
    raiz: Object
  },
  data () {
    return {
      initialBehaviour: null,
      intervalPlusPan: false,
      intervalMinusPan: false
    }
  },
  mounted () {
    this.initialBehaviour = this.raiz.behaviour
    this.$nextTick(() => {
      let vm = this
      this.$root.$on('novoElemento', () => {
        vm.$refs.simulation.scrollLeft = vm.$refs.simulation.scrollWidth
      })
    })
  },
  methods: {
    minusPan () {
      this.$refs.simulation.scrollLeft += 30
    },
    plusPan () {
      this.$refs.simulation.scrollLeft -= 30
    },
    startPlusPan () {
      if (!this.intervalPlusPan) {
        this.intervalPlusPan = setInterval(() => this.plusPan(), 30)
      }
    },
    stopPlusPan () {
      clearInterval(this.intervalPlusPan)
      this.intervalPlusPan = false
    },
    startMinusPan () {
      if (!this.intervalMinus) {
        this.intervalMinus = setInterval(() => this.minusPan(), 30)
      }
    },
    stopMinusPan () {
      clearInterval(this.intervalMinus)
      this.intervalMinus = false
    }
  }
}
</script>

<style scoped>
  .layout.column.simulationContainer > .flex {
    max-width: unset;
  }
</style>
