<template>
  <section class="note-list fit" :style="`max-width: ${maxWidth}px`">
    <section class="panel favorite"
             :class="{ 'top': favoriteTop, 'bottom': !favoriteTop }">
      <header class="row col-12 justify-between items-center section text-tips">
        <div>
          Favorite
        </div>
        <div class="top-actions">
          <q-btn icon="more_horiz" class="action" flat>
            <o-context-menu anchor="top end" self="top start"
                            :offset="[-50, 6]"
                            :list="panelCommands"
                            @command="onCommand">
              <template #list>
              </template>
            </o-context-menu>
          </q-btn>
        </div>
      </header>
      <section class="note-tree-panel">
        <note-tree scope="favorite" />
      </section>
    </section>

    <section class="panel">
      <header class="row col-12 justify-between items-center section text-tips">
        <div>
          Note
        </div>
        <div class="top-actions">
          <q-btn icon="search" class="action q-mr-sm" flat
                 @click.stop="onSearch">
            <o-tooltip message="Search note" :caption="`⌘ + P`" />
          </q-btn>
          <q-btn icon="add" class="action" flat
                 @click.stop="addNote()">
            <o-tooltip message="Add Note" />
          </q-btn>
        </div>
      </header>
      <section class="note-tree-panel">
        <note-tree scope="all" />
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import useDialog from 'core/hooks/useDialog'
import useNote from 'src/hooks/useNote'
import useCommon from 'core/hooks/useCommon'
const { t } = useCommon()

import NoteTree from './note-tree.vue'
import OContextMenu from 'core/components/menu/OContextMenu.vue'

defineProps({
  maxWidth: {
    type: Number,
    default: 300
  },
})
const { openDialog } = useDialog()
const {
  noteStore,
  getAllNotes,
  addNote,
} = useNote()

const favoriteTop = ref(true)
const panelCommands = computed(() => {
  return [
    {
      label: 'Move up',
      value: 'moveUp',
      icon: 'north',
      clickable: !favoriteTop.value,
      class: favoriteTop.value ? 'text-tips' : ''
    },
    {
      label: 'Move down',
      value: 'moveDown',
      icon: 'south',
      clickable: favoriteTop.value,
      class: !favoriteTop.value ? 'text-tips' : ''
    },
  ]
})

function onCommand (command: Indexable) {
  switch (command.value) {
    case 'moveUp':
      favoriteTop.value = true
      break
    case 'moveDown':
      favoriteTop.value = false
      break
  }
  noteStore.value.setFavoriteTop(favoriteTop.value)
}

function onSearch () {
  openDialog({
    type: 'note-search'
  })
}

onBeforeMount(() => {
  favoriteTop.value = noteStore.value.favoriteTop
  getAllNotes()
})

</script>

<style lang="scss">
.navi-list:hover {
  .note-list {
    .top-actions .action {
      visibility: visible;
    }
  }
}
.note-list {
  display: flex;
  flex-direction: column;

  .panel {
    order: 1;

    &.top {
      order: 0;
    }
    &.bottom {
      order: 2;
    }

    &.favorite {
      &:has(.empty) {
        display: none;
      }
    }
  }

  header.section {
    height: 40px;
    padding: 0 8px 0 8px;

    .top-actions {
      padding: 0 4px;

      .action {
        width: 28px;
        height: 28px;
      }
    }

    &:hover {
      .action {
        visibility: visible;
      }
    }
  }

  .action {
    visibility: hidden;
    min-width: 24px;
    min-height: 24px;
    padding: 0;
    .q-icon {
      font-size: 20px;
      min-height: 20px;
    }
  }

  .note-tree-panel {
  }
}
</style>
