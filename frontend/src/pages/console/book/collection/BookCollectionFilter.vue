<template>
  <nav class="book-collection-filter column fit pi-menu">
    <header class="col-auto">
      <q-list>
        <q-item-label class="group" caption>
          {{ $t('book.collections._') }}
        </q-item-label>
      </q-list>
    </header>

    <section class="col by-collection" v-if="collections.length">
      <q-list>
        <template v-for="(item, index) of collections" :key="`item-${index}`">
          <o-common-item v-bind="item"
                         :class="`text-${item.color} ${item.value === modelValue ? 'active' : ''}`"
                         @click="onAction(item)"
                         clickable
                         closable
                         right-side>
            <template #side>
              <q-icon name="circle"
                      size="8px"
                      class="dot"
                      :color="item.color"
                      v-if="item.value === modelValue && false" />
              <q-btn icon="more_vert"
                     flat
                     class="more"
                     @click.stop="() => {}"
                     v-if="item.value && item.value !== 'add'">
                <q-menu class="pi-menu" :offset="[0, 4]" anchor="bottom right" self="top right">
                  <q-list>
                    <template v-for="(action, _index) in actions" :key="_index">
                      <o-common-item v-bind="action"
                                     class="text-readable"
                                     @click="onAction({
                                      ...action, value:
                                      item.value,
                                      itemLabel: item.label,
                                      itemIcon: item.icon
                                   })"
                                     clickable
                                     closable>
                      </o-common-item>
                    </template>
                  </q-list>
                </q-menu>
              </q-btn>
            </template>
          </o-common-item>
        </template>
        <slot></slot>
      </q-list>
    </section>
    <section :class="collections.length > 10 ? 'col-auto' : 'col'">
      <q-list>
        <o-common-item :label="t('book.collections.add')"
                       icon="add"
                       @click="onAction({value: 'add', action: 'add'})"
                       clickable
                       closable
                       right-side>
        </o-common-item>
      </q-list>
    </section>
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { bookCollectionService } from 'src/api/service/remote/book-collection'
import useCrud from 'src/hooks/useCrud'
import useCommon from 'core/hooks/useCommon'
import { BookCollectionDefaultIcon } from 'core/constants/constant'
import { notifyWarning } from 'core/utils/control'
import { getErrorMessage } from 'src/utils/request'

const apiName = 'bookCollection'
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['action', 'update:modelValue'])

const { t } = useCommon()
const { crud } = useCrud()
const list = ref<Indexable[]>()

const collections = computed(() => {
  const newList = list.value?.map(item => {
    return {
      label: item.title,
      value: item.id,
      icon: item.icon || BookCollectionDefaultIcon,
      color: item.color,
      action: 'filter',
    }
  }) || [] as Indexable[]
  // newList.push({
  //   label: t('book.collections.add'),
  //   value: 'add',
  //   icon: 'add',
  //   color: '',
  //   action: 'add',
  // })
  return newList
})

const actions = computed(() => {
  return [
    {
      label: t('edit'),
      value: '',
      action: 'edit',
      icon: 'edit'
    },
    {
      label: t('delete'),
      value: '',
      action: 'delete',
      icon: 'delete'
    },
  ]
})

function onAction (item :Indexable) {
  switch (item.action) {
    case 'filter':
      emit('update:modelValue', item.value)
      break
    case 'delete':
      onDelete(item)
      break
    default:
      break
  }
  emit('action', item)
}

function onDelete(item: Indexable) {
  crud.remove(apiName, item.value, {
    icon: item.itemIcon,
    label: item.itemLabel,
    onOk: () => {
      refresh()
    },
    onError: (err) => {
      if (err.response.status === 409) {
        notifyWarning(t('book.warning.collectionContainBook'))
      } else {
        const message = getErrorMessage(err)
        notifyWarning(message)
      }
    }
  })
}

function refresh() {
  return new Promise((resolve, reject) => {
    bookCollectionService.getAll().then(res => {
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
.book-collection-filter {
  max-height: unset!important;

  .by-collection {
    width: 100%;
    overflow-y: scroll;
  }

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
