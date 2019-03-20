<template>
  <v-card ref="card">
    <v-card-text class="pa-0">
      <vue-cropper
        alt="User image"
        id="image"
        ref="cropper"
        :src="getSrc"
        :aspectRatio="cropperOptions.aspectRatio"
        :viewMode="cropperOptions.viewMode"
        :background="cropperOptions.background"
        :cropBoxResizable="cropperOptions.cropBoxResizable"
        :guides="cropperOptions.guides"
        :center="cropperOptions.center"
        :scalable="cropperOptions.scalable"
        :cropBoxMovable="cropperOptions.cropBoxMovable"
        :dragMode="cropperOptions.dragMode"
        :minContainerWidth="cropperOptions.minContainerWidth"
        :minContainerHeight="cropperOptions.minContainerHeight"
      ></vue-cropper>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn
        color="accent"
        flat
        @click="cropped"
      >Finalizar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import VueCropper from 'vue-cropperjs'

export default {
  components: { VueCropper },
  props: {
    src: {
      type: String,
      default: 'https://avatars0.githubusercontent.com/u/9064066?v=4&s=460'
    }
  },
  data () {
    return {
      cropperOptions: {
        aspectRatio: 1,
        viewMode: 3,
        background: false,
        cropBoxResizable: false,
        guides: false,
        center: false,
        scalable: false,
        cropBoxMovable: false,
        dragMode: 'move'
      }
    }
  },
  computed: {
    minContainerWidth () {
      return this.$refs.card.$el.clientWidth
    },
    minContainerHeight () {
      return this.$refs.card.$el.clientWidth
    },
    getSrc () {
      return this.src
    }
  },
  methods: {
    cropped () {
      this.$emit('cropped', this.$refs['cropper'].getCroppedCanvas().toDataURL('image/png', 0.1))
    }
  }
}
</script>

<style  scoped>
img {
  max-width: 100%; /* This rule is very important, please do not ignore this! */
}
</style>
