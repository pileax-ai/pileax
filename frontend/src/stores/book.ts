import { defineStore } from 'pinia';
import { store } from 'stores/index';
import { CODE } from 'core/app';
import { BookOperation, BookTocItem, ReadingMode } from 'src/types/reading';

export const useBookStore = defineStore('book', {
  state: () => ({
    bookId: '',
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
    search: {
      term: '',
      progress: 0,
      result: [] as Indexable[],
      current: {} as Indexable
    } as Indexable,
  }),
  getters: {
    getToc: (state) => state.toc,
  },
  actions: {
    setBookId(value: string) {
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
    startSearch(value: string) {
      this.search = {
        term: value,
        progress: 0,
        result: []
      };
    },
    clearSearch() {
      this.search = {
        term: '',
        progress: 0,
        result: [] as Indexable[]
      };
    },
    setSearchItem(key: string, value: any) {
      this.search[key] = value;
    },
    setSearchResult(value: Indexable) {
      this.search.result.push(value);
    },
    goResult(result: Indexable) {
      window.ebook.goToHref(result.item.cfi);
      this.setSearchItem('current', result);
    },
    nextResult() {
      const current = this.search.current;
      const { item, itemIndex, top, topIndex } = current;
      if (top?.subitems) {
        if (itemIndex < (top.subitems.length - 1)) {
          const newItemIndex = itemIndex + 1;
          const newItem = top.subitems[newItemIndex];
          this.goResult({
            ...current,
            item: newItem,
            itemIndex: newItemIndex
          });
          return;
        }
        if (topIndex < (this.search.result.length - 1)) {
          const newTopIndex = topIndex + 1;
          const newTop = this.search.result[newTopIndex];
          const newItemIndex = 0;
          const newItem = newTop.subitems[newItemIndex];
          this.goResult({
            top: newTop,
            topIndex: newTopIndex,
            item: newItem,
            itemIndex: newItemIndex
          });
          return;
        }
      }
    },
    previousResult() {
      const current = this.search.current;
      const { item, itemIndex, top, topIndex } = current;
      if (top?.subitems) {
        if (itemIndex > 0) {
          const newItemIndex = itemIndex - 1;
          const newItem = top.subitems[newItemIndex];
          this.goResult({
            ...current,
            item: newItem,
            itemIndex: newItemIndex
          });
          return;
        }
        if (topIndex > 0) {
          const newTopIndex = topIndex - 1;
          const newTop = this.search.result[newTopIndex];
          const newItemIndex = newTop.subitems.length - 1;
          const newItem = newTop.subitems[newItemIndex];
          this.goResult({
            top: newTop,
            topIndex: newTopIndex,
            item: newItem,
            itemIndex: newItemIndex
          });
          return;
        }
      }
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
