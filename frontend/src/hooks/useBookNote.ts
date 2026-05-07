
import { useBookStoreWithOut } from 'stores/book'
import { computed } from 'vue'
import { bookAnnotationService } from 'src/api/service/remote'
import { debounce } from 'quasar'

export default function () {
  const store = useBookStoreWithOut()

  const bookId = computed(() => {
    return store.bookId
  })

  const annotations = computed(() => {
    return store.annotations
  })

  const annotationTimer = computed(() => {
    return store.annotationTimer
  })

  const note = computed(() => {
    return store.note
  })

  const noteId = computed(() => {
    return store.noteId
  })

  function initAnnotationData(type = '', sort: Indexable = { update_time: 'asc' }) {
    const body = {
      pageIndex: 1,
      pageSize: 10000,
      condition: {
        bookId: bookId.value,
        type
      },
      sort
    }
    bookAnnotationService.query(body).then(res => {
      store.setAnnotations(res.list)
    })
  }

  function openNote(id: string) {
    store.setNoteId(id)
  }

  function setCurrentNote(note: Indexable | null, refresh = true) {
    if (!note) return

    // update current note
    store.setNote(note)

    // refresh
    if (refresh) {
      refreshNote(note)
    }
  }

  function refreshNote(data: Indexable) {
    // console.log('refreshNote', note, publish)
    const index = annotations.value.findIndex((n) => n.id === data.id)
    if (index >= 0) {
      annotations.value.splice(index, 1, data)
    } else {
      initAnnotationData()
    }

    if (data.id === note.value.id) {
      setCurrentNote(data, false)
    }
  }

  function saveNoteRemote(data: Indexable): Promise<Indexable> {
    return new Promise((resolve, reject) => {
      bookAnnotationService.save(data).then(res => {
        refreshNote(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }

  const debounceSaveNoteRemote = debounce(saveNoteRemote, 800)

  function saveNote(data: Indexable, debounce = false) {
    refreshNote({
      ...note.value,
      ...data,
    })
    if (debounce) {
      debounceSaveNoteRemote(data)
    } else {
      saveNoteRemote(data)
    }
  }

  function deleteNote(id: string) {
    return new Promise((resolve, reject) => {
      bookAnnotationService.delete(id).then(res => {
        resolve(res)

        const index = annotations.value.findIndex((n) => n.id === id)
        if (index >= 0) {
          annotations.value.splice(index, 1)
        }
      }).catch(err => {
        reject(err)
      })
    })
  }

  return {
    store,
    bookId,
    annotations,
    annotationTimer,
    note,
    noteId,

    initAnnotationData,
    openNote,
    setCurrentNote,
    saveNoteRemote,
    saveNote,
    deleteNote,
  }
}
