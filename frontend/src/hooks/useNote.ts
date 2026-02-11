import { computed, ref } from 'vue'
import { useAccountStore } from 'stores/account'
import { useNaviStore } from 'stores/navi'
import { useNoteStore } from 'stores/note'
import { useTabStore } from 'stores/tab'
import type { Note } from 'src/types/note'
import type { MenuItem } from 'core/types/menu'
import { UUID } from 'core/utils/crypto'
import { router } from 'src/router'
import useCommon from 'core/hooks/useCommon'
import useWorkspaceCollab from 'src/hooks/useWorkspaceCollab'
import { ipcService } from 'src/api/ipc'
import { noteService } from 'src/api/service/remote/note'
import { workspaceManager } from 'core/workspace/workspace-manager'
import { CollabEvent } from 'src/types/collab'
import { timeDiff } from 'core/utils/dayjs'
import { noteVersionService } from 'src/api/service/remote/note-version'
import { debounce } from 'quasar'

export default function () {
  const naviStore = useNaviStore()
  const accountStore = useAccountStore()
  const tabStore = useTabStore()
  const { t, confirm } = useCommon()
  const { publishCollabEvent } = useWorkspaceCollab()
  const recentNotes = ref<Note[]>([])

  // version
  const lastVersionTime = ref('')

  const noteStore = computed(() => {
    const currentWorkspaceId = accountStore.workspaceId
    return useNoteStore(currentWorkspaceId)
  })

  const currentNote = computed(() => {
    return noteStore.value.currentNote
  })

  const notes = computed(() => {
    return noteStore.value.notes
  })

  const currentNoteId = computed(() => {
    return noteStore.value.noteId
  })

  function setCurrentNote(note: Note | null, refresh = true, publish = false) {
    // console.log('setCurrentNote', note)
    if (!note) return

    // update current note
    noteStore.value.setCurrentNote(note)

    // update menu/tab
    const menu = {
      id: note.id,
      name: note.title || 'New page',
      path: `/note/${note.id}`,
      action: 1,
      meta: {
        type: 'note',
        icon: note.icon || '✍',
        iconClass: 'emoji'
      }
    } as MenuItem
    naviStore.setCurrentMenu(menu)

    // refresh
    if (refresh) {
      refreshNote(note, publish)
    }
  }

  async function initNoteData() {
    const notes = await noteService.getAll()
    noteStore.value.setNotes(notes)
  }

  function refreshNote(note: Note, publish = true) {
    // console.log('refreshNote', note, publish)
    const index = notes.value.findIndex((n) => n.id === note.id)
    if (index >= 0) {
      notes.value.splice(index, 1, note)
    } else {
      initNoteData()
    }

    if (note.id === currentNote.value.id) {
      setCurrentNote(note, false)
    }

    if (publish) {
      publishCollabEvent(CollabEvent.NOTE_REFRESH, note)
    }
  }

  async function getRecentNotes(size = 1000) {
    const query = {
      pageSize: size,
      sort: {
        update_time: 'desc'
      }
    }
    const res = await noteService.query(query) as Indexable
    recentNotes.value = res.list as Note[]
  }

  function addNote(parent = '', source = '') {
    const id = UUID()
    const query = {} as Indexable
    if (parent) query.parent = parent
    if (source) query.source = source

    router.push({
      name: 'note',
      params: { id },
      query
    })
  }

  function saveNoteRemote(data: Indexable): Promise<Indexable> {
    return new Promise((resolve, reject) => {
      noteService.save(data).then(res => {
        refreshNote(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }

  const debounceSaveNoteRemote = debounce(saveNoteRemote, 500)

  function saveNote(data: Indexable, debounce = false) {
    refreshNote({
      ...currentNote.value,
      ...data,
    } as Note)

    if (debounce) {
      debounceSaveNoteRemote(data)
    } else {
      saveNoteRemote(data)
    }
    debounceCreateVersion()
  }

  function saveNoteMarkdownRemote(id: string, markdown?: string) {
    return new Promise((resolve, reject) => {
      noteService.save({
        id,
        contentMarkdown: markdown
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
  const saveNoteMarkdown = debounce(saveNoteMarkdownRemote, 5000)

  function duplicateNote(data: Indexable) {
    return new Promise((resolve, reject) => {
      noteService.duplicate(data.id).then(res => {
        refreshNote(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }

  function beforeDeleteNote(note: Indexable) {
    confirm(t('deleteConfirm'),
      {
        icon: note.icon,
        label: note.title,
        onOk: () => {
          deleteNote(note)
        }
      }
    )
  }

  async function deleteNote(note: Indexable, publish = true) {
    // Remove from list
    const index = notes.value.findIndex((item) => item.id === note.id)
    if (index >= 0) {
      notes.value.splice(index, 1)
      console.log('delete note', index, notes.value)

      // todo: Route to note home page
    }

    // Remove from opened tabs
    naviStore.closeOpenedMenu({
      name: note.title,
      path: `/note/${note.id}`,
    } as MenuItem)

    if (publish) {
      // Remove from database
      await noteService.delete(note.id)

      // publish
      publishCollabEvent(CollabEvent.NOTE_DELETE, note)
    }
  }

  function setParent(id: string, newParent: string) {
    saveNote({
      id: id,
      parent: newParent
    })
  }

  function toggleFavorite(data: Indexable) {
    saveNote({
      id: data.id,
      favorite: data.favorite === 1 ? 0 : 1
    })
  }

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
    noteVersionService.save({
      noteId: currentNote.value.id,
      title: currentNote.value.title,
      icon: currentNote.value.icon,
      cover: currentNote.value.cover,
      styles: currentNote.value.styles,
      content: currentNote.value.content,
      type: 'full'
    })
  }
  const debounceCreateVersion = debounce(createVersion, 5000)

  function buildNoteTree(items: Note[], id: string | null = null, addEmptyNode = false) {
    const list: any[] = items
      .filter(item => item['parent'] === id)
      .map((item) => {
        return {
          key: item.id,
          type: 'note',
          label: item.title || 'New page',
          header: (item.parent) ? '' : 'root',
          parent: item.parent,
          data: item,
          allowDrop: true,
          children: buildNoteTree(items, item.id, addEmptyNode)
        }
      })
    if (list.length == 0 && addEmptyNode) {
      list.push({
        key: UUID(),
        type: 'action',
        label: 'No page inside',
        header: 'root',
        parent: id,
        data: {},
        allowDrop: false,
        children: []
      })
    }
    return list
  }

  function buildFavoriteTree(items: Note[], addEmptyNode = false) {
    const list: any[] = items
      .filter(item => item.favorite === 1)
      .map((item) => {
        return {
          key: item.id,
          type: 'note',
          label: item.title,
          header: (item.parent) ? '' : 'root',
          parent: item.parent,
          data: item,
          allowDrop: true,
          children: buildNoteTree(items, item.id)
        }
      })
    return list
  }

  function openNote(note: Indexable, source = '') {
    const id = note.id
    if (id) {
      const query = {} as Indexable
      if (source) query.source = source
      router.push({
        name: 'note',
        params: { id },
        query
      })
    }
  }

  function newTab(note: Indexable) {
    tabStore.newTab({
      id: note.id,
      name: note.title,
      path: `/note/${note.id}`,
      workspaceId: workspaceManager.getCurrentWorkspaceId(),
      meta: {
        type: 'note',
        icon: note.icon || '✍',
        iconClass: 'emoji'
      }
    })
  }

  function newWindow(note: Indexable) {
    ipcService.openNewWindow(note.id, `/note/${note.id}`)
  }

  return {
    noteStore,
    noteService,
    notes,
    recentNotes,
    currentNoteId,
    currentNote,

    setCurrentNote,
    initNoteData,
    getRecentNotes,
    buildNoteTree,
    buildFavoriteTree,
    addNote,
    openNote,
    beforeDeleteNote,
    saveNote,
    saveNoteRemote,
    saveNoteMarkdown,
    setParent,
    toggleFavorite,
    duplicateNote,
    newTab,
    newWindow,
    refreshNote,
    deleteNote,
  }
}
