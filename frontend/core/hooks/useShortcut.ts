import useDialog from 'core/hooks/useDialog';
import { getKeys } from 'core/utils/keyboard';

export default function () {
  const { openNoteSearchDialog, openSettingsDialog } = useDialog();

  function addKeyBindings() {
    window.addEventListener('keydown', onKeydown);
  }

  function removeKeyBindings() {
    window.removeEventListener('keydown', onKeydown);
  }

  function onKeydown (event: KeyboardEvent) {
    const keys = getKeys(event);
    // console.log('keys', keys);
    switch (keys) {
      case 'Ctrl+P':
      case 'Cmd+P':
        event.preventDefault();
        openNoteSearchDialog();
        break;
      case 'Ctrl+G':
      case 'Cmd+G':
        event.preventDefault();
        openSettingsDialog();
        break;
      default:
    }
  }

  return {
    addKeyBindings,
    removeKeyBindings
  };
}
