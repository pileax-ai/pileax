
import { useComponentStoreWithOut } from 'src/stores/component';
import { computed } from 'vue';

const componentStore = useComponentStoreWithOut();

export default function () {
  const dialog = computed(() => componentStore.dialog);

  function openDialog(dialog: Indexable) {
    componentStore.setDialog(dialog);
  }

  function openNoteSearchDialog() {
    openDialog({
      type: 'note-search'
    });
  }

  function openSettingsDialog() {
    openDialog({
      type: 'settings'
    });
  }

  function onHide() {
    componentStore.setDialog({});
  }

  function onOk() {
    if (typeof dialog.value.onOk === 'function') {
      dialog.value.onOk();
    }
    onHide();
  }

  return {
    dialog,

    openDialog,
    openNoteSearchDialog,
    openSettingsDialog,
    onHide,
    onOk
  };
}
