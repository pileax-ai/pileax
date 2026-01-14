import useApi from 'src/hooks/useApi'
import { userBookService, workspaceBookService, workspaceBookCollectionService } from 'src/api/service/remote'
import useCommon from 'core/hooks/useCommon'

export default function () {
  const { getBookUrl } = useApi()
  const { t, confirm } = useCommon()

  const downloadBook = (book: Indexable) => {
    const url = getBookUrl(book)
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.blob()
      })
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = book.title
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(blobUrl)
      })
      .catch(error => {
        console.error('Download error:', error)
      })
  }

  const updateBook = (data: Indexable) => {
    return workspaceBookService.update(data)
  }

  const updateUserBook = (data: Indexable) => {
    return userBookService.update(data)
  }

  const removeBook = (book: Indexable) => {
    return new Promise((resolve, reject) => {
      confirm(t('book.removeConfirm'), {
        label: book.title,
        onOk: () => {
          workspaceBookService.delete(book.id).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        },
        onCancel: () => {
          reject(new Error('Use cancelled'))
        }
      })
    })
  }

  const removeBookFromCollection = (data: Indexable) => {
    return new Promise((resolve, reject) => {
      confirm(t('book.collections.removeConfirm'), {
        label: data.title,
        onOk: () => {
          workspaceBookCollectionService.delete(data.tid).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        },
        onCancel: () => {
          reject(new Error('Use cancelled'))
        }
      })
    })
  }

  return {
    downloadBook,
    removeBook,
    updateBook,
    removeBookFromCollection,
    updateUserBook
  }
}
