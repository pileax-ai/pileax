import { computed, ref } from 'vue';
import { useNaviStore } from 'stores/navi';
import { useNoteStore } from 'stores/note';
import { Note } from 'src/types/note';
import { MenuItem } from 'core/types/menu';
import { UUID } from 'core/utils/crypto';
import { router } from 'src/router';
import { noteService } from 'src/api/service/remote/note';
import { useAccountStore } from 'stores/account';

export default function () {
  const naviStore = useNaviStore();
  const accountStore = useAccountStore();
  // const noteStore = useNoteStore();
  const recentNotes = ref<Note[]>([]);
  const noteTitle = ref('');
  const noteIcon = ref('');

  const noteStore = computed(() => {
    const currentWorkspaceId = accountStore.workspaceId;
    return useNoteStore(currentWorkspaceId);
  })

  const currentNote = computed(() => {
    return noteStore.value.currentNote;
  });

  const notes = computed(() => {
    return noteStore.value.notes;
  });

  const currentNoteId = computed(() => {
    return noteStore.value.noteId;
  });

  function setCurrentNote(note: Note | null) {
    if (!note) return;
    noteStore.value.setCurrentNote(note);
    refreshNote(note);

    if (note.title === noteTitle.value && note.icon === noteIcon.value) {
      return
    }
    noteTitle.value = note.title || '';
    noteIcon.value = note.icon || '';
    const menu = {
      id: note.id,
      name: note.title,
      path: `/note/${note.id}`,
      action: 1,
      meta: {
        type: 'note',
        icon: note.icon || '✍',
        iconClass: 'emoji'
      }
    } as MenuItem;
    naviStore.setCurrentMenu(menu);
  }

  async function getAllNotes() {
    const notes = await noteService.getAll();
    noteStore.value.setNotes(notes);
  }

  function refreshNote(note: Note) {
    const index = notes.value.findIndex((n) => n.id === note.id);
    if (index >= 0) {
      notes.value.splice(index, 1, note);
    } else {
      getAllNotes();
    }
  }

  async function getRecentNotes() {
    const query = {
      pageSize: 1000,
      sort: {
        update_time: 'desc'
      }
    }
    const res = await noteService.query(query) as Indexable;
    recentNotes.value = res.list as Note[]
  }

  function addNote(parent = '', source = '') {
    const id = UUID();
    const query = {} as Indexable;
    if (parent) query.parent = parent;
    if (source) query.source = source;

    router.push({
      name: 'note',
      params: { id },
      query
    });
  }

  function openNote (note: Indexable, source = '') {
    const id = note.id;
    if (id) {
      const query = {} as Indexable;
      if (source) query.source = source;
      router.push({
        name: 'note',
        params: { id },
        query
      });
    }
  }

  function deleteNote(note: Indexable) {
    // Remove from list
    const index = notes.value.findIndex((item) => item.id === note.id);
    if (index >= 0) {
      notes.value.splice(index, 1);
      console.log('delete note', index, notes.value);

      // todo: Route to note home page
    }

    // Remove from opened tabs
    naviStore.closeOpenedMenu({
      name: note.title,
      path: `/note/${note.id}`,
    } as MenuItem);

    // Remove from database
    noteService.delete(note.id);
  }

  async function saveNote(data: Indexable, {
    refresh = false
    } = {}
  ) {
    const note = await noteService.save(data);
    if (note.id === currentNote.value.id) {
      setCurrentNote(note);
    }
    if (refresh) {
      refreshNote(note);
    }
  }

  function addIcon() {
    const icons = ['✍', '🏞', '🎵', '📹', '🎨', '👨‍👨‍👦', '🚴‍️', '🐶', '🐬', '🌾', '🍀', '🌴', '🍋', '🌏', '🚅', '🔥', '🥏', '💵', '🛠', '📖', '📗'];
    const index = Math.floor(Math.random() * icons.length);
    const icon = icons[index];
    saveNote({
      id: currentNote.value.id,
      icon: icon
    });
  }

  function setIcon(option: Indexable) {
    saveNote({
      id: currentNote.value.id,
      icon: option.emoji
    });
  }

  function setParent(id: string, newParent: string) {
    saveNote({
      id: id,
      parent: newParent
    }, { refresh: true });
  }

  function toggleFavorite(data: Indexable) {
    saveNote({
      id: data.id,
      favorite: data.favorite === 1 ? 0 : 1
    }, { refresh: true });
  }

  function duplicateNote(data: Indexable) {
    saveNote({
      parent: data.parent,
      title: data.title,
      favorite: data.favorite,
      content: data.content,
      icon: data.icon,
      cover: data.cover,
      styles: data.styles,
    }, { refresh: true });
  }

  function buildNoteTree(items: Note[], id: string | null = null, addEmptyNode = false) {
    const list: any[] = items
      .filter(item => item['parent'] === id)
      .map((item) => {
        return {
          key: item.id,
          type: 'note',
          label: item.title,
          header: (item.parent) ? '' : 'root',
          parent: item.parent,
          data: item,
          allowDrop: true,
          children: buildNoteTree(items, item.id, addEmptyNode)
        };
      });
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
      });
    }
    return list;
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
        };
      });
    return list;
  }

  return {
    noteStore,
    noteService,
    notes,
    recentNotes,
    currentNoteId,
    currentNote,

    setCurrentNote,
    getAllNotes,
    refreshNote,
    getRecentNotes,
    buildNoteTree,
    buildFavoriteTree,
    addNote,
    openNote,
    deleteNote,
    saveNote,
    addIcon,
    setIcon,
    setParent,
    toggleFavorite,
    duplicateNote,
  };
}
