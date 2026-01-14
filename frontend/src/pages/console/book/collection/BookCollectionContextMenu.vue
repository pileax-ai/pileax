<template>
  <o-context-menu :context-menu="contextMenu"
                  :list="actions"
                  @command="onAction">
  </o-context-menu>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import OContextMenu from 'core/components/menu/OContextMenu.vue'
import useBookDetails from 'src/hooks/useBookDetails'
import useDialog from 'core/hooks/useDialog'
import { notifyDone } from 'core/utils/control'

const props = defineProps({
  contextMenu: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    required: true
  },
})
const emit = defineEmits(['edit', 'close'])

const { downloadBook, removeBookFromCollection, updateBook } = useBookDetails()
const { openDialog } = useDialog()

const actions = computed(() => {
  return [
    {
      label: 'Add to Want to Read',
      value: 'status_want',
      icon: 'arrow_circle_right',
      hidden: (props.data.readingStatus !== 0 && props.data.readingStatus !== 3),
    },
    {
      label: 'Mark as Finished',
      value: 'status_finished',
      icon: 'check_circle',
      hidden: props.data.readingStatus === 3,
    },
    {
      label: 'Add to Collection',
      value: 'add_collection',
      icon: 'icon-reading-list',
      separator: true
    },
    {
      label: 'Remove from Collection',
      value: 'remove_collection',
      icon: 'delete',
      class: 'text-red',
    },
  ]
})


function onAction (action :any) {
  switch (action.value) {
    case 'add_collection':
      onAddCollection()
      break
    case 'remove_collection':
      onRemoveCollection()
      break
    case 'status_want':
      updateReadingStatus(1)
      break
    case 'status_finished':
      updateReadingStatus(3)
      break
    default:
      break
  }
}

function updateReadingStatus(status: number) {
  updateBook({
    id: props.data.id,
    readingStatus: status
  }).then(res => {
    notifyDone()
  })
}

function onRemoveCollection() {
  removeBookFromCollection(props.data).then(res => {
    emit('close', {
      action: 'remove',
      item: props.data
    })
  }).catch(err => {
    // console.error(err)
  })
}

function onAddCollection() {
  openDialog({
    type: 'book-collection',
    data: props.data
  })
}
</script>
