<template>
  <section class="row items-center text-tips chat-actions">
    <q-btn icon="star_outline" flat v-if="conversation?.id" />
    <q-btn icon="more_horiz" flat>
      <q-menu ref="menu"
              anchor="bottom right"
              self="top right"
              :offset="[0, 4]"
              transition-show="jump-down"
              class="o-chat-action-menu pi-menu dense">
        <header class="row col-12 justify-around text-readable">
          Session Settings
        </header>
        <section class="row col-12 justify-around text-readable select">
          <o-ai-provider-select-btn anchor="bottom right"
                                    self="top right"
                                    class="col-12 bg-accent"
                                    persist
                                    enabled-only />
        </section>
        <q-list :style="{minWidth: '240px'}" v-if="conversation?.id">
          <template v-for="(action, index) in actions" :key="`action-${index}`">
            <q-separator class="bg-accent" v-if="action.separator" />
            <o-common-item v-bind="action"
                           class="text-tips"
                           @click="onAction(action, '')"
                           closable>
              <template #side>
                <q-toggle v-model="enableSmallText"
                          @update:model-value="onAction(action, $event)"
                          v-if="action.value === 'smallText'" />
                <q-toggle v-model="enableFullWidth"
                          @update:model-value="onAction(action, $event)"
                          v-if="action.value === 'fullWidth'" />
                <q-toggle v-model="enableToc"
                          @update:model-value="onAction(action, $event)"
                          v-if="action.value === 'toc'" />
              </template>
            </o-common-item>
          </template>
        </q-list>
      </q-menu>
    </q-btn>
  </section>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from 'vue'
import { refresh } from 'core/hooks/useRouter';
import OAiProviderSelectBtn from 'src/components/ai/OAiProviderSelectBtn.vue';

const props = defineProps({
  conversation: {
    type: Object as PropType<Indexable>,
    default: () => {}
  },
});
const emit = defineEmits(['action']);

const font = ref('default');
const enableSmallText = ref(false);
const enableFullWidth = ref(false);
const enableToc = ref(true);

const actions = computed(() => {
  return [
    // { label: 'Small text', value: 'smallText', icon: 'text_decrease', rightSide: true },
    // { label: 'Full width', value: 'fullWidth', icon: 'open_in_full', iconClass: 'rotate-45', rightSide: true },
    // { label: 'Table of contents', value: 'toc', icon: 'toc', rightSide: true },
    { label: 'Open in new tab', value: 'delete', icon: 'open_in_new', sideLabel: '⌘⇧', clickable: true, separator: true },
    { label: 'Open in new window', value: 'delete', icon: 'open_in_browser', clickable: true },
    { label: 'Delete', value: 'delete', icon: 'delete_outline', clickable: true, separator: true },
  ];
});

function onAction (action: Indexable, value: any) {
  switch (action.value) {
    case 'close':
      break;
    case 'closeOther':
      break;
    case 'closeToRight':
      break;
    case 'reload':
      refresh();
      break;
    case 'fullWidth':
    case 'toc':
      emit('action', { ...action, actionValue: value })
      break;
  }
}

</script>

<style lang="scss">
.chat-actions {
  .q-btn {
    width: 32px !important;
    height: 32px !important;
    min-height: 32px;
    min-width: 32px;
    border-radius: 2px;
    margin-left: 8px;
  }
}

.o-chat-action-menu {
  min-width: 240px !important;
  header {
    padding: 12px 0;
  }

  .select {
    padding: 8px;
    border-top: solid 1px var(--q-accent);
  }

  .q-list {
    padding-top: 0;
    margin-top: -8px;
  }
}
</style>
