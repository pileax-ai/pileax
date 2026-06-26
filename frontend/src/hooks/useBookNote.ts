
import { useBookStoreWithOut } from 'stores/book'
import { computed } from 'vue'
import { bookAnnotationService } from 'src/api/service/remote'
import { debounce } from 'quasar'
import useReader from 'src/hooks/useReader'
import { removeAnnotation } from 'src/api/service/ebook/book-annotation'
import { isInside } from 'src/api/service/ebook/book'

export default function () {
  const store = useBookStoreWithOut()
  const { setRightDrawerView } = useReader()

  const book = computed(() => {
    return store.book
  })
  const bookId = computed(() => {
    return store.bookId
  })
  const isPhysical = computed(() => {
    const media = book.value.media as Indexable[]
    const physical = media?.find(item => item.type === 'physical')
    return !!physical && book.value.fileUrl === ''
  })

  const annotations = computed(() => {
    return store.annotations
  })

  const bookmarks = computed(() => {
    return store.annotations.filter(item => item.type === 'bookmark')
  })

  const notes = computed(() => {
    return store.annotations.filter(item => item.type === 'note')
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

  const pageBookmark = computed(() => {
    return store.currentPage.bookmark
  })

  const pageNote = computed(() => {
    return store.currentPage.note
  })

  function initAnnotationData(type = '', sort: Indexable = { update_time: 'asc' }) {
    const body = {
      pageIndex: 1,
      pageSize: 10000,
      condition: {
        bookId: bookId.value,
      },
      sort
    }
    bookAnnotationService.query(body).then(res => {
      store.setAnnotations(res.list)
      console.log('list', res.list)
    })
  }

  function openNote(id: string) {
    store.setNoteId(id)

    if (!isPhysical.value) {
      setRightDrawerView('note', true)
    }
  }

  function setCurrentNote(note: Indexable | null, refresh = true) {
    if (!note) return

    // update current note
    if (['annotation', 'note'].includes(note.type)) {
      store.setNote(note)
    }

    // refresh
    if (refresh) {
      refreshNote(note)
    }
  }

  function refreshNote(data: Indexable) {
    // console.log('refreshNote', note, publish)
    const idx = annotations.value.findIndex((n) => n.id === data.id)
    if (idx >= 0) {
      const oldData = annotations.value.at(idx)
      const newData = { ...oldData, ...data }
      annotations.value.splice(idx, 1, newData)
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

  function deleteNote(data: Indexable) {
    const id = data.id

    return new Promise((resolve, reject) => {
      removeAnnotation(data)
      bookAnnotationService.delete(id).then(res => {
        resolve(res)

        const index = annotations.value.findIndex((n) => n.id === id)
        if (index >= 0) {
          annotations.value.splice(index, 1)
        }

        if (id === noteId.value) {
          setRightDrawerView('note', false)
        }
        if (id === pageBookmark.value) {
          setPageBookmark('')
        }
        if (id === pageNote.value) {
          setPageNote('')
        }
      }).catch(err => {
        reject(err)
      })
    })
  }

  function setPageBookmark(value: string) {
    store.setCurrentPageItem('bookmark', value)
  }

  function setPageNote(value: string) {
    store.setCurrentPageItem('note', value)
  }

  function refreshPage(data: Indexable) {
    refreshPageBookmark(data)
    refreshPageNote(data)
  }

  function refreshPageBookmark(data: Indexable) {
    const rangeCfi = data.cfi

    if (rangeCfi) {
      for (const item of bookmarks.value) {
        if (isInside(item.value, rangeCfi)) {
          setPageBookmark(item.id)
          return
        }
      }
    }
    setPageBookmark('')
  }

  function refreshPageNote(data: Indexable) {
    const rangeCfi = data.cfi

    if (rangeCfi) {
      for (const item of notes.value) {
        if (isInside(item.value, rangeCfi)) {
          setPageNote(item.id)
          return
        }
      }
    }
    setPageNote('')
  }

  return {
    store,
    bookId,
    isPhysical,
    annotations,
    annotationTimer,
    bookmarks,
    notes,
    note,
    noteId,
    pageBookmark,
    pageNote,

    initAnnotationData,
    openNote,
    refreshNote,
    setCurrentNote,
    saveNoteRemote,
    saveNote,
    deleteNote,
    setPageBookmark,
    setPageNote,
    refreshPage,
  }
}
