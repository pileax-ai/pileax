<template>
  <q-tree ref="tree"
          :nodes="noteTree"
          :class="{'empty': noteTree.length === 0}"
          node-key="key"
          v-model:selected="selected"
          @update:selected="onSelected"
          no-connectors
          no-selection-unset>
    <template v-slot:default-header="prop">
      <section class="row justify-between items-center full-width note-item"
               :class="{'allow-drop': prop.node.allowDrop}"
               :draggable="prop.node.type === 'note'"
               @dragstart="onDragStart($event, prop.node)"
               @dragend="onDragEnd"
               @dragenter="onDragEnter"
               @dragleave="onDragLeave"
               @dragover="onDragOver"
               @drop="onDrop($event, prop.node)"
               @click.stop="onOpenNote(prop.node.data)">
        <section class="none-pointer-events note-title" v-if="prop.node.type === 'note'">
          <q-item>
            <q-item-section avatar>
              <q-icon :name="prop.node.icon" size="1.2rem" v-if="prop.node.icon" />
              <span v-else-if="prop.node.data.icon">{{prop.node.data.icon}}</span>
              <span v-else>{{ NoteDefaultIcon }}</span>
            </q-item-section>
            <q-item-section class="label">
              <q-item-label lines="1">
                {{prop.node.label}}
              </q-item-label>
            </q-item-section>
          </q-item>
        </section>
        <section class="none-pointer-events cursor-pointer note-title" v-else>
          <q-item v-if="prop.node.parent">
            <q-item-section class="text-tips" avatar>
              <q-icon :name="prop.node.icon" size="1.2rem" v-if="prop.node.icon" />
              <span v-else-if="prop.node.data.icon">{{prop.node.data.icon}}</span>
            </q-item-section>
            <q-item-section class="label">
              <q-item-label class="text-tips" lines="1">
                {{prop.node.label}}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-btn icon="add"
                 class="bg-dark full-width text-bold"
                 @click="addNote()"
                 flat v-else>
            Add Note
          </q-btn>
        </section>
      </section>

      <!--Actions-->
      <section class="row justify-end text-tips actions" v-if="prop.node.type==='note'">
        <q-btn icon="add" class="action" flat
               @click.stop="addNote(prop.node.key)" />
        <q-btn icon="more_horiz" class="action" flat
               @click.stop="() => {}">
          <o-context-menu anchor="top end" self="top start"
                          :offset="[-50, 6]"
                          :list="noteCommands(prop.node.data)"
                          @command="onCommand($event, prop.node.data as Indexable)">
            <template #list>
              <q-separator class="bg-accent" />
              <o-common-item icon="schedule" class="text-tips"
                             :label="timeMulti(prop.node.data.updateTime).timestamp" />
            </template>
          </o-context-menu>
        </q-btn>
      </section>
    </template>
  </q-tree>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import { timeMulti } from 'core/utils/format'
import { NoteDefaultIcon } from 'core/constants/constant'
import OContextMenu from 'core/components/menu/OContextMenu.vue'
import useNote from 'src/hooks/useNote'
import { useTabStore } from 'stores/tab'
import { ipcService } from 'src/api/ipc'
import useCommon from 'core/hooks/useCommon'

const props = defineProps({
  scope: {
    type: String,
    default: 'all'
  },
})

const { t, confirm } = useCommon()
const {
  notes,
  currentNote,
  refreshNote,
  addNote,
  openNote,
  deleteNote,
  buildNoteTree,
  buildFavoriteTree,
  setParent,
  toggleFavorite,
  duplicateNote,
} = useNote()
const tabStore = useTabStore()
const selected = ref('')

const noteTree = computed(() => {
  switch (props.scope) {
    case 'all':
      return buildNoteTree(notes.value, null, true)
    case 'favorite':
      return buildFavoriteTree(notes.value,  true)
    default:
      return buildNoteTree(notes.value, null, true)
  }
})

function noteCommands(note: Indexable) {
  return [
    {
      label: note.favorite === 1 ? 'Remove from favorite': 'Add to favorite',
      value: 'favorite',
      icon: note.favorite === 1 ? 'star' : 'star_outline',
    },
    {
      label: 'Duplicate',
      value: 'duplicate',
      icon: 'copy_all',
      sideLabel: '⌘D',
      separator: true
    },
    {
      label: 'Move to',
      value: 'move',
      icon: 'keyboard_return',
      iconClass: 'rotate-180',
      sideLabel: '⌘⇧P'
    },
    {
      label: 'Delete',
      value: 'delete',
      icon: 'delete_outline',
      class: 'text-red'
    },
    {
      label: 'Open in new tab',
      value: 'newTab',
      icon: 'open_in_new',
      sideLabel: '⌘⇧',
      separator: true
    },
    {
      label: 'Open in new window',
      value: 'newWindow',
      icon: 'open_in_browser'
    },
  ]
}

function onCommand (command: Indexable, data: Indexable) {
  switch (command.value) {
    case 'duplicate':
      duplicateNote(data)
      break
    case 'favorite':
      toggleFavorite(data)
      break
    case 'delete':
      onDelete(data)
      break
    case 'newTab':
      tabStore.newTab({
        id: data.id,
        name: data.title,
        path: `/note/${data.id}`,
        action: 1,
        meta: {
          type: 'note',
          icon: data.icon || '✍',
          iconClass: 'emoji'
        }
      })
      break
    case 'newWindow':
      ipcService.openNewWindow(data.id, `/note/${data.id}`)
      break
  }
}

function onSelected(key: string) {
  const note = notes.value.find((item) => item.id === key)
  if (note) {
    onOpenNote(note)
  }
}

function onOpenNote (note: Indexable) {
  const id = note.id
  if (id) {
    selected.value = id
    openNote(note)
  }
}

function onDelete(note: Indexable) {
  confirm(
    `你确定删除？[ <span class="text-bold text-amber">${note.title}</span> ]`,
    () => {
      deleteNote(note)
    },
    {
      showCancel: true
    }
  )
}

function onDragStart (e: DragEvent, node: Indexable) {
  const target = e.target as HTMLElement
  const data = node.data
  data.contentType = 'note'
  e.dataTransfer?.setData('text', JSON.stringify(data))
  // e.dataTransfer?.dropEffect = 'move';
  target.classList.add('dragging')
  console.log('drag', e)
}

function onDragEnd (e: DragEvent) {
  const target = e.target as HTMLElement
  target.classList.remove('dragging')
}

function onDragEnter (e: DragEvent) {
  const target = e.target as HTMLElement
  if (target.classList.contains('allow-drop')) {
    e.preventDefault()
    target.classList.add('drag-enter')
  }
}

function onDragLeave (e: DragEvent) {
  const target = e.target as HTMLElement
  if (target.classList.contains('allow-drop')) {
    target.classList.remove('drag-enter')
  }
}

function onDragOver (e: DragEvent) {
  const target = e.target as HTMLElement
  if (target.classList.contains('allow-drop')) {
    e.preventDefault()
  }
}

function onDrop (e: DragEvent, node: Indexable) {
  e.preventDefault()
  const data = JSON.parse(e.dataTransfer?.getData('text') || '{}')
  if (data.contentType === 'note') {
    const note = node.data
    console.log('drop', data.id, note.id)
    if ((data.id !== note.id) && (data.parent !== note.id)) {
      setParent(data.id, note.id)
    }
  }

  const target = e.target as HTMLElement
  e.dataTransfer?.clearData()
  target.classList.remove('drag-enter')
}

watch(() => currentNote.value, (newValue) => {
  selected.value = newValue.id
})

</script>

<style lang="scss">
.note-list {
  .note-tree-panel {
    .q-tree {
      .drag-enter {
        background: rgba(blue, 0.3);
        border-radius: 4px;
      }
      .allow-drop .none-pointer-events {
        pointer-events: none;
      }
      .note-item {
        height: 36px;
        padding: 0 4px;

        &.dragging {
          background: var(--q-dark) !important;
          border-radius: 4px;
          & + .actions {
            display: none;
          }
        }
      }

      .actions {
        position: absolute;
        right: 0;
        width: 56px;
        padding-right: 4px;
        border-radius: 4px;
      }
      .q-tree__node {
        padding: 0;

        .q-focus-helper {
          border-radius: 4px;
          transition: none;
        }
      }
      .q-tree__node--selected {
        &:hover {
          .q-focus-helper {
            background: transparent;
          }
          .q-btn .q-focus-helper {
            background: rgba(#000000, 0.5);
          }
        }
        &::after {
          content: "";
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          background-color: #000000;
          opacity: 0.05;
          border-radius: 4px;
          z-index: -1;
        }

        .q-tree__node-header-content {
          color: var(--q-primary);
        }
      }

      .q-tree__node-header {
        height: 36px;
        padding: 0;
        margin: 2px 8px 0 8px;
        border-radius: 2px;
        &:hover {
          border-radius: 2px;
          .actions {
            visibility: visible;
            background: #eaeaea;
          }
          .action {
            visibility: visible;
          }
        }

        .q-tree__arrow {
          width: 24px;
          height: 36px;
          margin-right: 0;
        }

        .q-tree__arrow:hover {
          //background: rgba(#000000, 0.05);
          //border-radius: 2px;
        }
      }
    }

    .q-tree > .q-tree__node {
      padding: 0;
    }
    .q-tree > .q-tree__node > .q-tree__node-header {
      border-radius: 0;
    }

    .note-title {
      width: 100%;

      .q-item {
        padding: 0;
        min-height: unset;
        .q-item__section--avatar {
          min-width: unset;
          padding-right: 4px;
        }
      }
    }

    // TODO: 优化 :-(
    .q-tree {
      .q-tree__children {
        padding-left: 0;
        .q-tree__node-header {
          padding-left: 16px; // 1
        }

        .q-tree__children {
          .q-tree__node-header {
            padding-left: 32px; // 2
          }
          .q-tree__children {
            .q-tree__node-header {
              padding-left: 48px; // 3
            }
            .q-tree__children {
              .q-tree__node-header {
                padding-left: 64px; // 4
              }
              .q-tree__children {
                .q-tree__node-header {
                  padding-left: 80px; // 5
                }
                .q-tree__children {
                  .q-tree__node-header {
                    padding-left: 96px; // 6
                  }
                  .q-tree__children {
                    .q-tree__node-header {
                      padding-left: 112px; // 7
                    }
                    .q-tree__children {
                      .q-tree__node-header {
                        padding-left: 128px; // 8
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
