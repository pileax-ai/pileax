<template>
  <q-responsive :ratio="16/9">
    <q-card class="cover-item" flat v-ripple>
      <q-img :src="coverUrl">
      </q-img>
    </q-card>

    <slot></slot>
  </q-responsive>
</template>

<script setup lang="ts">

import useApi from 'src/hooks/useApi'
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: function () {
      return {}
    }
  },
})

const { getFileUrl } = useApi()

const coverUrl = computed(() => {
  const cover = props.data.value
  return cover?.startsWith('/image') ? cover : getFileUrl(cover)
})
</script>

<style lang="scss">
.note-cover-manager .cover-item {
  width: 100%;
  height: 100%;
  cursor: pointer;

  .q-img {
    height: 100%;
  }
}
</style>
