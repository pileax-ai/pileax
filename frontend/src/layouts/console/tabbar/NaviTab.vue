<template>
  <q-tab :name="item.id"
         :ripple="false"
         class="navi-tab"
         :class="{'pinned': item.pinned, 'minimized': minimized}">
    <section class="row items-center item no-drag-region">
      <div class="col-auto row justify-center items-center prefix">
        <o-icon :name="item.icon" size="1.4rem" v-if="item.icon" />
        <template v-else-if="item.meta?.icon">
          <span>{{ item.meta.icon || NoteDefaultIcon }}</span>
        </template>
      </div>
      <div class="col ellipsis single label">
        {{ menuLabel(item.name) }}
      </div>
      <div class="row justify-center items-center suffix">
        <q-btn icon="close" flat round
               @click.stop.prevent="onClose(item)" />
        <div class="icon">
          <q-icon name="circle" class="text-primary" size="0.6rem" />
        </div>
      </div>
    </section>

    <q-tooltip class="bg-primary text-white" :delay="800">
      {{ menuLabel(item.name) }}
    </q-tooltip>

    <q-menu touch-position context-menu
            class="pi-context-menu">
      <q-list :style="{minWidth: '200px'}">
        <template v-for="(action, i) in actions" :key="`action-${i}`">
          <q-separator class="bg-accent" v-if="action.separator" />
          <o-common-item v-bind="itemAction(action, item)"
                         @click="onAction(action, item)" />
        </template>
      </q-list>
    </q-menu>
  </q-tab>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import { useRoute } from 'vue-router';
import { useTabStore } from 'stores/tab';
import { menuLabel } from 'core/hooks/useMenu';
import { refresh } from 'core/hooks/useRouter';
import { electronIpc } from 'src/api/ipc/electron';
import { NoteDefaultIcon } from 'core/constants/constant';
import { MenuItem } from 'core/types/menu';

const props = defineProps({
  item: {
    type: Object as  PropType<MenuItem>,
    required: true
  },
  minimized: {
    type: Boolean,
    default: false
  },
});

const tabStore = useTabStore();

const actions = computed(() => {
  return [
    { label: 'Refresh Tab', value: 'refresh', icon: 'refresh' },
    { label: 'Pin Tab', value: 'pin', icon: 'mdi-pin-outline', separator: true },
    { label: 'Duplicate Tab', value: 'duplicate', icon: 'copy_all' },
    { label: 'Move Tab to New Window', value: 'newWindow', icon: 'open_in_browser' },
    { label: 'Close', value: 'close', icon: 'close', separator: true },
    { label: 'Close Other Tabs', value: 'closeOther', icon: 'playlist_remove' },
    { label: 'Close Tabs to the Left', value: 'closeToLeft', icon: 'keyboard_tab', iconClass: 'rotate-180' },
    { label: 'Close Tabs to the Right', value: 'closeToRight', icon: 'keyboard_tab' },
  ];
});

function itemAction(action: Indexable, item: MenuItem) {
  action.clickable = true;
  action.closable = true;
  let disabled = false;
  switch (action.value) {
    case 'pin':
      action.label = item.pinned ? 'Unpin Tab' : 'Pin Tab';
      action.icon = item.pinned ? 'mdi-pin-off-outline' : 'mdi-pin-outline';
      break;
    case 'closeOther':
      disabled = !tabStore.canCloseOther(item.id);
      break;
    case 'closeToRight':
      disabled = !tabStore.canCloseRight(item.id);
      break;
    case 'closeToLeft':
      disabled = !tabStore.canCloseLeft(item.id);
      break;
  }
  if (disabled) {
    action.clickable = false;
    action.closable = false;
    action.disabled = 'disabled';
  }
  return action;
}

function onClose(item: MenuItem) {
  tabStore.closeTab(item.id);
}

function onNewWindow(item: MenuItem) {
  if (process.env.MODE === 'electron') {
    electronIpc.openNewWindow(item.id, item.path);
  } else {
    window.open(item.path, '_blank', 'noopener');
  }
}

function onAction (action: Indexable, item: MenuItem) {
  switch (action.value) {
    case 'close':
      tabStore.closeTab(item.id);
      break;
    case 'closeOther':
      tabStore.closeOtherTabs(item.id);
      break;
    case 'closeToLeft':
      tabStore.closeLeftTabs(item.id);
      break;
    case 'closeToRight':
      tabStore.closeRightTabs(item.id);
      break;
    case 'duplicate':
      tabStore.duplicateTab(item.id);
      break;
    case 'newWindow':
      onNewWindow(item);
      break;
    case 'pin':
      tabStore.togglePinTab(item.id);
      break;
    case 'refresh':
      refresh();
      break;
  }
}
</script>

<style lang="scss">
.navi-tab {
}
</style>
