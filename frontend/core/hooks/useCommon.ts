import { Platform, Dialog, copyToClipboard } from 'quasar';
import { useI18n } from 'vue-i18n';
import { notifySuccess } from 'core/utils/control';

export const getArrayItem = (array :Indexable[], value :string, field = '') => {
  field = field || 'value';
  for (const item of array) {
    if (item[field] !== undefined && (item[field].toString() === value?.toString())) {
      return item as OptionValue;
    }
  }
  return {} as OptionValue;
}

export default function () {
  const { t } = useI18n();

  const copy = (text :string, notify = false) => {
    copyToClipboard(text).then(() => {
      if (notify) {
        notifySuccess(t('copied'), { timeout: 500 });
      }
    })
  }

  const dialog = Dialog.create;


  return {
    t,
    copy,
    dialog,
    getArrayItem
  }
}

