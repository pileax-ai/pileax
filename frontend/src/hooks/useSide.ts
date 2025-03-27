import { ref } from 'vue';
import useCommon from 'core/hooks/useCommon';
import { notifyDone } from 'core/utils/control';

export default function () {
  const side = ref({
    show: false,
    title: '',
    position: 'right',
    style: {width: '30vw', minWidth: '600px'}
  });
  const view = ref('details');

  const { t, dialog } = useCommon();

  function onOpenSide(width = '30vw', viewAlt = 'details', printable = false, icon = '', title = '') {
    view.value = viewAlt;
    side.value = {
      ...side.value,
      show: true,
      title: title || t('details'),
      action: true,
      printable: printable,
      style: {
        width: width,
        minWidth: '600px'
      }
    }
  }
  function onCloseSide (notify = true) {
    side.value.show = false;
    if (notify) notifyDone();
  }

  return {
    view,
    side,
    onOpenSide,
    onCloseSide,
  };
}
