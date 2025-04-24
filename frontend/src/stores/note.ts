import { defineStore } from 'pinia';
import { store } from 'stores/index';
import { CODE } from 'core/app';
import { Note } from 'src/types/note';

export const useNoteStore = defineStore('note', {
  state: () => ({
    currentNote: {} as Note,
    notes: [] as Note[],
    favoriteTop: true,
  }),
  getters: {
    noteId: (state) => state.currentNote.id,
  },
  actions: {
    setCurrentNote(note: Note) {
      this.currentNote = note;
    },
    setNotes(notes: Note[]) {
      this.notes = notes;
    },
    setFavoriteTop(value: boolean) {
      this.favoriteTop = value;
    },
  },
  persist: {
    key: `${CODE}.note`
  }
});

export const useNoteStoreWithOut = () => {
  return useNoteStore(store);
}
