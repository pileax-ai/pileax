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

const { downloadBook, removeBook, updateUserBook } = useBookDetails()
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
      value: 'collection',
      icon: 'icon-reading-list',
      separator: true
    },
    {
      label: 'Download',
      value: 'download',
      icon: 'download',
      separator: true
    },
    {
      label: 'Edit',
      value: 'edit',
      icon: 'edit_note',
      hidden: props.data.userId !== props.data.owner,
      separator: true
    },
    {
      label: 'Remove',
      value: 'remove',
      icon: 'delete',
      class: 'text-red',
    },
  ]
})


function onAction (action :any) {
  switch (action.value) {
    case 'collection':
      onAddCollection()
      break
    case 'download':
      downloadBook(props.data)
      break
    case 'edit':
      emit('edit', props.data)
      break
    case 'remove':
      onRemoveBook()
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
  updateUserBook({
    id: props.data.userBookId,
    readingStatus: status
  }).then(res => {
    notifyDone()
  })
}

function onRemoveBook() {
  removeBook(props.data).then(res => {
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
