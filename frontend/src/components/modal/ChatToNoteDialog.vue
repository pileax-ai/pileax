<template>
  <o-command-dialog class="chat-note-select-dialog"
                    :show="dialog.type === 'chat-note-select'"
                    position="top"
                    scrollable
                    @close="onHide" @show="onShow">
    <template #header>
      <q-input v-model="term"
               @update:model-value="onSearch"
               :placeholder="$t('search')"
               autofocus clearable
               standout borderless>
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append>
          <q-btn icon="close" round flat v-close-popup />
        </template>
      </q-input>
    </template>

    <section class="row col-12 search-container">
      <div class="row col-12 items-center justify-between group">
        <div class="text-readable">{{ $t('note.chooseLocation') }}</div>
        <q-btn-toggle
          v-model="currentTab"
          :options="tabs"
          color="accent"
          text-color="readable"
          toggle-color="cyan"
          toggle-text-color="white"
          size="14px"
          unelevated
        />
      </div>
      <section class="row col-12 justify-center search-results" v-if="term">
        <q-list class="col-12" v-if="results.length">
          <template v-for="(item, index) in results" :key="index">
            <q-item :class="{'active': item.id === selectedNote?.id}"
                    @click="onSelected(item)" clickable>
              <q-item-section avatar>
                <o-icon :name="item.icon || NoteDefaultIcon" size="1.6rem" />
              </q-item-section>
              <q-item-section>
                {{item.title}}
              </q-item-section>
              <q-item-section class="time" side>
                {{ timeMulti(item.updateTime || '').fromNow }}
              </q-item-section>
            </q-item>
          </template>
        </q-list>
        <o-no-data image v-else />
      </section>
      <section class="row col-12 note-tree-view" v-else>
        <q-tree v-model:selected="selected"
                :nodes="noteTree"
                node-key="key"
                @update:selected="onSelectNode">
          <template v-slot:default-header="prop">
            <section class="row justify-between items-center full-width note-item"
                     @click.stop="onSelected(prop.node.data)">
              <section class="none-pointer-events note-title">
                <q-item>
                  <q-item-section avatar>
                    <o-icon :name="prop.node.icon || prop.node.data.icon || NoteDefaultIcon" size="1.6rem" />
                  </q-item-section>
                  <q-item-section class="label">
                    <q-item-label lines="1">
                      {{prop.node.label}}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </section>
            </section>
          </template>
        </q-tree>
      </section>
    </section>

    <template #footer>
      <section class="row col-12 items-center full-height justify-between">
        <template v-if="selectedNote">
          <div class="row items-center text-tips">
              <span v-if="currentTab === 'add'">
                Create sub-note <q-chip square dense>{{chat.message}}</q-chip> under
              </span>
              <span v-else>
                Append content <q-chip square dense>{{chat.message}}</q-chip> to
              </span>
              <q-chip square dense>
                <q-icon :name="selectedNote.icon || '✍'" size="1.2rem" />
                <div class="q-ml-sm ellipsis">
                  {{ selectedNote.title }}
                </div>
              </q-chip>
          </div>
          <div class="row items-center text-tips actions">
            <q-btn :label="$t('ok')"
                   class="bg-primary text-white"
                   flat
                   @click="onConfirm" />
          </div>
        </template>
        <div class="text-tips" v-else>
          <q-chip square dense>{{chat.message}}</q-chip>
        </div>
      </section>
    </template>
  </o-command-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import useDialog from 'core/hooks/useDialog'
import useNote from 'src/hooks/useNote'
import OCommandDialog from 'core/components/dialog/OCommandDialog.vue'
import ONoData from 'core/components/misc/ONoData.vue'
import {timeMulti} from 'core/utils/format'
import type { Note } from 'src/types/note'
import { NoteDefaultIcon } from 'core/constants/constant'
import useCommon from 'core/hooks/useCommon'

const { t } = useCommon()
const { dialog, onHide, onOk } = useDialog()
const {
  notes,
  recentNotes,
  buildNoteTree,
  getRecentNotes,
  addNote,
  openNote,
} = useNote()

const chat = ref<Indexable>({})
const term = ref('')
const selected = ref('')
const selectedNote = ref<Note>()
const results = ref<Note[]>([])


const currentTab = ref('add')
const tabs = computed(() => {
  return [
    { label: t('note.create'), value: 'add' },
    { label: t('note.append'), value: 'append' },
  ]
})

const noteTree = computed(() => {
  return buildNoteTree(notes.value)
})

function titleSearchFilter (term: string) {
  return (item: Indexable) => {
    const title = item.title || item.name
    if (!title) {
      return -1
    }

    const value = title.toLowerCase()
    const index = value.indexOf(term.toLowerCase())

    if (term.length > 1) {
      return (index >= 0)
    } else {
      return (index === 0)
    }
  }
}

function contentSearchFilter (term: string) {
  return (item: Indexable) => {
    const content = item.content || ''
    const value = content.toLowerCase()
    const index = value.indexOf(term.toLowerCase())

    if (term.length > 1) {
      return (index >= 0)
    } else {
      return (index === 0)
    }
  }
}

function searchNote (val: string) {
  const a = notes.value.filter(titleSearchFilter(val))
  const b = notes.value.filter(contentSearchFilter(val))
  const c = a.concat(b)
  return c.filter((item, index) => {
    return c.indexOf(item) === index
  })
}

function onSearch (val: string | number | null) {
  results.value = val
    ? searchNote(val as string)
    : recentNotes.value
}


function onSelected (item?: Note) {
  selectedNote.value = item
}


function onSelectNode (key: string) {
  selectedNote.value = notes.value.find((item) => item.id === key)
}

function onConfirm() {
  if (selectedNote.value) {
    if (currentTab.value === 'add') {
      addNote(selectedNote.value?.id, 'chat')
    } else {
      openNote(selectedNote.value, 'chat')
    }
  }
}

function onShow() {
  chat.value = dialog.value.data
}

onMounted( async () => {
  await getRecentNotes()
  results.value = recentNotes.value
})
</script>

<style lang="scss">
.chat-note-select-dialog {
  .search-container {
    .group {
      padding: 12px;
      border-bottom: solid 1px var(--q-accent);
      .q-item__label {
        padding: 10px 0;
      }
    }
    .search-results {
      position: relative;
      min-height: 320px;
      max-height: 600px;
      .iconfont {
        font-size: 0.8rem;
      }

      .q-list {
        padding: 0 12px;
        .q-item {
          min-height: 40px;
          padding: 8px 12px;
          margin-bottom: 2px;
          border-radius: 4px;

          .q-icon {
            margin-top: -2px;
          }

          .time {
            font-size: 0.9rem;
          }

          &.active {
            color: var(--q-primary);
            background: var(--q-dark);
          }
        }
      }

      .q-item__section--avatar {
        min-width: unset;
        padding-right: 8px!important;
      }
    }
  }

  .note-tree-view {
    padding: 12px;

    .q-tree {
      width: 100%;

      &__node-header {
        padding: 0 4px;
        &:hover {
          cursor: pointer;
          background: var(--q-accent) !important;
          border-radius: 4px;
        }
      }

      .q-item {
        height: 36px;
        min-height: unset;
        padding: 8px 0;

        &__section--avatar {
          min-width: unset;
          padding-right: 8px;
        }

      }
    }
  }

  .actions {
    .q-chip {
      margin: 0;
      max-width: 200px;
      .q-icon {
        margin-top: -2px;
      }
    }

    .q-btn {
      min-width: 80px;
    }
  }

  .q-footer {
    height: 60px;
    .q-chip {
      margin: 0 4px;
    }
  }
}

</style>
