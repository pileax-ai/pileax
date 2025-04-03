import { defineStore } from 'pinia';
import { store } from 'stores/index';
import { CODE } from 'core/app';
import { Note } from 'src/types/note';
import { NoteService, RemoteNoteService } from 'src/service/note';

export const useNoteStore = defineStore('note', {
  state: () => ({
    currentNote: {} as Note,
    notes: [] as Note[],
    service: new RemoteNoteService() as NoteService,
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
    async getNotes(params: Indexable) {
      return await this.service.getNotes(params);
    },
    async getNote(id: string) {
      return await this.service.getNote(id);
    },
    async saveNote(note: Indexable) {
      return await this.service.saveNote(note);
    },
    async deleteNote(id: string) {
      return await this.service.deleteNote(id);
    }
  },
  persist: {
    key: `${CODE}.note`
  }
});

export const useNoteStoreWithOut = () => {
  return useNoteStore(store);
}
