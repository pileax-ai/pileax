import { computed, ref } from 'vue'
import { useWorkspaceStore } from 'src/stores/workspace'
import { useNaviStore } from 'stores/navi'
import { useNoteStore } from 'stores/note'
import { useTabStore } from 'stores/tab'
import type { Note } from 'src/types/note'
import type { MenuItem } from 'core/types/menu'
import { UUID } from 'core/utils/crypto'
import { router } from 'src/router'
import useCommon from 'core/hooks/useCommon'
import useApi from 'src/hooks/useApi'
import useWorkspaceCollab from 'src/hooks/useWorkspaceCollab'
import { noteService } from 'src/api/service/remote/note'
import { workspaceManager } from 'core/workspace/workspace-manager'
import { CollabEvent } from 'src/types/collab'
import { timeDiff } from 'core/utils/dayjs'
import { noteVersionService } from 'src/api/service/remote/note-version'
import { debounce } from 'quasar'
import axios from 'axios'

export default function () {
  const naviStore = useNaviStore()
  const workspaceStore = useWorkspaceStore()
  const tabStore = useTabStore()
  const { t, confirm, showDialog } = useCommon()
  const { publishCollabEvent } = useWorkspaceCollab()
  const { getFileUrl, openNewWindow } = useApi()
  const recentNotes = ref<Note[]>([])

  // version
  const lastVersionTime = ref('')

  const noteStore = computed(() => {
    const currentWorkspaceId = workspaceStore.workspaceId
    return useNoteStore(currentWorkspaceId)
  })

  const currentNote = computed(() => {
    return noteStore.value.currentNote
  })

  const currentNoteCover = computed(() => {
    const cover = currentNote.value.cover
    return cover?.startsWith('/image') ? cover : getFileUrl(cover!)
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
    try {
      const notes = await noteService.getAll()
      noteStore.value.setNotes(notes)
    } catch (err) {
      if (axios.isAxiosError(err) && err?.response?.status === 403) {
        noteStore.value.setNotes([])
      }
    }
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

  const debounceSaveNoteRemote = debounce(saveNoteRemote, 2500)

  function saveNote(data: Indexable, debounce = false) {
    refreshNote({
      ...currentNote.value,
      ...data,
    })

    if (debounce) {
      debounceSaveNoteRemote(data)
    } else {
      saveNoteRemote(data)
    }
    debounceCreateVersion()
  }

  function saveNoteMarkdownRemote(id: string, content: any, markdown?: string) {
    return new Promise((resolve, reject) => {
      noteService.save({
        id,
        content: content,
        contentMarkdown: markdown
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
  const saveNoteMarkdown = debounce(saveNoteMarkdownRemote, 2500)

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

  function shareNote(data: Indexable) {
    showDialog({
      type: 'note-share',
      data
    })
  }

  const createVersion = () => {
    if (!lastVersionTime.value) {
      lastVersionTime.value = currentNote.value.updateTime || ''
      return
    }

    // Save a new version every 1/10 minutes
    const  timeDelta = timeDiff(lastVersionTime.value, currentNote.value.updateTime, 'second')
    // console.log('version time', timeDelta)
    if (lastVersionTime.value && timeDelta < 60) return

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
    openNewWindow(note.id, `/note/${note.id}`)
  }

  function exportMarkdown(title: string, content: string) {
    const filename = `${title}.md`
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  return {
    noteStore,
    noteService,
    notes,
    recentNotes,
    currentNote,
    currentNoteCover,
    currentNoteId,

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
    shareNote,
    duplicateNote,
    newTab,
    newWindow,
    refreshNote,
    deleteNote,
    exportMarkdown,
  }
}
