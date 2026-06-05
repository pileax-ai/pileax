<template>
  <nav class="book-annotation-filter column fit pi-menu">
    <header class="col-auto q-pb-xs">
      <q-list>
        <q-item-label class="group" caption>
          {{ $t('groupBy.book') }}
        </q-item-label>
        <q-input v-model="searchTerm" class="pi-field"
                 debounce="800"
                 standout dense clearable autofocus
                 @update:modelValue="refresh"
                 v-if="bookSearch">
          <template #prepend>
            <q-icon name="search" class="text-readable" />
          </template>
          <template #append>
            <q-icon name="apps" class="cursor-pointer text-tips"
                    @click.stop="onToggleSearch">
              <o-tooltip>{{$t('all')}}</o-tooltip>
            </q-icon>
          </template>
        </q-input>
        <o-common-item v-bind="defaultBook"
                       :class="`${defaultBook.value === bookId ? 'active' : ''}`"
                       @click="onFilter(defaultBook)"
                       clickable
                       closable
                       right-side v-else>
          <template #side>
            <q-icon name="search" size="1.6rem" @click.stop="onToggleSearch">
              <o-tooltip>{{$t('search')}}</o-tooltip>
            </q-icon>
          </template>
        </o-common-item>
      </q-list>
    </header>
    <section class="col row by-book">
      <q-list>
        <template v-for="(item, index) of books" :key="`item-${index}`">
          <o-common-item v-bind="item"
                         :class="`${item.value === bookId ? 'active' : ''}`"
                         @click="onFilter(item)"
                         clickable
                         closable
                         right-side>
            <template #side>
            <span v-if="item.count">
              {{ item.count }}
            </span>
            </template>
          </o-common-item>
        </template>
        <slot></slot>
      </q-list>
    </section>
    <section class="by-type" :class="books.length > 10 ? 'col-auto' : 'col'">
      <q-list>
        <q-item-label class="group" caption>
          {{ $t('groupBy.type') }}
        </q-item-label>
        <template v-for="(item, index) of BookAnnotationTypes" :key="`item-${index}`">
          <o-common-item v-bind="item"
                         color=""
                         class="text-readable"
                         :class="`${item.value === type ? 'active' : ''}`"
                         @click="onFilter({...item, field: 'type'})"
                         clickable
                         closable
                         right-side>
          </o-common-item>
        </template>
        <slot></slot>
      </q-list>
    </section>
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import useCommon from 'core/hooks/useCommon'
import { bookAnnotationService } from 'src/api/service/remote'
import useApi from 'src/hooks/useApi'
import useMetadata from 'src/hooks/useMetadata'
import OCommonItem from 'core/components/list/OCommonItem.vue'

const emit = defineEmits(['filter'])

const { getCoverUrl } = useApi()
const { t } = useCommon()
const { BookAnnotationTypes } = useMetadata()
const list = ref<Indexable[]>()
const bookId = ref('')
const bookSearch = ref(false)
const searchTerm = ref('')
const type = ref('')

const defaultBook = computed(() => {
  return {
    label: t('all'),
    value: '',
    icon: 'apps',
    count: 0,
    field: 'bookId',
    data: {}
  }
})

const books = computed(() => {
  return  list.value?.map(item => {
    return {
      label: item.title,
      value: item.bookId,
      icon: getCoverUrl(item),
      count: item.count,
      field: 'bookId',
      data: item
    }
  }) || [] as Indexable[]
})

function onToggleSearch() {
  bookSearch.value = !bookSearch.value
  if (!bookSearch.value && searchTerm.value) {
    searchTerm.value = ''
    refresh()
  }
}

function onFilter (item :Indexable) {
  switch (item.field) {
    case 'bookId':
      bookId.value = item.value
      break
    case 'type':
      type.value = item.value
      break
    default:
      break
  }
  emit('filter', item)
}


function refresh() {
  return new Promise((resolve, reject) => {
    bookAnnotationService.groupByBook(searchTerm.value).then(res => {
      list.value = res
      resolve(res)
    }).then(err => {
      reject(err)
    })
  })
}

onMounted(() => {
  refresh()
})

defineExpose({
  refresh
})
</script>

<style lang="scss">
.book-annotation-filter {
  max-height: unset!important;

  header {
    .pi-field.q-field--dense {
      .q-field__control, .q-field__marginal {
        height: 44px !important;
      }
    }
  }

  .group {
    padding: 12px 8px;
    margin-top: 8px;
    font-size: 0.9rem;
  }

  .by-book {
    width: 100%;
    overflow-y: scroll;
  }

  .q-list {
    width: 100%;
    padding: 0 8px;

    .q-item {
      padding: 4px 6px;
      min-height: 44px;

      .dot {
        position: absolute;
      }

      .more {
        .q-icon {
          font-size: 1.2rem!important;
        }
      }

      &:hover {
        .dot {
          z-index: -1;
        }
        .more {
          display: block!important;
          .q-icon {
            font-size: 1.2rem!important;
          }
        }
      }
    }
  }
}
</style>
