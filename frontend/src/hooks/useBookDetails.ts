import useApi from 'src/hooks/useApi'
import { userBookService, workspaceBookService, workspaceBookCollectionService } from 'src/api/service/remote'
import useCommon from 'core/hooks/useCommon'
import useAccount from 'src/hooks/useAccount'

export default function () {
  const { getBookUrl } = useApi()
  const { account, workspace, workspaces } = useAccount()
  const { t, confirm } = useCommon()

  const bookTags = (book: Indexable) => {
    const tags = []
    const bookOwner = book.bookUserId || book.userId
    const bookWorkspaceId = book.bookWorkspaceId || book.workspaceId
    const bookWorkspace = workspaces.value.find(i => i.id === bookWorkspaceId)
    const teamTag = {
      label: bookWorkspace?.name || t('workspace.types.team'),
      value: 'team',
      color: 'purple'
    }
    if (account.value.id === bookOwner) {
      tags.push({
        label: t('workspace.types.personal'),
        value: 'own',
        color: 'blue',
      })
      if (workspace.value.id !== bookWorkspaceId) {
        tags.push(teamTag)
      }
    } else {
      tags.push(teamTag)
    }
    return tags
  }

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
        a.download = `${book.title}.${book.extension}`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(blobUrl)
      })
      .catch(error => {
        console.error('Download error:', error)
      })
  }

  const downloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const fileName = `image-${Math.floor(Date.now() / 1000)}`
      const link = document.createElement('a')
      link.href = url
      link.download = fileName

      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      window.open(imageUrl, '_blank')
    }
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

  const deleteBook = (book: Indexable) => {
    return new Promise((resolve, reject) => {
      confirm(t('book.deleteConfirm'), {
        label: book.title,
        onOk: () => {
          workspaceBookService.deletePermanent(book.id).then(res => {
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
    bookTags,
    downloadBook,
    downloadImage,
    removeBook,
    deleteBook,
    updateBook,
    removeBookFromCollection,
    updateUserBook
  }
}
