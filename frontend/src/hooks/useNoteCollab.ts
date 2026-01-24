import { computed, onDeactivated, ref, shallowRef, watch } from 'vue'
import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'

import useNote from 'src/hooks/useNote'
import { getCollabToken } from 'src/utils/auth'
import { NoteDefaultIcon } from 'core/constants/constant'

export default function () {
  const { currentNote, saveNote, setCurrentNote } = useNote()
  const metaKeys = ['icon', 'cover', 'title']

  const noteId = ref('')
  const ydocId = ref('')
  const ydoc = shallowRef<Y.Doc | null>(null)
  const hpProvider = shallowRef<HocuspocusProvider | null>(null)
  const collabReady = ref(false)
  const collaboration = ref(true)
  const localUpdate = ref(false)

  const collab = ref({
    ydocId,
    ydoc,
    hpProvider,
    collabReady,
    collaboration,
  })

  let cleanMetaObserve: (() => void) | null = null
  const setupMetadataSync = (ydoc: Y.Doc) => {
    let isFirstLoad = true
    const metaMap: Y.Map<any> = ydoc.getMap('metadata')

    // 1. Callback
    const observer = (event: Y.YMapEvent<any>): void => {
      // Check if the change from local
      const isLocal = event.transaction.local
      // console.log(`isLocal: ${isLocal}, isFirstLoad: ${isFirstLoad}`)

      // Ignore when first load
      if (isFirstLoad) {
        isFirstLoad = false
        return
      }

      for (const key of metaKeys) {
        if (event.keysChanged.has(key)) {
          const newValue = metaMap.get(key) ?? ''
          console.log('meta changed', key, newValue)
          setCurrentNote({
            ...currentNote.value,
            [key]: newValue
          }, true, true)
        }
      }
    }

    // 2. Binding
    metaMap.observe(observer)

    // 3. Return a cleanup
    return () => {
      metaMap.unobserve(observer)
    }
  }

  const initCollab = async () => {
    if (!collaboration.value) return
    resetCollab()

    ydocId.value = `note@${noteId.value}`
    const doc = new Y.Doc({
      gc: false
    })
    doc.on('update', (update, origin, doc, tr) => {
      localUpdate.value = tr.local
    })
    const provider = new HocuspocusProvider({
      url: 'ws://localhost:9611',
      name: ydocId.value,
      document: doc,
      token: getCollabToken(),
      onConnect() {
        console.log('[Note] Hocuspocus connected')
        collabReady.value = true
      },
    })
    ydoc.value = doc
    hpProvider.value = provider

    cleanMetaObserve = setupMetadataSync(doc)
  }

  const resetCollab = () => {
    collabReady.value = false
    if (cleanMetaObserve) {
      cleanMetaObserve()
      cleanMetaObserve = null
    }

    if (hpProvider.value) {
      hpProvider.value.destroy()
      hpProvider.value = null
    }

    if (ydoc.value) {
      ydoc.value?.destroy()
      ydoc.value = null
    }
  }

  const setMeta = (key: string, value: string) => {
    if (!metaKeys.includes(key)) return

    if (collaboration.value) {
      ydoc.value?.transact(() => {
        ydoc.value?.getMap('metadata').set(key, value)
      })
    } else {
      saveNote({
        id: currentNote.value.id,
        [key]: value
      })
    }
  }

  /**
   * Add or update icon
   */
  const addIcon = () => {
    const icons = ['✍', '🏞', '🎵', '📹', '🎨', '👨‍👨‍👦', '🚴‍️', '🐶', '🐬', '🌾', '🍀', '🌴', '🍋', '🌏', '🚅', '🔥', '🥏', '💵', '🛠', '📖', '📗']
    const index = Math.floor(Math.random() * icons.length)
    const icon = icons[index] ?? NoteDefaultIcon
    setMeta('icon', icon)
  }

  const updateIcon = (option: Indexable) => {
    setMeta('icon', option.value)
  }

  /**
   * Set cover
   */
  const setCover = (cover = '') => {
    if (!cover) {
      const covers = [
        '/images/book/dark-bubble_nebula.jpg',
        '/images/book/dark-pillars_of_creation.jpg',
        '/images/book/light-old_book.png',
        '/images/book/light-willow_bank.jpg',
      ]
      const index = Math.floor(Math.random() * covers.length)
      cover = covers[index] ?? '/images/book/dark-bubble_nebula.jpg'
    }
    setMeta('cover', cover)
  }

  watch(() => currentNote.value.title, (newValue) => {
    if (collabReady.value && localUpdate.value) {
      console.log(`title: ${newValue}, id: ${currentNote.value.id}, isLocal: ${localUpdate.value}`)
      setMeta('title', newValue)
    }
  })

  onDeactivated(() => {
    resetCollab()
  })

  return {
    noteId,
    collab,
    initCollab,
    addIcon,
    updateIcon,
    setCover,
  }
}
