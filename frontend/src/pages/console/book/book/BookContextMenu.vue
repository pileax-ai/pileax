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
import useCommon from 'core/hooks/useCommon'

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
const emit = defineEmits(['edit', 'close', 'upload'])

const { downloadBook, removeBook, deleteBook, updateUserBook } = useBookDetails()
const { t } = useCommon()
const { openDialog } = useDialog()

const actions = computed(() => {
  return [
    {
      label: t('book.addToWant'),
      value: 'status_want',
      icon: 'arrow_circle_right',
      hidden: (props.data.readingStatus !== 0 && props.data.readingStatus !== 3),
    },
    {
      label: t('book.markFinished'),
      value: 'status_finished',
      icon: 'check_circle',
      hidden: props.data.readingStatus === 3,
    },
    {
      label: t('book.addToCollection'),
      value: 'collection',
      icon: 'icon-reading-list',
      separator: true
    },
    {
      label: t('download'),
      value: 'download',
      icon: 'mdi-arrow-collapse-down',
      hidden: !props.data.fileUrl,
      separator: true
    },
    {
      label: t('upload'),
      value: 'upload',
      icon: 'mdi-arrow-collapse-up',
      hidden: props.data.fileUrl,
      separator: true
    },
    {
      label: t('edit'),
      value: 'edit',
      icon: 'edit_note',
      hidden: props.data.userId !== props.data.bookUserId,
      separator: true
    },
    {
      label: t('remove'),
      value: 'remove',
      icon: 'o_delete',
      class: 'text-orange',
    },
    {
      label: t('delete'),
      value: 'delete',
      icon: 'o_delete_forever',
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
    case 'upload':
      emit('upload', props.data)
      break
    case 'edit':
      emit('edit', props.data)
      break
    case 'remove':
      onRemoveBook()
      break
    case 'delete':
      onDeleteBook()
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

function onDeleteBook() {
  deleteBook(props.data).then(res => {
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
