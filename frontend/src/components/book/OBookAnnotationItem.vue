<template>
  <q-item class="o-book-annotation-item"
          :class="{ 'active': item.id === store.annotationId }"
          clickable
          @click="onClick">
    <q-item-section class="row item-label">
      <q-item-label lines="2">
        {{ item.title }}
      </q-item-label>
      <q-item-label lines="1" caption>
        <q-icon :name="getIcon(item)"
                :style="{ color: item.color ? getAnnotationColor(item.color) : '' }"
                size="1rem" />
        {{ item.chapter }}
      </q-item-label>
      <q-item-label class="row justify-between time" lines="1" caption>
        <div>{{ timeMulti(item.createTime).fromNow() }}</div>
      </q-item-label>
    </q-item-section>
    <q-item-section class="side" side>
      <div class="side-wrapper">
        <q-btn icon="more_horiz" size="0.8rem" flat dense @click.stop="() => {}">
          <q-menu class="pi-menu" :offset="[0, 4]">
            <q-list :style="{minWidth: '200px'}">
              <template v-for="(action, index) in actions" :key="`action-${index}`">
                <q-separator class="bg-accent" v-if="action.separator" />
                <o-common-item v-bind="action"
                               class="text-tips"
                               @click="onAction(action)"
                               clickable
                               closable
                               right-side
                               v-if="action.show">
                </o-common-item>
              </template>
              <slot></slot>
            </q-list>
          </q-menu>
        </q-btn>
        <div class="page">
          {{ item.page }}
        </div>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'

import useBook from 'src/hooks/useBook'
import useMetadata from 'src/hooks/useMetadata'
import useBookNote from 'src/hooks/useBookNote'
import useReader from 'src/hooks/useReader'
import { timeMulti } from 'core/utils/dayjs'
import useCommon from 'core/hooks/useCommon'
import { getAnnotationColor } from 'src/utils/book'
import { goToHref } from 'src/api/service/ebook/book'

const props = defineProps({
  item: {
    type: Object as PropType<Indexable>,
    default: () => {
      return {}
    }
  },
})

const { t, confirm, showDialog } = useCommon()
const { store } = useBook()
const { openNote, deleteNote } = useBookNote()
const { BookAnnotationTypes, getArrayItem } = useMetadata()

const actions = computed(() => {
  return [
    {
      label: t('book.jumpToBook'),
      value: 'navigate',
      icon: 'o_navigation',
      sortable: true,
      show: props.item.type === 'note',
    },
    {
      label: t('book.refInfo'),
      value: 'meta',
      icon: 'mdi-tune-variant',
      sortable: true,
      show: props.item.type === 'note',
      separator: false,
    },
    {
      label: t('delete'),
      value: 'delete',
      icon: 'o_delete',
      class: 'text-red',
      sortable: true,
      show: true,
      separator: props.item.type === 'note',
    },
  ]
})

function onAction (action :Indexable) {
  switch (action.value) {
    case 'delete':
      onDelete()
      break
    case 'meta':
      onMeta()
      break
    case 'navigate':
      onNavigate()
      break
    default:
      break
  }
}

function onDelete() {
  confirm(t('deleteConfirm'), {
    label: props.item.title,
    onOk: () => {
      deleteNote(props.item)
    }
  })
}

function onMeta() {
  showDialog({
    type: 'book-refer-meta',
    data: props.item
  })
}

function onNavigate() {
  if (props.item.value) {
    goToHref(props.item.value)
  }
}

function onClick() {
  store.setAnnotationId(props.item.id)
  const type = props.item.type

  if (type === 'note' || (type === 'annotation' && props.item.note)) {
    openNote(props.item.id)
  }

  // Navigate to annotation position except notes.
  if (type !== 'note' && props.item.value) {
    goToHref(props.item.value)
  }
}

function getIcon(item: Indexable) {
  if (item.type === 'annotation' && item.note) {
    return 'mdi-square-rounded-badge'
  } else {
    return getArrayItem(BookAnnotationTypes.value, item.type).icon
  }
}
</script>

<style lang="scss">
.o-book-annotation-item {
  padding: 8px 6px;
  min-height: 42px;

  &.active:before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    color: var(--q-primary) !important;
    background-color: var(--q-primary);
    opacity: 0.1;
  }

  &.active:after {
    content: "";
    width: 2px;
    position: absolute;
    right: 0;
    top: 10px;
    bottom: 10px;
    background-color: var(--q-primary);
  }

  &:hover, &.active {
    .time {
      visibility: visible;
    }

    .side {
      .q-btn {
        visibility: visible;
      }
      .page {
        display: none;
      }
    }
  }

  .time {
    visibility: hidden;
  }

  .side {
    padding-left: 0;
    min-width: 30px;

    .side-wrapper {
      position: relative;
      height: 30px;
    }

    .q-btn {
      position: absolute;
      right: 0;
      white-space: nowrap;
      visibility: hidden;
    }
    .page {
      white-space: nowrap;
      display: block;
      text-align: right;
    }
  }
}
</style>
