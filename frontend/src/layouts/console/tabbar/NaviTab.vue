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
import type { PropType } from 'vue'
import { computed } from 'vue'
import { useTabStore } from 'stores/tab'
import useCommon from 'core/hooks/useCommon'
import { menuLabel } from 'core/hooks/useMenu'
import { ipcService } from 'src/api/ipc'
import { NoteDefaultIcon } from 'core/constants/constant'
import type { MenuItem } from 'core/types/menu'

const props = defineProps({
  item: {
    type: Object as  PropType<MenuItem>,
    required: true
  },
  minimized: {
    type: Boolean,
    default: false
  },
})
const emits = defineEmits(['close'])

const { t } = useCommon()
const tabStore = useTabStore()

const actions = computed(() => {
  return [
    { label: t('tab.refresh'), value: 'refresh', icon: 'refresh' },
    { label: t('tab.pin'), value: 'pin', icon: 'mdi-pin-outline', separator: true },
    { label: t('tab.duplicate'), value: 'duplicate', icon: 'copy_all' },
    { label: t('tab.newWindow'), value: 'newWindow', icon: 'open_in_browser' },
    { label: t('tab.close'), value: 'close', icon: 'close', separator: true },
    { label: t('tab.closeOther'), value: 'closeOther', icon: 'playlist_remove' },
    { label: t('tab.closeToLeft'), value: 'closeToLeft', icon: 'keyboard_tab', iconClass: 'rotate-180' },
    { label: t('tab.closeToRight'), value: 'closeToRight', icon: 'keyboard_tab' },
  ]
})

function itemAction(action: Indexable, item: MenuItem) {
  action.clickable = true
  action.closable = true
  let disabled = false
  switch (action.value) {
    case 'pin':
      action.label = item.pinned ? t('tab.unpin') : t('tab.pin')
      action.icon = item.pinned ? 'mdi-pin-off-outline' : 'mdi-pin-outline'
      break
    case 'closeOther':
      disabled = !tabStore.canCloseOther(item.id)
      break
    case 'closeToRight':
      disabled = !tabStore.canCloseRight(item.id)
      break
    case 'closeToLeft':
      disabled = !tabStore.canCloseLeft(item.id)
      break
  }
  if (disabled) {
    action.clickable = false
    action.closable = false
    action.disabled = 'disabled'
  }
  return action
}

function onClose(item: MenuItem) {
  tabStore.closeTab(item.id)
  emits('close')
}

function onNewWindow(item: MenuItem) {
  ipcService.openNewWindow(item.id, item.path)
}

function onAction (action: Indexable, item: MenuItem) {
  switch (action.value) {
    case 'close':
      tabStore.closeTab(item.id)
      break
    case 'closeOther':
      tabStore.closeOtherTabs(item.id)
      break
    case 'closeToLeft':
      tabStore.closeLeftTabs(item.id)
      break
    case 'closeToRight':
      tabStore.closeRightTabs(item.id)
      break
    case 'duplicate':
      tabStore.duplicateTab(item.id)
      break
    case 'newWindow':
      onNewWindow(item)
      break
    case 'pin':
      tabStore.togglePinTab(item.id)
      break
    case 'refresh':
      ipcService.reload()
      break
  }
}
</script>

<style lang="scss">
.navi-tab {
}
</style>
