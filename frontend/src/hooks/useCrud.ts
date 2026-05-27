import { ref } from 'vue'
import useCommon from 'core/hooks/useCommon'
import { DELETE, POST, PUT } from 'src/hooks/useRequest'
import { notifyDone } from 'core/utils/control'

export default function () {
  const loading = ref(false)

  const { t, confirm } = useCommon()

  function save(apiName: string, body: Indexable, callback: (res: any) => any) {
    loading.value = true
    if (body.id) {
      PUT({name: apiName, body: body}).then(res => {
        postSave(res as Indexable, callback)
      }).catch(() => {
        loading.value = false
      })
    } else {
      delete body.id
      POST({name: apiName, body: body}).then(res => {
        postSave(res.data as Indexable, callback)
      }).catch(() => {
        loading.value = false
      })
    }
  }

  function postSave (data: Indexable, callback: (res: any) => any) {
    loading.value = false

    if (typeof callback === 'function') {
      callback(data)
    }
  }

  function remove(apiName: string, id: string, {
    icon = '',
    label = '',
    notify = true,
    onOk = (res: any) => {},
    onError = (err: any) => {}, } = {}
  ) {
    confirm(t('deleteConfirm'),  {
      badge: 'o_delete',
      icon: icon,
      label: label,
      onOk: () => {
        doDelete(apiName, id, notify, onOk, onError)
      },
    })
  }

  function doDelete(
    apiName: string,
    id: string,
    notify = true,
    onOk: (res: any) => any,
    onError: (err: any) => any
  ) {
    DELETE({name: apiName, query: {id: id}}).then(data => {
      if (notify) notifyDone()
      if (typeof onOk === 'function') {
        onOk(data)
      }
    }).catch(err => {
      if (typeof onError === 'function') {
        onError(err)
      }
    })
  }

  const crud = {
    save,
    remove
  }

  return {
    loading,
    crud
  }
}
