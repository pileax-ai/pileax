
import { useBookStoreWithOut } from 'stores/book';
import { computed } from 'vue';
import { BookOperation, BookTocItem } from 'src/types/reading'

export default function () {
  const store = useBookStoreWithOut();

  const toc = computed(() => {
    return store.toc;
  });
  const book = computed(() => {
    return store.book;
  });
  const bookId = computed(() => {
    return store.bookId;
  });
  const tocItem = computed(() => {
    return store.tocItem;
  });
  const progress = computed(() => {
    return store.progress;
  });
  const selection = computed(() => {
    return store.selection;
  });
  const keyword = computed(() => {
    return store.keyword;
  });
  const annotationTimer = computed(() => {
    return store.annotationTimer;
  });
  const operation = computed(() => {
    return store.operation;
  });
  const readingMode = computed(() => {
    return store.readingMode;
  });

  function setBook(value: any) {
    store.setBook(value);
  }

  function setBookId(value: number) {
    store.setBookId(value);
  }

  function setTocItem(item :BookTocItem) {
    store.setTocItem(item);
  }

  function setKeyword(keyword :string) {
    store.setKeyword(keyword);
  }

  function setProgress(data :any) {
    store.setProgress(data);
  }

  function setSelection(data :any) {
    store.setSelection(data);
  }

  function setToc(data :any) {
    store.setToc(data);
  }

  function setAnnotationTimer(value: number) {
    store.setAnnotationTimer(value);
  }

  function setAnnotationId(value: number) {
    store.setAnnotationId(value);
  }

  function setOperation(value: BookOperation) {
    store.setOperation(value);
  }


  return {
    store,
    book,
    bookId,
    progress,
    selection,
    toc,
    tocItem,
    keyword,
    annotationTimer,
    operation,
    readingMode,

    setBook,
    setBookId,
    setTocItem,
    setKeyword,
    setProgress,
    setSelection,
    setToc,
    setAnnotationTimer,
    setAnnotationId,
    setOperation,
  };
}
