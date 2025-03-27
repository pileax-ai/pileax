import { defineStore } from 'pinia';
import { store } from 'stores/index';
import { CODE } from 'core/app';
import { BookTocItem } from 'src/types/book';

export const useBookStore = defineStore('book', {
  state: () => ({
    bookId: 0,
    book: {},
    toc: [] as BookTocItem[],
    tocItem: {} as BookTocItem,
    progress: {},
    selection: {},
    keyword: '',
    annotationId: 0,
    annotationTimer: 0,
  }),
  getters: {
    getToc: (state) => state.toc,
  },
  actions: {
    setBookId(value: number) {
      this.bookId = value;
    },
    setBook(value: any) {
      this.book = value;
    },
    setTocItem(item: BookTocItem) {
      this.tocItem = item;
    },
    setToc(toc: BookTocItem[]) {
      this.toc = toc;
    },
    setProgress(progress: any) {
      this.progress = progress;
      if (progress.tocItem) {
        this.setTocItem(progress.tocItem);
      }
    },
    setSelection(selection: any) {
      this.selection = selection;
    },
    setKeyword(keyword: string) {
      this.keyword = keyword;
    },
    setAnnotationTimer(value: number) {
      this.annotationTimer = value;
    },
    setAnnotationId(value: number) {
      this.annotationId = value;
    },
  },
  persist: {
    key: `${CODE}.book`
  }
});

export const useBookStoreWithOut = () => {
  return useBookStore(store);
}
