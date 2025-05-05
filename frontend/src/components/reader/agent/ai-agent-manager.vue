<template>
  <section class="reader-add-ai-agent bg-secondary main">
    <o-tool-bar />
    <header class="row col-12 justify-between items-center text-readable">
      <section class="col row items-center">
        <q-icon name="mdi-creation" size="20px" />
        <span class="q-px-sm">
          Add AI Agent
        </span>
      </section>

      <section class="col-auto">
        <q-btn icon="cancel" class="o-toolbar-btn" flat @click="emit('close')" />
      </section>
    </header>
    <q-scroll-area class="o-scroll-wrapper">
      AI Agent
    </q-scroll-area>
  </section>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import OToolBar from 'core/components/electron/OToolBar.vue';

const props = defineProps({
  main: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['close']);

</script>

<style lang="scss">
.reader-add-ai-agent {
  header {
  }
}
</style>
