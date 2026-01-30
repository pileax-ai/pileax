import { computed, onDeactivated, ref, shallowRef, watch } from 'vue'
import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'

import useNote from 'src/hooks/useNote'
import { getCollabToken } from 'src/utils/auth'
import { NoteDefaultIcon } from 'core/constants/constant'
import { timeDiff } from 'core/utils/dayjs'
import { noteVersionService } from 'src/api/service/remote/note-version'
import { base64ToUint8Array, uint8ArrayToBase64 } from 'core/utils/format'
import { debounce, throttle } from 'quasar'

export default function () {
  const { currentNote, saveNote, setCurrentNote } = useNote()
  const metaKeys = ['icon', 'cover', 'title']

  const noteId = ref('')
  const ydocId = ref('')
  const ydocLoaded = ref(false)
  const ydoc = shallowRef<Y.Doc | null>(null)
  const hpProvider = shallowRef<HocuspocusProvider | null>(null)
  const collabReady = ref(false)
  const collaboration = ref(false)
  const localUpdate = ref(false)

  // version
  const lastVersionTime = ref('')

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
      // console.log(`isLocal: ${isLocal}, isFirstLoad: ${isFirstLoad}, event: `, event.keysChanged)

      // Ignore when first load
      if (isFirstLoad) {
        isFirstLoad = false
        return
      }

      for (const key of metaKeys) {
        if (event.keysChanged.has(key)) {
          const newValue = metaMap.get(key) ?? ''
          // console.log('meta changed', key, newValue)
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
    const doc = new Y.Doc()
    doc.on('update', onYdocUpdate)

    const provider = new HocuspocusProvider({
      url: window.APP_CONFIG?.WS_URL || process.env.WS_URL || 'ws://localhost:9611',
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
      ydoc.value.off('update', onYdocUpdate)
      ydoc.value.destroy()
      ydoc.value = null
    }

    // version
    ydocLoaded.value = false
    localUpdate.value = false
    lastVersionTime.value = ''
  }

  const onYdocUpdate = (update: Uint8Array, origin: any, doc: Y.Doc, tr: Y.Transaction) => {
    // Ignore metadata of title
    if (tr.origin === 'metadata-set-title') return

    localUpdate.value = tr.local

    if (ydocLoaded.value) {
      throttleUpdateTime()
    }
    ydocLoaded.value = true

    if (tr.local) {
      debounceCreateVersion()
    }
  }

  const updateTime = () => {
    setCurrentNote({
      ...currentNote.value,
      updateTime: new Date().toISOString()
    }, true, false)
  }
  const throttleUpdateTime = throttle(updateTime, 5000)

  const setMeta = (key: string, value: string) => {
    if (!metaKeys.includes(key)) return

    if (collaboration.value) {
      ydoc.value?.transact(() => {
        ydoc.value?.getMap('metadata').set(key, value)
      }, `metadata-set-${key}`)
    } else {
      saveNote({
        id: currentNote.value.id,
        [key]: value
      })
    }
  }
  const debounceSetMeta = debounce(setMeta, 1000)

  const createVersion = () => {
    if (!lastVersionTime.value) {
      lastVersionTime.value = currentNote.value.updateTime || ''
      return
    }

    // Save a new version every 3/10 minutes
    const  timeDelta = timeDiff(lastVersionTime.value, currentNote.value.updateTime, 'second')
    console.log('version time', timeDelta)
    if (lastVersionTime.value && timeDelta < 3 * 60) return

    // update time
    lastVersionTime.value = currentNote.value.updateTime || ''

    // save version
    if (ydoc.value) {
      const updateBinary = Y.encodeStateAsUpdate(ydoc.value)
      noteVersionService.save({
        noteId: currentNote.value.id,
        title: currentNote.value.title,
        icon: currentNote.value.icon,
        cover: currentNote.value.cover,
        styles: currentNote.value.styles,
        doc: uint8ArrayToBase64(updateBinary),
        type: 'update'
      })
    }
  }
  const debounceCreateVersion = debounce(createVersion, 1000)

  const restoreVersion = (version: Indexable, schema: any) => {
    if (ydoc.value) {
      const updateBinary = base64ToUint8Array(version.doc)
      const historyDoc = new Y.Doc()
      Y.applyUpdate(historyDoc, updateBinary)

      const historyFragment = historyDoc.getXmlFragment('default')

      ydoc.value.transact(() => {
        const currentFragment = ydoc.value!.getXmlFragment('default')
        if (currentFragment.length > 0) {
          currentFragment.delete(0, currentFragment.length)
        }

        const nodes = historyFragment.toArray().map(node => node.clone())
        currentFragment.insert(0, nodes as any)
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

  const setTitle = (title?: any ) => {
    setMeta('title', title || '')
  }

  onDeactivated(() => {
    resetCollab()
  })

  return {
    noteId,
    collab,
    initCollab,
    restoreVersion,
    addIcon,
    updateIcon,
    setCover,
    setTitle,
    throttleUpdateTime,
  }
}
