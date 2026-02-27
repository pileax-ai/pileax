import { computed } from 'vue'
import { useComponentStoreWithOut } from 'src/stores/component'

const componentStore = useComponentStoreWithOut()

export default function () {
  const dialog = computed(() => componentStore.dialog)
  const dialogType = computed(() => componentStore.dialog.type)

  function openDialog(dialog: Indexable) {
    componentStore.setDialog(dialog)
  }

  function openNoteSearchDialog() {
    openDialog({ type: 'note-search' })
  }

  function openSettingsDialog(tab = 'general') {
    openDialog({ type: 'settings', tab: tab })
  }

  function onHide() {
    if (typeof dialog.value.onCancel === 'function') {
      dialog.value.onCancel()
    }
    componentStore.setDialog({})
  }

  function onOk(options?: Indexable) {
    if (typeof dialog.value.onOk === 'function') {
      dialog.value.onOk(options)
    }
    componentStore.setDialog({})
  }

  return {
    dialog,
    dialogType,

    openDialog,
    openNoteSearchDialog,
    openSettingsDialog,
    onHide,
    onOk
  }
}
