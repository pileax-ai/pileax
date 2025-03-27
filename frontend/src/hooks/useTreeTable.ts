import {computed, ref} from 'vue';
import { notifyDone } from 'core/utils/control';
import { VxeTableInstance } from 'vxe-table';

export default function () {
  const treeTable = ref<VxeTableInstance>();
  const isAllExpand = ref(false);

  const toggleTips = computed(() => {
    return isAllExpand.value
      ? { label: '折叠所有', icon: 'expand_less' }
      : { label: '展开所有', icon: 'expand_more' };
  });

  function toggleExpand() {
    const $table = treeTable.value;
    if ($table) {
      isAllExpand.value = !isAllExpand.value;
      if (isAllExpand.value) {
        $table.setAllTreeExpand(true);
      } else {
        $table.clearTreeExpand();
      }
    }
  }

  function expandRow(row) {
    const $table = treeTable.value;
    if ($table) {
      $table.setTreeExpand(row, true);
    }
  }

  return {
    treeTable,
    toggleTips,

    toggleExpand,
    expandRow
  };
}
