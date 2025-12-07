import { useQuasar } from 'quasar';
import useApi from 'src/hooks/useApi';
import { workspaceBookService, workspaceBookCollectionService } from 'src/api/service/remote'

export default function () {
  const $q = useQuasar();
  const { getBookUrl } = useApi();

  const downloadBook = (book: Indexable) => {
    const url = getBookUrl(book);
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = book.title;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);
      })
      .catch(error => {
        console.error('Download error:', error);
      });
  }

  const updateBook = (data: Indexable) => {
    return workspaceBookService.update(data)
  }

  const removeBook = (book: Indexable) => {
    return new Promise((resolve, reject) => {
      $q.dialog({
        title: '确认',
        message: '你确定从书架中移除吗？',
        cancel: true
      }).onOk( () => {
        workspaceBookService.delete(book.id).then(res => {
          console.log('remove', res)
          resolve(res)
        }).catch(err => {
          reject(err)
        });
      }).onCancel(() => {
        reject(new Error('Use cancelled'))
      })
    })
  }

  const removeBookFromCollection = (tid: string) => {
    return new Promise((resolve, reject) => {
      $q.dialog({
        title: '确认',
        message: '你确定从书单中移除吗？',
        cancel: true
      }).onOk( () => {
        workspaceBookCollectionService.delete(tid).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        });
      }).onCancel(() => {
        reject(new Error('Use cancelled'))
      })
    })
  }

  return {
    downloadBook,
    removeBook,
    updateBook,
    removeBookFromCollection,
  }
}
