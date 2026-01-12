<template>
  <section class="row justify-center items-center o-refresh-btn">
    <template v-if="loading">
      <q-spinner-puff color="primary" :size="size" v-if="loadingName==='puff'" />
      <q-spinner-ios class="text-readable" :size="size" v-else />
    </template>
    <q-btn :icon="icon" round flat v-else />
    <q-tooltip class="bg-primary text-white" v-if="tooltip">
      {{tooltip}}
    </q-tooltip>
  </section>
</template>

<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  loadingName: {
    type: String,
    default: 'ios' // ios, puff
  },
  icon: {
    type: String,
    default: 'autorenew'
  },
  size: {
    type: String,
    default: '20px'
  },
  tooltip: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss">
.o-refresh-btn {
  min-width: 3rem;
  min-height: 3rem;
}
</style>
