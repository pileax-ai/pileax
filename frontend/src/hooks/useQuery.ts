import { ref, watch } from 'vue';
import useCommon from 'core/hooks/useCommon';
import { DELETE, POST } from 'src/hooks/useRequest';
import { notifyDone } from 'core/utils/control';
import { useComponentStoreWithOut } from 'stores/component';

export default function () {
  const apiName = ref('');
  const apiPath = ref('');
  const itemTitle = ref('');
  const condition = ref({});
  const rows = ref([]);
  const columns = ref([]);
  const visibleColumns = ref([]);
  const dense = ref(false);
  const tableRef = ref(null);
  const tableView = ref('table');
  const paging = ref({
    page: 1,
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 20, 50, 100, 200],
    rowsNumber: 10,
    sortBy: 'createTime',
    descending: true
  });
  const side = ref({
    show: false,
    title: '',
    position: 'right',
    style: {width: '30vw', minWidth: '600px'}
  });
  const loading = ref(false);
  const id = ref('');
  const view = ref('details');

  const { t, dialog } = useCommon();
  const componentStore = useComponentStoreWithOut();

  function initQuery({api = '', path = '/query', columnList = [], title = ''}) {
    apiName.value = api;
    apiPath.value = path;
    itemTitle.value = title;
    columns.value = columnList;
    visibleColumns.value = columnList.map(item => item.field);
    onQuery();
  }

  function prepareQuery(pagination: any, filter: any, sortField = 'createTime') {
    if (pagination.page) {
      paging.value.page = pagination.page;
    }
    if (pagination.rowsPerPage) {
      paging.value.rowsPerPage = pagination.rowsPerPage;
    }

    const sort = {};
    if (pagination.sortBy) {
      paging.value.sortBy = pagination.sortBy;
      paging.value.descending = pagination.descending;
      sort[pagination.sortBy] = pagination.descending ? 'desc' : 'asc';
    } else {
      paging.value.sortBy = sortField;
      paging.value.descending = false;
    }

    return {
      pageIndex: paging.value.page,
      pageSize: paging.value.rowsPerPage,
      condition: Object.assign({}, condition.value),
      sort: sort
    };
  }

  function onQuery() {
    onRequest({pagination: paging.value});
  }

  function onRequest({pagination, filter}) {
    loading.value = true;
    const queryBody = prepareQuery(pagination, filter);
    POST({name: apiName.value, path: apiPath.value, body: queryBody}).then(res => {
      const data = res.data;
      rows.value = data.list.map(e => {
        return {...e, hasChild: true}; // Used for TreeTable lazy load
      });
      paging.value.rowsNumber = data.total;
      loading.value = false;
    }).catch(err => {
      loading.value = false;
    });
  }

  function onDense(value) {
    dense.value = value;
  }

  function onDetails(idAlt: string, width = '30vw', viewAlt = 'details', icon = '', title = '') {
    id.value = idAlt;
    view.value = viewAlt;
    side.value = {
      ...side.value,
      show: true,
      icon: icon || (idAlt ? 'edit' : 'add'),
      title: title || itemTitle.value || t('details'),
      action: true,
      style: {
        width: width,
        minWidth: '600px'
      }
    }
  }
  function openSide(width = '30vw', viewAlt = 'details', icon = '', title = '') {
    view.value = viewAlt;
    side.value = {
      ...side.value,
      show: true,
      icon: icon,
      title: title || itemTitle.value || t('details'),
      action: true,
      style: {
        width: width,
        minWidth: '300px'
      }
    }
  }

  function closeSide (notify = true) {
    side.value.show = false;
    if (notify) notifyDone();
  }

  function onDelete(api: string, id: string, label = '', notify = true) {
    // dialog({
    //   title: 'Tips',
    //   message: `确认删除该数据项？[${label}]`,
    //   ok: 'Confirm',
    //   cancel: 'Cancel'
    // }).onOk(() => {
    //   doDelete(name, id, notify);
    // });
    if (label) {
      label = ` [<span class="text-orange text-bold">${label}</span>] `;
    }
    componentStore.setDialog({
      type: 'tips',
      icon: 'error',
      title: t('tips'),
      message: `确认删除该数据项？${label}`,
      showOk: true,
      onOk: () => {
        doDelete(api, id, notify);
      }
    });
  }

  function doDelete(api: string, id: string, notify = true) {
    DELETE({name: api, query: {id: id}}).then(data => {
      onQuery();
      if (notify) notifyDone();
    });
  }

  function onReset() {
    condition.value = {};
    onQuery();
  }

  function isVisibleColumn (name: string) {
    return visibleColumns.value.indexOf(name) >= 0;
  }

  watch(() => paging.value.page, (newValue) => {
    setTimeout(() => {
      // console.log('page', tableRef.value)
      // tableRef.value?.scrollTo(10);
    }, 1000)
  })

  const table = ref({
    rows,
    columns,
    visibleColumns,
    dense,
    paging,
    loading,
  });

  const query = ref({
    columns,
    visibleColumns,
    dense,
    side,
    onRequest,
    onQuery,
    onDense,
    onDetails,
    onDelete,
    onReset,
    closeSide,
    openSide,
  });

  return {
    id,
    view,
    side,
    condition,

    query,
    table,
    tableView,
    tableRef,

    initQuery,
    isVisibleColumn
  };
}
