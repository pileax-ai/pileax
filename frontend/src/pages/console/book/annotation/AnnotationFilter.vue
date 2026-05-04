<template>
  <nav class="book-annotation-filter pi-menu">
    <header>
    </header>
    <q-list>
      <q-item-label class="group" caption>
        {{ $t('groupBy.book') }}
      </q-item-label>
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
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import useCommon from 'core/hooks/useCommon'
import { bookAnnotationService } from 'src/api/service/remote'
import useApi from 'src/hooks/useApi'
import useMetadata from 'src/hooks/useMetadata'

const emit = defineEmits(['filter'])

const { getCoverUrl } = useApi()
const { t } = useCommon()
const { BookAnnotationTypes } = useMetadata()
const list = ref<Indexable[]>()
const bookId = ref('')
const type = ref('')

const books = computed(() => {
  const newList = list.value?.map(item => {
    return {
      label: item.title,
      value: item.bookId,
      icon: getCoverUrl(item),
      count: item.count,
      field: 'bookId',
    }
  }) || [] as Indexable[]
  newList.unshift({
    label: t('all'),
    value: '',
    icon: 'apps',
    count: 0,
    field: 'bookId',
  })
  return newList
})

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
    bookAnnotationService.groupByBook().then(res => {
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
  .q-list {
    .group {
      margin: 20px 0 6px 0;
      font-size: 0.9rem;

      &:first-child {
        margin-top: 10px;
      }
    }

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
