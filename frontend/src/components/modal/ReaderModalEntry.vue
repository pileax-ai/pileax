<template>
  <section>
    <image-viewer-dialog v-if="type === 'image-viewer'" />
    <tips-dialog v-if="type === 'tips'" />
  </section>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import { useComponentStore } from 'stores/component'

import ImageViewerDialog from './ImageViewerDialog.vue'
import TipsDialog from './TipsDialog.vue'

const componentStore = useComponentStore()
const type = computed(() => componentStore.dialog.type)
</script>

<style lang="stylus">
</style>
