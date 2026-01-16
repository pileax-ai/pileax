import { ref } from 'vue'
import useCommon from 'core/hooks/useCommon'
import { DELETE, POST, PUT } from 'src/hooks/useRequest'
import { notifyDone } from 'core/utils/control'
import OBadge from 'core/components/misc/OBadge.vue'

export default function () {
  const apiName = ref('')
  const loading = ref(false)


  const { t, confirm, dialog } = useCommon()

  function init(api: string) {
    apiName.value = api
  }

  function save(body: Indexable, callback: (res: any) => any) {
    loading.value = true
    if (body.id) {
      PUT({name: apiName.value, body: body}).then(res => {
        postSave(res as Indexable, callback)
      }).catch(() => {
        loading.value = false
      })
    } else {
      delete body.id
      POST({name: apiName.value, body: body}).then(res => {
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

  function remove(id: string, {
    icon = '',
    label = '',
    notify = true,
    callback = (res: any) => {} } = {}
  ) {
    confirm(t('deleteConfirm'),  {
      badge: 'o_delete',
      icon: icon,
      label: label,
      onOk: () => {
        doDelete(id, notify, callback)
      },
    })
  }

  function doDelete(id: string, notify = true, callback: (res: any) => any) {
    DELETE({name: apiName.value, query: {id: id}}).then(data => {
      if (notify) notifyDone()
      if (typeof callback === 'function') {
        callback(data)
      }
    })
  }

  const crud = {
    init,
    save,
    remove
  }

  return {
    loading,
    crud
  }
}
