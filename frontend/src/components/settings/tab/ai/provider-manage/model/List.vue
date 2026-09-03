<template>
  <section class="models-manage">
    <workspace-model-list :provider="provider"
                          @view="emit('view', $event)"
                          v-if="showWorkspaceModels" />
    <system-model-list :provider="provider"
                       @view="emit('view', $event)"
                       v-else />
  </section>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import WorkspaceModelList from './WorkspaceModelList.vue'
import SystemModelList from './SystemModelList.vue'


const props = defineProps({
  provider: {
    type: Object as PropType<Indexable>,
    default: () => {}
  }
})
const emit = defineEmits(['view'])

const showWorkspaceModels = computed(() => {
  const providers = ['Ollama', 'VolcEngine']
  return providers.includes(props.provider.name)
})
</script>

<style lang="scss">
.models-manage {
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
