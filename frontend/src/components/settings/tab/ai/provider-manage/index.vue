<template>
  <section class="provider-manage-tab">
    <providers @view="onView" v-if="view === 'provider'" />
    <models :provider="provider" @view="onView" v-if="view === 'model'" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Providers from './provider/List.vue'
import Models from './model/List.vue'

const view = ref('provider')
const provider = ref<Indexable>()

function onView(viewAlt: string, item: Indexable) {
  view.value = viewAlt
  provider.value = item || {}
}
</script>

<style lang="scss">
.provider-manage-tab {
  .o-console-section .console-header .console-toolbar {
    padding: 0;
  }

  .console-header {
    //border-bottom: none;
    .console-toolbar {
      min-height: 56px;
    }
  }
  .console-content {
    padding: 0 !important;
  }
  .query-condition-card .condition {
    padding: 1rem 0 0 0;
  }
}
</style>
