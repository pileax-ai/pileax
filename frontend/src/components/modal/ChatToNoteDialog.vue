<template>
  <o-command-dialog class="chat-note-select-dialog"
                    :show="dialog.type === 'chat-note-select'"
                    position="top"
                    scrollable
                    @close="onHide" @show="onShow">
    <template #header>
      <q-input v-model="term"
               @update:model-value="onSearch"
               placeholder="Search"
               autofocus clearable
               standout borderless>
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append>
          <section class="row">
            <kbd>⌘</kbd>
            <kbd>P</kbd>
          </section>
        </template>
      </q-input>
    </template>

    <section class="row col-12 search-container">
      <div class="group">
        <q-item-label class="text-readable" v-if="term">
          Results
        </q-item-label>
        <q-item-label class="text-readable" v-else>
          Recent Notes
        </q-item-label>
      </div>
      <section class="row col-12 justify-center search-results">
        <q-list class="col-12" v-if="results.length">
          <template v-for="(item, index) in results" :key="index">
            <q-item :class="{'bg-dark': index === selected, 'active': item.id === selectedNote?.id}"
                    @click="onSelected(item)" clickable>
              <q-item-section avatar>
                <q-icon :name="item.icon || '✍'" size="1.2rem" />
              </q-item-section>
              <q-item-section class="text-bold">
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
    </section>

    <template #footer>
      <section class="row col-12 justify-between">
        <div class="row items-center text-tips">
          <div class="row items-center">
            <kbd>↑↓</kbd> <span class="q-ml-xs">Select</span>
          </div>
          <div class="row items-center q-ml-lg">
            <kbd>↵</kbd> <span class="q-ml-xs">Open</span>
          </div>
        </div>
        <div class="row items-center text-tips actions">
          <q-btn label="创建于" class="bg-cyan text-white"
                 flat @click="onAddNote" />
          <q-btn label="添加至" class="bg-primary text-white"
                 flat @click="onAppendNote" />

          <q-chip v-if="selectedNote">
            <q-icon :name="selectedNote.icon || '✍'" size="1.2rem" />
            <div class="q-ml-sm ellipsis">
              {{ selectedNote.title }}
            </div>
          </q-chip>
        </div>
      </section>
    </template>
  </o-command-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import useDialog from 'core/hooks/useDialog';
import useNote from 'src/hooks/useNote';
import OCommandDialog from 'core/components/dialog/OCommandDialog.vue';
import ONoData from 'core/components/misc/ONoData.vue';
import {timeMulti} from 'core/utils/format';
import { Note } from 'src/types/note';

const { dialog, onHide, onOk } = useDialog();
const {
  notes,
  recentNotes,
  getAllNotes,
  getRecentNotes,
  addNote,
  openNote,
} = useNote();

const chat = ref<Indexable>({});
const term = ref('');
const selected = ref(0);
const selectedNote = ref<Note>();
const results = ref<Note[]>([]);

function titleSearchFilter (term: string) {
  return (item: Indexable) => {
    let title = item.title || item.name
    if (!title) {
      return -1
    }

    let value = title.toLowerCase()
    let index = value.indexOf(term.toLowerCase())

    if (term.length > 1) {
      return (index >= 0)
    } else {
      return (index === 0)
    }
  }
}

function contentSearchFilter (term: string) {
  return (item: Indexable) => {
    let content = item.content || ''
    let value = content.toLowerCase()
    let index = value.indexOf(term.toLowerCase())

    if (term.length > 1) {
      return (index >= 0)
    } else {
      return (index === 0)
    }
  }
}

function searchNote (val: string) {
  let a = notes.value.filter(titleSearchFilter(val));
  let b = notes.value.filter(contentSearchFilter(val));
  let c = a.concat(b);
  return c.filter((item, index) => {
    return c.indexOf(item) === index;
  });
}

function onSearch (val: string | number | null) {
  results.value = val
    ? searchNote(val as string)
    : recentNotes.value;
}

function onKeyup (e: KeyboardEvent) {
  if (results.value.length > 0) {
    switch (e.code) {
      case 'ArrowDown':
        selected.value += 1;
        break
      case 'ArrowUp':
        selected.value -= 1;
        break;
      case 'Enter':
        onSelected(results.value[selected.value]);
        break;
      default:
    }
    if (selected.value >= results.value.length) {
      selected.value = 0;
    }
    if (selected.value < 0) {
      selected.value = results.value.length - 1;
    }
  } else {
    selected.value = 0;
  }
}

function onSelected (item: Note) {
  selectedNote.value = item;
}

function onAddNote() {
  if (selectedNote.value) {
    addNote(selectedNote.value?.id, 'chat');
  }
}

function onAppendNote() {
  if (selectedNote.value) {
    openNote(selectedNote.value, 'chat');
  }
}

function onShow() {
  chat.value = dialog.value.data
}

onMounted( async () => {
  await getRecentNotes();
  results.value = recentNotes.value;

  window.addEventListener('keyup', onKeyup);
})

onUnmounted(() => {
  window.removeEventListener('keyup', onKeyup);
})
</script>

<style lang="scss">
.chat-note-select-dialog {
  .search-container {
    .group {
      padding: 0 12px;
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
        min-width: 32px;
        padding-right: 0!important;
      }
    }
  }

  .actions {
    .q-btn {
      padding: 0 16px;
      margin-right: 8px;
      height: 28px;
      min-height: unset;
    }

    .q-chip {
      margin: 0;
      max-width: 200px;
      .q-icon {
        margin-top: -2px;
      }
    }
  }
}

</style>
