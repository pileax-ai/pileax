<template>
  <section class="note-tree fit" :style="`max-width: ${maxWidth}px`">
    <header class="row col-12 justify-between items-center section text-tips">
      <div>
        Note
      </div>
      <div class="top-actions">
        <q-btn class="action q-mr-sm" flat
               @click.stop="onSearch">
          <i class="iconfont icon-search" />
          <o-tooltip message="Search note" :caption="`⌘ + P`" />
        </q-btn>
        <q-btn icon="add" class="action" flat
               @click.stop="addNote()">
          <o-tooltip message="Add Note" />
        </q-btn>
      </div>
    </header>
    <section class="note-tree-panel">
      <q-tree ref="tree"
              :nodes="noteTree"
              node-key="key"
              v-model:selected="selected"
              @update:selected="onSelected"
              no-connectors
              no-selection-unset>
        <template v-slot:default-header="prop">
          <section class="row justify-between items-center full-width allow-drop"
                   :draggable="prop.node.type === 'note'"
                   @dragstart="onDragStart($event, prop.node)"
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
              <q-item>
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
            </section>
          </section>

          <!--Actions-->
          <section class="row justify-end text-tips actions" v-if="prop.node.type==='note'">
            <q-btn icon="add" class="action" flat
                   @click.stop="addNote(prop.node.key)" />
            <q-btn icon="more_horiz" class="action" flat
                   @click.stop="() => {}">
              <o-context-menu anchor="top left" self="top left"
                              :offset="[0, -8]"
                              :list="noteMenu"
                              @command="onCommand($event, prop.node.data as Indexable)">
                <template #list>
                  <q-separator class="bg-accent" />
                  <o-common-item icon="schedule" class="text-tips"
                                 :label="timeMulti(prop.node.data.updateTime).fromNow" />
                </template>
              </o-context-menu>
            </q-btn>
          </section>
        </template>
      </q-tree>
    </section>
  </section>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, ref, watch} from 'vue';
import useDialog from 'core/hooks/useDialog';
import { timeMulti } from 'core/utils/format';
import { NoteDefaultIcon } from 'core/constants/constant';
import OContextMenu from 'core/components/menu/OContextMenu.vue';
import useNote from 'src/hooks/useNote';

defineProps({
  maxWidth: {
    type: Number,
    default: 300
  },
});
const { openDialog } = useDialog();
const {
  notes,
  currentNote,
  getAllNotes,
  refreshAllNotes,
  addNote,
  openNote,
  deleteNote,
  buildNoteTree,
} = useNote();

const selected = ref('');
const noteTree = computed(() => {
  return buildNoteTree(notes.value);
})
const noteMenu = computed(() => {
  return [
    { label: 'Duplicate', value: 'duplicate', icon: 'copy_all' },
    { label: 'Delete', value: 'delete', icon: 'delete' },
  ]
})

function onCommand (command: Indexable, data: Indexable) {
  switch (command.value) {
    case 'duplicate':
      // duplicateNote(data);
      break;
    case 'delete':
      onDelete(data);
      break;
  }
}

function onSelected(key: string) {
  const note = notes.value.find((item) => item.id === key);
  if (note) {
    onOpenNote(note);
  }
}

function onOpenNote (note: Indexable) {
  const id = note.id;
  if (id) {
    selected.value = id;
    openNote(note);
  }
}

function onDelete(note: Indexable) {
  openDialog({
    type: 'tips',
    icon: 'error',
    message: `你确定删除？[ <span class="text-bold text-amber">${note.title}</span> ]`,
    showCancel: true,
    showOk: true,
    onOk: () => {
      deleteNote(note);
    }
  });
}

function onSearch () {
  openDialog({
    type: 'note-search'
  });
}

function onDragStart (e: DragEvent, node: Indexable) {
  let data = node.data;
  data.contentType = 'note';
  e.dataTransfer?.setData('text', JSON.stringify(data));
  // e.dataTransfer?.dropEffect = 'move';
}

function onDragEnter (e: DragEvent) {
  const target = e.target as HTMLElement;
  if (target.classList.contains('allow-drop')) {
    e.preventDefault();
    target.classList.add('drag-enter');
  }
}

function onDragLeave (e: DragEvent) {
  const target = e.target as HTMLElement;
  if (target.classList.contains('allow-drop')) {
    target.classList.remove('drag-enter');
  }
}

function onDragOver (e: DragEvent) {
  const target = e.target as HTMLElement;
  if (target.classList.contains('allow-drop')) {
    e.preventDefault();
  }
}

function onDrop (e: DragEvent, node: Indexable) {
  e.preventDefault();
  const data = JSON.parse(e.dataTransfer?.getData('text') || '{}');
  if (data.contentType === 'note') {
    const note = node.data;
    console.log('drop', data.id, note.id);
    if ((data.id !== note.id) && (data.parent !== note.id)) {
      // this.changeParent(data.id, note.id);
    }
  }

  const target = e.target as HTMLElement;
  e.dataTransfer?.clearData();
  target.classList.remove('drag-enter');
}


watch(() => currentNote.value, (newValue) => {
  selected.value = newValue.id;
  refreshAllNotes();
})

onBeforeMount(() => {
  getAllNotes();
})

</script>

<style lang="scss">
.navi-list:hover {
  .note-tree {
    .top-actions .action {
      visibility: visible;
    }
  }
}
.note-tree {
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
    .drag-enter {
      background: rgba(blue, 0.3);
      border-radius: 4px;
    }
    .allow-drop .none-pointer-events {
      pointer-events: none;
    }

    .q-tree {
      .actions {
        position: absolute;
        right: 0;
        width: 56px;
        padding-right: 4px;
        border-radius: 4px;
      }
      .q-tree__node {
        padding: 0 0 0px 0px;

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
        padding: 0 4px;
        margin: 2px 4px 0 4px;
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

        .q-tree__arrow:hover {
          background: rgba(#000000, 0.05);
          border-radius: 2px;
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
