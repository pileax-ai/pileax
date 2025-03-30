<template>
  <section class="row col-12 o-ai-provider-search search-container">
    <header class="row-auto col-12 search-header">
      <q-input v-model="term"
               @update:model-value="onSearch"
               placeholder="Search"
               autofocus
               standout borderless>
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append>
          <section class="q-px-sm">
            <kbd class="bg-accent text-info">⌘</kbd>
            <kbd class="bg-accent text-info">P</kbd>
          </section>
        </template>
      </q-input>
      <q-separator class="bg-accent" />
      <q-item-label class="text-readable" v-if="term">
        Results
      </q-item-label>
      <q-item-label class="text-readable" v-else>
        Recent Notes
      </q-item-label>
    </header>
    <section class="row col-12 search-results" :style="{height: `${48 * results.length}px`}">
      <q-scroll-area class="absolute-top fit">
        <q-list class="col-12">
          <template v-for="(item, index) in results" :key="index">
            <q-item :class="{'bg-dark': index === selected}"
                    @click="onSelected(item)" clickable>
              <q-item-section avatar>
                <q-icon :name="item.icon || '✍'" size="1.2rem" />
              </q-item-section>
              <q-item-section class="text-bold">
                {{item.title}}
              </q-item-section>
              <q-item-section class="time" side>
                {{ timeMulti(item.updateTime).fromNow }}
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </section>
    <footer class="row-auto col-12 search-footer">
      <q-separator class="bg-accent" />
      <div class="row items-center q-pa-sm text-tips">
        <div class="row items-center">
          <kbd class="bg-accent text-info">↑↓</kbd> <span class="q-ml-xs">Select</span>
        </div>
        <div class="row items-center q-ml-lg">
          <kbd class="bg-accent text-info">↵</kbd> <span class="q-ml-xs">Open</span>
        </div>
      </div>
    </footer>
  </section>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue';
import useDialog from 'core/hooks/useDialog';
import useNote from 'src/hooks/useNote';
import { timeMulti } from 'core/utils/format';

const { dialog, onHide, onOk } = useDialog();
const {
  notes,
  recentNotes,
  openNote,
  getAllNotes,
  getRecentNotes,
} = useNote();

const term = ref('');
const selected = ref(0);
const results = ref<Indexable[]>([]);
const options = ref<Indexable[]>([]);

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
  results.value = val ? searchNote(val as string) : recentNotes.value;
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

function onSelected (item: Indexable) {
  openNote(item);
  onHide();
}

onMounted( async () => {
  getAllNotes();
  await getRecentNotes();
  results.value = recentNotes.value;

  window.addEventListener('keyup', onKeyup);
})

onUnmounted(() => {
  window.removeEventListener('keyup', onKeyup);
})
</script>

<style lang="scss">
.o-ai-provider-search {

  .search-header {
    .q-item__label {
      padding: 10px 10px;
    }
  }
  .search-results {
    position: relative;
    min-height: 240px;
    max-height: 600px;
    .iconfont {
      font-size: 0.8rem;
    }

    .q-list {
      padding: 0 10px;

      .q-item {
        min-height: 40px;
        border-radius: 4px;
        padding: 8px 16px;

        .time {
          font-size: 0.9rem;
        }
      }
    }

    .q-item__section--avatar {
      min-width: 32px;
      padding-right: 0!important;
    }
  }
  .search-footer {
  }
}
</style>
