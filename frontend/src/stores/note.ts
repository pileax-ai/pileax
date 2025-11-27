import { defineStore } from 'pinia';
import { store } from 'stores/index';
import { CODE } from 'core/app';
import { Note } from 'src/types/note';
import { Chat } from 'src/types/chat'

export const useNoteStore = defineStore('note', {
  state: () => ({
    currentNote: {} as Note,
    notes: [] as Note[],
    favoriteTop: true,
    chatToNote: {} as Chat,
    chatWidth: 0,
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
    setChatToNote(value: Chat) {
      this.chatToNote = value;
    },
    setChatWidth(value: number) {
      this.chatWidth = value;
    },
  },
  persist: {
    key: `${CODE}.note`
  }
});

export const useNoteStoreWithOut = () => {
  return useNoteStore(store);
}
