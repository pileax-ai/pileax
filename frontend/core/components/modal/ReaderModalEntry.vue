<template>
  <section>
    <image-viewer-dialog v-if="type === 'image-viewer'" />
  </section>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import { useComponentStoreWithOut } from 'stores/component';
import ImageViewerDialog from './ImageViewerDialog.vue';

const componentStore = useComponentStoreWithOut();
const type = computed(() => componentStore.dialog.type);
</script>

<style lang="stylus">
</style>
