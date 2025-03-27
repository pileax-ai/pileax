import { computed, ref } from 'vue';

export default function () {
  const list = ref([]);
  const pageIndex = ref(1);
  const pageSize = ref(20);

  const pagedList = computed(() => {
    const index = pageIndex.value >= 1 ? pageIndex.value - 1 : 0;
    const size = pageSize.value > 0 ? pageSize.value : 1;
    const start = index * size;
    const end = (index + 1) * size;
    return list.value.slice(start, end);
  })

  const pageMax = computed(() => {
    const total = list.value.length;
    const size = pageSize.value > 0 ? pageSize.value : 1;
    let max = Math.floor(total / size);
    if (total % size !== 0) {
      max += 1;
    }
    return max;
  })

  const pagination = computed(() => {
    return {
      index: pageIndex.value,
      size: pageSize.value,
      max: pageMax.value,
      total: list.value.length,
      data: pagedList.value
    };
  })

  function initPagination(data: [], size :number) {
    pageSize.value = size > 0 ? size : 20;
    list.value = data || [];
  }

  return {
    pageIndex,
    pageSize,
    pageMax,
    pagedList,
    pagination,
    initPagination
  };
}
