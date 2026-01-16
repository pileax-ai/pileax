import { Platform, Dialog, copyToClipboard } from 'quasar'
import { useI18n } from 'vue-i18n'
import { notifySuccess } from 'core/utils/control'
import { useComponentStoreWithOut } from 'stores/component'
import { ipcProvider, ipcService } from 'src/api/ipc'
import OBadge from 'core/components/misc/OBadge.vue'

export const isMobile = Platform.is.mobile
export const getArrayItem = (array :Indexable[], value :string, field = '') => {
  field = field || 'value'
  for (const item of array) {
    if (item[field] !== undefined && (item[field].toString() === value?.toString())) {
      return item as OptionValue
    }
  }
  return {} as OptionValue
}

export default function () {
  const { t } = useI18n()
  const componentStore = useComponentStoreWithOut()

  const copy = (text :string, notify = false) => {
    copyToClipboard(text).then(() => {
      if (notify) {
        notifySuccess(t('copied'), { timeout: 500 })
      }
    })
  }

  const confirm = (
    message: string,
    {
      badge = 'error',
      icon = '',
      label = '',
      color = 'red',
      onCancel = (res: any) => {},
      onOk = (res: any) => {},
    } = {}
  ) => {
    const messages: Indexable[] = [
      { type: 'html', content: message }
    ]
    if (label) {
      messages.push({
        type: 'component', component: OBadge, props: {
          icon: icon,
          label: label,
          color: color
        }
      },)
    }

    componentStore.setDialog({
      type: 'tips',
      icon: badge,
      title: t('tips'),
      message: messages,
      onCancel: onCancel,
      onOk: onOk,
    })
  }

  const publicPath = async (path: string): Promise<string> => {
    if (!path || ipcProvider === 'web' || ipcProvider === 'electron') {
      return Promise.resolve(path)
    }

    const url = path.startsWith('/') ? path.slice(1) : path
    return await ipcService.publicPath(url)
  }

  const dialog = Dialog.create

  return {
    t,
    confirm,
    copy,
    dialog,
    getArrayItem,
    publicPath,
  }
}

