import { computed, ref } from 'vue';
import { useNaviStore } from 'stores/navi.setup';
import { useNoteStore } from 'stores/note';
import { Note } from 'src/types/note';
import { MenuItem } from 'core/types/menu';
import { UUID } from 'core/utils/crypto';
import { router } from 'src/router';

export default function () {
  const naviStore = useNaviStore();
  const noteStore = useNoteStore();
  const recentNotes = ref<Note[]>([]);

  const noteService = computed(() => {
    return noteStore.service;
  });

  const currentNote = computed(() => {
    return noteStore.currentNote;
  });

  const notes = computed(() => {
    return noteStore.notes;
  });

  const currentNoteId = computed(() => {
    return noteStore.noteId;
  });

  function setCurrentNote(note: Note | null) {
    if (!note) return;
    noteStore.setCurrentNote(note);
    const menu = {
      id: note.id,
      name: note.title,
      path: `/note/${note.id}`,
      action: 1,
      meta: {
        type: 'note',
        icon: note.icon,
        iconClass: 'emoji'
      }
    } as MenuItem;
    naviStore.setCurrentMenu(menu);
    // naviStore.openTab(menu);
  }

  async function getAllNotes() {
    const notes = await noteService.value.getNotes({});
    noteStore.setNotes(notes);
  }

  function refreshAllNotes() {
    const index = notes.value.findIndex((item) => item.id === currentNote.value.id);
    if (index >= 0) {
      notes.value.splice(index, 1, currentNote.value);
    } else {
      getAllNotes();
    }
  }

  async function getRecentNotes() {
    const result = await noteService.value.queryNote({}) as Note[];
    recentNotes.value = result;
  }

  function addNote(parent = '') {
    const id = UUID();
    router.push({name: 'note', params: {id}, query: {parent}});
  }

  function openNote (note: Indexable) {
    const id = note.id;
    if (id) {
      router.push({name: 'note', params: {id}});
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
    noteService.value.deleteNote(note.id);
  }

  async function saveNote(data: Indexable) {
    const note = await noteService.value.saveNote(data);
    setCurrentNote(note);
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

  function buildNoteTree(items: Note[], id = '') {
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
          children: buildNoteTree(items, item.id)
        };
      });
    if (list.length == 0) {
      list.push({
        key: UUID(),
        type: 'action',
        label: 'No page inside',
        header: 'root',
        parent: id,
        data: {},
        children: []
      });
    }
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
    refreshAllNotes,
    getRecentNotes,
    buildNoteTree,
    addNote,
    openNote,
    deleteNote,
    saveNote,
    addIcon,
    setIcon,
  };
}
