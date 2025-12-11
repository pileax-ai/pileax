import { useQuasar } from 'quasar';
import { bookAnnotationService } from 'src/api/service/remote'

export default function () {
  const $q = useQuasar();

  const removeBookAnnotation = (bookAnnotation: Indexable) => {
    return new Promise((resolve, reject) => {
      $q.dialog({
        title: '确认',
        message: '你确定从删除书摘吗？',
        cancel: true
      }).onOk( () => {
        bookAnnotationService.delete(bookAnnotation.id).then(res => {
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
    removeBookAnnotation,
  }
}
