<template>
  <section class="row items-center text-tips note-actions">
    <div>
      {{ timeMulti(currentNote.updateTime || '').fromNow }}
    </div>
    <q-btn icon="star_outline" flat />
    <q-btn icon="more_horiz" flat>
      <q-menu ref="menu"
              anchor="bottom right"
              self="top right"
              :offset="[0, 8]"
              class="o-note-action-menu">
        <q-list :style="{minWidth: '240px'}">
          <template v-for="(action, index) in actions" :key="`action-${index}`">
            <q-separator class="bg-accent" v-if="action.separator" />
            <o-common-item v-bind="action"
                           class="text-tips"
                           @click="onAction(action)"
                           clickable closable />
          </template>
        </q-list>
      </q-menu>
    </q-btn>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import useNote from 'src/hooks/useNote';
import { Note } from 'src/types/note'
import { timeMulti } from 'core/utils/format';
import { MenuItem } from 'core/types/menu'
import { refresh } from 'core/hooks/useRouter'

const { notes, currentNote } = useNote();

const actions = computed(() => {
  return [
    { label: 'Reload', value: 'reload', icon: 'refresh' },
    // { label: 'Pin', value: 'pin', icon: 'push_pin' },
    { label: 'Close', value: 'close', icon: 'close', separator: true },
    { label: 'Close Other Tabs', value: 'closeOther', icon: 'playlist_remove' },
    { label: 'Close Tabs to the Right', value: 'closeToRight', icon: 'keyboard_tab' },
  ];
});

function onAction (action: Indexable) {
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
  }
}
</script>

<style lang="scss">
.note-actions {
  .q-btn {
    width: 32px !important;
    height: 32px !important;
    min-height: 32px;
    min-width: 32px;
    border-radius: 2px;
    margin-left: 8px;
  }
}
</style>
