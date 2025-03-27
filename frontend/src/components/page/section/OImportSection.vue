<template>
  <o-console-section class="o-import-section">
    <section class="row col-12 justify-between q-pa-md upload-actions">
      <div class="row">
        <q-file v-model="file" label="Import Excel"
                color="white" bg-color="primary"
                class="import"
                accept=".xls, .xlsx"
                standout flat
                @update:model-value="onImport">
          <template v-slot:prepend>
            <q-icon name="upload" @click.stop.prevent />
          </template>
        </q-file>
        <q-btn icon="cloud_upload"
               label="上传云端"
               class="bg-green text-white"
               :loading="uploading"
               flat
               @click="onUpload"
               v-if="rows.length" />
      </div>
      <div class="row items-center" v-if="uploadRes.total">
        <q-chip class="bg-accent" square>
          <o-tooltip color="primary">Total</o-tooltip>
          <q-avatar icon="list" color="primary" text-color="white"></q-avatar>
          {{uploadRes.total}}
        </q-chip>
        <q-chip class="bg-accent" square>
          <o-tooltip color="green">Success</o-tooltip>
          <q-avatar icon="done" color="green" text-color="white"></q-avatar>
          {{uploadRes.success}}
        </q-chip>
        <q-chip class="bg-accent" square>
          <o-tooltip color="orange">Pending</o-tooltip>
          <q-avatar icon="close" color="orange" text-color="white"></q-avatar>
          {{uploadRes.pending}}
        </q-chip>
        <q-chip class="bg-accent" square>
          <o-tooltip color="red">Failed</o-tooltip>
          <q-avatar icon="close" color="red" text-color="white"></q-avatar>
          {{uploadRes.failed}}
        </q-chip>
      </div>
    </section>

    <section class="row col-12 query-result-card sticky-first-column sticky-last-column">
      <q-table row-key="__rowNum__" class="col-12 o-table"
               :columns="columns"
               :rows="rows"
               :pagination="{rowsPerPage: 10}"
               flat v-if="columns.length">
      </q-table>
      <q-table row-key="__rowNum__" class="col-12 o-table"
               :rows="rows"
               :pagination="{rowsPerPage: 10}"
               flat v-else>
      </q-table>
    </section>
  </o-console-section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { read, utils } from 'xlsx';
import { POST } from 'src/hooks/useRequest';
import OConsoleSection from 'core/page/section/OConsoleSection.vue';
import {notifyError} from 'core/utils/control';

const props = defineProps({
  columns: {
    type: Array,
    default: function () {
      return []
    }
  },
  header: {
    type: Array,
    default: function () {
      return []
    }
  },
  validate: {
    type: Function,
    required: true,
  },
  uploadApi: {
    type: String,
    default: '',
  }
})
const emit = defineEmits(['success', 'failed']);

const file = ref();
const rows = ref([]);
const uploading = ref(false);
const uploadRes = ref({});

function onImport(value) {
  let reader = new FileReader();
  reader.readAsArrayBuffer(value);
  reader.onloadend = (e) => {
    const array = new Uint8Array(e.target.result)
    const wb = read(array, {type: 'array'});
    const ws = wb.Sheets[wb.SheetNames[0]];
    const headerRow = getHeaderRow(ws);
    console.log('header row', headerRow)

    // 数据简单校验
    if (props.validate(headerRow)) {
      const header = props.header.length ? props.header : null;
      rows.value = utils.sheet_to_json(ws, {header: header, raw: false});
      if (header) {
        rows.value.splice(0, 1)
      }
      console.log('rows', rows.value);
    } else {
      notifyError('导入数据格式不正确');
    }
  }
}

function getHeaderRow (sheet) {
  const headers = []
  const range = utils.decode_range(sheet['!ref'])
  let C
  const R = range.s.r
  for (C = range.s.c; C <= range.e.c; ++C) {
    const cell = sheet[utils.encode_cell({ c: C, r: R })]
    let hdr = 'UNKNOWN ' + C
    if (cell && cell.t) hdr = utils.format_cell(cell)
    headers.push(hdr)
  }
  return headers
}

function onUpload() {
  uploadRes.value = {};
  uploading.value = true;
  POST({name: props.uploadApi, body: rows.value}).then(data => {
    uploadRes.value = data;
    uploading.value = false;
    emit('success', data)
  }).catch(err => {
    uploading.value = false;
    emit('failed')
  })
}
</script>

<style lang="scss">
.o-import-section {
  td {
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .upload-actions {
    .import {
      .q-field__label, .q-field__native, .q-field__marginal {
        color: unset;
      }
    }

    .q-btn {
      margin-left: 10px;
      min-width: 120px;
    }
  }

  .query-result-card {
    &.sticky-first-column {
      th:first-child,
      td:first-child {
        position: sticky;
        left: 0;
        background-color: var(--q-secondary);
        z-index: 1;
      }
    }

    &.sticky-last-column {
      th:last-child,
      td:last-child {
        position: sticky;
        right: 0;
        background-color: var(--q-secondary);
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        z-index: 1;
      }
    }
  }
}
</style>
