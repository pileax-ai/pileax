import { defineStore } from 'pinia';
import { store } from 'stores/index';
import { CODE } from 'core/app';
import { BookOperation, BookTocItem, ReadingMode } from 'src/types/reading'

export const useBookStore = defineStore('book', {
  state: () => ({
    bookId: 0,
    book: {} as Indexable,
    toc: [] as BookTocItem[],
    tocItem: {} as BookTocItem,
    progress: {} as Indexable,
    tempProgress: {} as Indexable,
    selection: {} as Indexable,
    keyword: '',
    annotationId: 0,
    annotationTimer: 0,
    operation: BookOperation.Preview,
    readingMode: ReadingMode.Read,
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
    setTempProgress(progress: any) {
      this.tempProgress = progress;
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
    setOperation(value: BookOperation) {
      this.operation = value;
    },
    setReadingMode(value: ReadingMode) {
      this.readingMode = value;
    },
  },
  persist: {
    key: `${CODE}.book`,
    storage: sessionStorage,
  }
});

export const useBookStoreWithOut = () => {
  return useBookStore(store);
}
