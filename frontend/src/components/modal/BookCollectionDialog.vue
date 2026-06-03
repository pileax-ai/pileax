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
               :placeholder="$t('search')"
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
          {{ $t('book.collections._') }}
        </q-item-label>
      </div>
      <section class="row col-12 justify-center search-results">
        <q-list class="col-12">
          <template v-for="(item, index) in results" :key="index">
            <o-common-item :icon="item.icon || '🍃'"
                           :label="item.title"
                           :side-label="`${item.count || 0}`"
                           :class="{'bg-dark': index === selected}"
                           :disable="inCollection(item)"
                           size="1.2rem"
                           clickable
                           @click="onSelected(item)" />
          </template>
          <o-common-item icon="add" size="1.4rem"
                         class="text-primary"
                         :label="$t('book.collections.add')"
                         :clickable="!collectionAdding">
            <o-menu ref="menuRef"
                    anchor="bottom middle"
                    self="top middle"
                    min-width="400px"
                    @before-show="collectionName = ''">
              <q-form class="q-pa-md" @submit.prevent.stop="onAddCollection">
                <header class="text-tips">{{$t('book.collections.add')}}</header>

                <section class="q-pt-md">
                  <o-field :label="$t('title')">
                    <q-input v-model="collectionName" :placeholder="$t('title')"
                             class="pi-field"
                             maxlength="100" counter
                             standout dense clearable autofocus
                             @keydown.enter.stop.prevent="onAddCollection" />
                  </o-field>
                </section>

                <footer class="row col-12 justify-center">
                  <q-btn type="submit"
                         :label="$t('submit')"
                         class="bg-primary text-white"
                         flat />
                </footer>
              </q-form>
            </o-menu>
          </o-common-item>
        </q-list>
        <o-no-data image v-if="!results.length" />
      </section>
    </section>

    <template #footer>
      <section class="row justify-between text-tips">
        <div class="row items-center">
          <div class="row col-auto items-center">
            <kbd>↑↓</kbd> <span class="q-ml-xs">{{ $t('select') }}</span>
          </div>
          <div class="row items-center q-ml-lg">
            <kbd>↵</kbd> <span class="q-ml-xs">{{ $t('add') }}</span>
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
import useCommon from 'core/hooks/useCommon'
import useDialog from 'core/hooks/useDialog'
import OCommandDialog from 'core/components/dialog/OCommandDialog.vue'
import OMenu from 'core/components/menu/OMenu.vue'
import ONoData from 'core/components/misc/ONoData.vue'
import { bookCollectionService, workspaceBookCollectionService } from 'src/api/service/remote'
import { notifyDone, notifyWarning } from 'core/utils/control'

const { t } = useCommon()
const { dialog, onHide } = useDialog()
const term = ref('')
const selected = ref(0)
const list = ref<Indexable[]>([])
const results = ref<Indexable[]>([])
const records = ref<Indexable[]>([])

const menuRef = ref<InstanceType<typeof OMenu>>()
const collectionName = ref('')
const collectionAdding = ref(false)

const book = computed(() => {
  return dialog.value.data as Indexable
})

function inCollection(item: Indexable) {
  return records.value.findIndex(e => e.bookCollectionId === item.id && e.workspaceBookId === book.value.id) >= 0
}

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

function search(val: string) {
  const a = list.value.filter(titleSearchFilter(val))
  return a.filter((item, index) => {
    return a.indexOf(item) === index
  })
}

function onSearch (val: string | number | null) {
  results.value = val
    ? search(val as string)
    : list.value
}

function onKeyup (e: KeyboardEvent) {
  if (results.value.length > 0 && !collectionAdding.value) {
    switch (e.code) {
      case 'ArrowDown':
        selected.value += 1
        break
      case 'ArrowUp':
        selected.value -= 1
        break
      case 'Enter':
        onSelected(results.value[selected.value]!)
        break
      default:
    }
    if (selected.value >= results.value.length) {
      selected.value = 0
    }
    if (selected.value < 0) {
      selected.value = results.value.length - 1
    }
  } else {
    selected.value = 0
  }
}

function onSelected (item: Indexable) {
  if (inCollection(item)) {
    return
  }
  const body = {
    bookCollectionId: item.id,
    workspaceBookId: book.value.id
  }
  workspaceBookCollectionService.save(body).then(res => {
    notifyDone()
  })

  onHide()
}

function initData() {
  workspaceBookCollectionService.getAll().then(res => {
    list.value = res
    results.value = res
  })

  workspaceBookCollectionService.query({
    pageSize: 1000,
    condition: {
      workspaceBookId: book.value.id
    }
  }).then(res => {
    records.value = res.list
  })
}

function onAddCollection() {
  if (!collectionName.value) {
    notifyWarning(t('book.warning.inputTitle'))
    return
  }
  collectionAdding.value = true
  bookCollectionService.save({
    title: collectionName.value
  }).then(res => {
    menuRef.value?.close()
    initData()
  }).finally(() => {
    setTimeout(() => {
      collectionAdding.value = false
    }, 500)
  })

}

onMounted( async () => {
  initData()

  window.addEventListener('keyup', onKeyup)
})

onUnmounted(() => {
  window.removeEventListener('keyup', onKeyup)
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
          margin-bottom: 2px;

          .q-icon {
            margin-top: -2px;
          }

          .time {
            font-size: 0.9rem;
          }

          &__section--side {
            font-size: 1rem!important;
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
