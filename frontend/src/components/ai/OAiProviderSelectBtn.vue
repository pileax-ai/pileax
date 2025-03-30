<template>
  <q-btn icon="mdi-creation"
         icon-right="mdi-chevron-down"
         label="AI Provider"
         class="bg-accent o-ai-provider-select-btn"
         flat>
    <q-menu :offset="[0, 4]">
      <o-ai-provider-search />
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import useDialog from 'core/hooks/useDialog';
import OAiProviderSearch from 'components/ai/OAiProviderSearch.vue';

const { openDialog } = useDialog();

function onClick() {
  openDialog({
    type: 'ai-provider-search'
  });
}
</script>

<style lang="scss">
.o-ai-provider-select-btn {
}
</style>
