import { ref, watch } from 'vue';
import useCommon from 'core/hooks/useCommon';
import { DELETE, POST } from 'src/hooks/useRequest';
import { useComponentStoreWithOut } from 'stores/component';
import { QInfiniteScroll } from 'quasar'
import { notifyDone } from 'core/utils/control'

export default function () {
  const apiName = ref('');
  const apiPath = ref('');
  const itemTitle = ref('');
  const condition = ref<Indexable>({});
  const sort = ref<Indexable>({ update_time: 'desc' });
  const rows = ref<Indexable[]>([]);
  const total = ref(0);
  const paging = ref({
    index: 1,
    size: 10,
    more: true
  });
  const side = ref({
    show: false,
    title: '',
    icon: '',
    position: 'right',
    style: {width: '30vw', minWidth: '600px'},
    contentClass: 'card'
  });
  const scrollRef = ref<InstanceType<typeof QInfiniteScroll>>();
  const loading = ref(false);
  const loaded = ref(false);
  const loadingMore = ref(false);
  const id = ref('');
  const view = ref('details');

  const { t, confirm, dialog } = useCommon();
  const componentStore = useComponentStoreWithOut();

  function initQuery({api = '', path = '/query', title = ''}) {
    apiName.value = api;
    apiPath.value = path;
    itemTitle.value = title;
  }

  function prepareQuery() {
    return {
      pageIndex: paging.value.index,
      pageSize: paging.value.size,
      condition: Object.assign({}, condition.value),
      sort: Object.assign({}, sort.value),
    };
  }

  async function onQuery(scrollReset = true) {
    if (scrollReset) {
      resetScroll();
    }

    loading.value = true;
    const queryBody = prepareQuery();
    try {
      const data = await POST({
        name: apiName.value,
        path: apiPath.value,
        body: queryBody}
      ) as Indexable;
      rows.value = rows.value.concat(data.list);
      total.value = data.total;
      paging.value.index += 1;
      paging.value.more = (paging.value.size === data.list.length);
      loading.value = false;
      loaded.value = true;

      if (paging.value.more) {
        scrollRef.value?.resume();
      }
    } catch (err) {
      paging.value.more = false
      loading.value = false;
    }
  }

  async function onLoadMore(index: number, done: (stop: boolean) => void) {
    // console.log('scroll bottom', index, paging.value);
    if (paging.value.more) {
      loadingMore.value = true;
      setTimeout(async () => {
        await onQuery(false);
        loadingMore.value = false;
        done(false);
      }, 0)
    } else {
      done(true);
    }
  }

  function resetQuery() {
    loaded.value = false;
    paging.value.index = 1;
    paging.value.more = true;
    rows.value = [];
  }

  function resetScroll() {
    resetQuery();
    scrollRef.value?.reset();
  }

  function openSide(width = '30vw', viewAlt = 'details', icon = '', title = '') {
    view.value = viewAlt;
    side.value = {
      ...side.value,
      show: true,
      icon: icon,
      title: title || itemTitle.value || t('details'),
      style: {
        width: width,
        minWidth: '300px'
      },
    }
  }

  function closeSide (showSide = false, query = true, notify = true, ) {
    side.value.show = showSide;
    if (query) onQuery();
    if (notify) notifyDone();
  }

  const query = ref({
    paging,
    side,
    onLoadMore,
    onQuery,
    openSide,
    closeSide
  });

  return {
    rows,
    total,
    loading,

    id,
    view,
    side,
    scrollRef,
    condition,
    sort,
    componentStore,

    query,
    initQuery,
  };
}
