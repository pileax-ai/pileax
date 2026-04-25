<template>
  <canvas ref="canvasRef"></canvas>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 200
  }
})
const canvasRef = ref()

const render = async () => {
  if (!canvasRef.value) return

  QRCode.toCanvas(canvasRef.value, props.text, {
    width: props.size,
    margin: 1,
    color: {
      dark: '#000',
      light: '#fff'
    }
  })
}

watch(() => props.text, render)

onMounted(render)
</script>

<style lang="scss">
.o-qrcode {
}
</style>
