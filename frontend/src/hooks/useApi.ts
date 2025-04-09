
import { useApiStore } from 'stores/api';
import { computed } from 'vue'

export default function() {
  const apiStore = useApiStore();

  const appBase = computed(() => {
    return apiStore.appBase;
  })

  function getBookUrl(book: Indexable) {
    return `${appBase.value}/files/book/${book.path}/${book.fileName}`;
  }

  function getBookByPath(filePath: string) {
    return `${appBase.value}/files/book/${filePath}`;
  }

  function getCoverUrl(book: Indexable) {
    return `${appBase.value}/files/book/${book.path}/${book.coverName}`;
  }

  return {
    appBase,

    getBookUrl,
    getBookByPath,
    getCoverUrl
  }
}
