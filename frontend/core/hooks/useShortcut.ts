import useDialog from 'core/hooks/useDialog';
import { getKeys } from 'core/utils/keyboard';

export default function () {
  const { openNoteSearchDialog } = useDialog();

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
      default:
    }
  }

  return {
    addKeyBindings,
    removeKeyBindings
  };
}
