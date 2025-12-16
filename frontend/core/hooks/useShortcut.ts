import useDialog from 'core/hooks/useDialog'
import { getKeys } from 'core/utils/keyboard'

export default function () {
  const { openNoteSearchDialog, openSettingsDialog } = useDialog()

  const addKeyBindings = () => {
    window.addEventListener('keydown', onKeydown)
  }

  const removeKeyBindings = () => {
    window.removeEventListener('keydown', onKeydown)
  }

  const onKeydown = (event: KeyboardEvent) => {
    const keys = getKeys(event)
    // console.log('keys', keys);
    switch (keys) {
      case 'Ctrl+P':
      case 'Cmd+P':
        event.preventDefault()
        openNoteSearchDialog()
        break
      case 'Ctrl+G':
      case 'Cmd+G':
        event.preventDefault()
        openSettingsDialog()
        break
      default:
    }
  }

  const systemKeymap = () => {
    const isMac =
      typeof navigator !== 'undefined' &&
      /Mac|iPod|iPhone|iPad/.test(navigator.platform)
    return {
      mod: isMac ? '⌘' : 'Ctrl',
      alt: isMac ? '⌥' : 'Alt',
      shift: isMac ? '⇧' : 'Shift',
      ctrl: isMac ? '⌃' : 'Ctrl',
      meta: isMac ? '⌘' : 'Meta',
    }
  }

  const nativeShortcut = (shortcut: string) => {
    const keys = shortcut
      ?.split('+')
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean)
    if (!keys || !keys.length) return shortcut

    const map = systemKeymap()
    const converted = keys.map((k) => {
      return map[k as keyof typeof map] ?? k.toUpperCase()
    })

    return converted.join('+')
  }

  return {
    addKeyBindings,
    removeKeyBindings,
    systemKeymap,
    nativeShortcut,
  }
}
