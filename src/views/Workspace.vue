<template>
  <v-layout align-space-around row fill-height>
    <v-flex>
      <v-tabs
        dark
        color="cyan"
        show-arrows
        grow
        height="60"
      >
        <v-tabs-slider color="yellow"></v-tabs-slider>

        <v-tab
          v-for="i in 5"
          :key="i"
          :href="'#tab-' + i"
        >
          Item {{ i }}
        </v-tab>

        <v-tabs-items>
          <v-tab-item
            v-for="i in 5"
            :key="i"
            :value="'tab-' + i"
          >
            <editor></editor>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-flex>
  </v-layout>
</template>

<script>

import Editor from '@/views/Editor'

export default {
  components: { Editor },
  data () {
    return {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  }
}
</script>
