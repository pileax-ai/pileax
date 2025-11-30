<template>
  <o-command-dialog class="book-collection-dialog"
                    :show="dialog.type === 'book-collection'"
                    :content-style="{
                      maxWidth: '600px',
                      minHeight: '600px',
                      maxHeight: '600px',
                      marginTop: '60px'
                    }"
                    position="top"
                    scrollable
                    @close="onHide">
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
          <q-btn icon="close" flat round v-close-popup />
        </template>
      </q-input>
    </template>

    <section class="row col-12 search-container">
      <div class="group">
        <q-item-label class="text-readable">
          Book Collections
        </q-item-label>
      </div>
      <section class="row col-12 justify-center search-results">
        <q-list class="col-12" v-if="results.length">
          <template v-for="(item, index) in results" :key="index">
            <q-item :class="{'bg-dark': index === selected}"
                    :disable="inCollection(item)"
                    @click="onSelected(item)" clickable>
              <q-item-section avatar>
                <q-icon :name="item.icon || '🍃'" size="1.2rem" />
              </q-item-section>
              <q-item-section class="text-bold">
                {{item.title}}
              </q-item-section>
              <q-item-section class="time" side>
                {{ item.count || 0 }}
              </q-item-section>
            </q-item>
          </template>
        </q-list>
        <o-no-data image v-else />
      </section>
    </section>

    <template #footer>
      <section class="row justify-between text-tips">
        <div class="row items-center">
          <div class="row col-auto items-center">
            <kbd>↑↓</kbd> <span class="q-ml-xs">Select</span>
          </div>
          <div class="row items-center q-ml-lg">
            <kbd>↵</kbd> <span class="q-ml-xs">Add</span>
          </div>
        </div>
        <div class="col q-pl-lg text-right ellipsis">
          {{ book.title }}
        </div>
      </section>
    </template>
  </o-command-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import useDialog from 'core/hooks/useDialog';
import OCommandDialog from 'core/components/dialog/OCommandDialog.vue';
import ONoData from 'core/components/misc/ONoData.vue';
import { tenantBookCollectionService } from 'src/api/service/remote/tenant-book-collection'
import { notifyDone } from 'core/utils/control'

const { dialog, onHide, onOk } = useDialog();
const term = ref('');
const selected = ref(0);
const list = ref<Indexable[]>([]);
const results = ref<Indexable[]>([]);
const records = ref<Indexable[]>([]);

const book = computed(() => {
  return dialog.value.data as Indexable
})

function inCollection(item: Indexable) {
  return records.value.findIndex(e => e.bookCollectionId === item.id && e.tenantBookId === book.value.id) >= 0
}

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

function search(val: string) {
  let a = list.value.filter(titleSearchFilter(val));
  return a.filter((item, index) => {
    return a.indexOf(item) === index;
  });
}

function onSearch (val: string | number | null) {
  results.value = val
    ? search(val as string)
    : list.value;
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
        onSelected(results.value[selected.value]!);
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
  if (inCollection(item)) {
    return
  }
  const body = {
    bookCollectionId: item.id,
    tenantBookId: book.value.id
  }
  tenantBookCollectionService.save(body).then(res => {
    notifyDone()
  })

  onHide();
}

function initData() {
  tenantBookCollectionService.getAll().then(res => {
    list.value = res
    results.value = res
  })

  tenantBookCollectionService.query({
    pageSize: 1000,
    condition: {
      tenantBookId: book.value.id
    }
  }).then(res => {
    records.value = res.list
  })
}

onMounted( async () => {
  initData();

  window.addEventListener('keyup', onKeyup);
})

onUnmounted(() => {
  window.removeEventListener('keyup', onKeyup);
})
</script>

<style lang="scss">
.book-collection-dialog {
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
          border-radius: 4px;

          .q-icon {
            margin-top: -2px;
          }

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
  }
}

</style>
