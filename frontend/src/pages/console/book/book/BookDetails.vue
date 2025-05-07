<template>
  <section class="book-details">
    <q-card flat>
      <q-responsive :ratio="1">
        <div class="cover">
          <img :src="coverUrl" />
        </div>
      </q-responsive>

      <div class="absolute-right more">
        <q-btn icon="more_horiz" flat >
          <q-menu class="o-menu">
            <q-list :style="{minWidth: '160px'}">
              <template v-for="(action, index) in actions" :key="`action-${index}`">
                <template v-if="true">
                  <q-separator class="bg-accent" v-if="action.separator" />
                  <o-common-item v-bind="action"
                                 class="text-tips"
                                 @click="onAction(action)"
                                 clickable
                                 closable
                                 right-side>
                  </o-common-item>
                </template>
              </template>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </q-card>

    <q-card flat>
      <q-card-section class="meta">
        <header class="title">{{data.title}}</header>
        <o-view-item label="作者" :value="data.author" align="right" lines="2" />
        <o-view-item label="出版社" :value="data.publisher" align="right" v-if="data.publisher" />
        <o-view-item label="格式" :value="data.extension.toUpperCase()" align="right" v-if="data.extension" />
        <o-view-item label="添加时间" :value="timeMulti(data.createTime).timestamp" align="right" />
        <o-view-item label="最后阅读时间" :value="timeMulti(data.updateTime).timestamp" align="right" />

        <section class="description" v-if="data.description">
          <span class="text-readable">简介</span>
          <q-scroll-area>
            <div v-html="data.description"></div>
          </q-scroll-area>
        </section>
      </q-card-section>

      <q-card-section class="row col-12 justify-center">
        <q-btn icon="menu_book"
               label="开始阅读"
               class="bg-primary text-white action"
               flat
               @click="openBook" />
      </q-card-section>
    </q-card>
  </section>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed, onMounted, ref } from 'vue';
import { removeBook } from 'src/service/book';
import { timeMulti } from 'core/utils/format';
import useApi from 'src/hooks/useApi';
import { ipcService } from 'src/api/ipc';
import { READER_TITLE_BAR_HEIGHT } from 'core/constants/style'

const props = defineProps({
  data: {
    type: Object,
    default: function () {
      return {};
    }
  },
});
const emit = defineEmits(['close']);

const $q = useQuasar();
const { getCoverUrl } = useApi();
const coverUrl = ref('');
const coverPath = computed(() => {
  return `${props.data.path}/${props.data.coverName}`;
})

const actions = computed(() => {
  return [
    {
      label: 'Grid',
      value: 'grid',
      icon: 'grid_view',
    },
    {
      label: 'List',
      value: 'list',
      icon: 'list',
    },
    {
      label: 'Edit',
      value: 'edit',
      icon: 'edit_note',
      separator: true
    },
    {
      label: 'Remove book',
      value: 'remove',
      icon: 'delete',
    },
  ];
});


function onAction (action :any) {
  switch (action.value) {
    case 'remove':
      onRemoveBook();
      break;
    case 'title':
      break;
    default:
      break;
  }
}

function init() {
  // window.electronAPI.readBookCover(coverPath.value).then((res: any) => {
  //   coverUrl.value = res.url;
  // }).catch((err: any) => {
  //   console.error('打开文件失败：', err);
  // })
  coverUrl.value = getCoverUrl(props.data);
}

function openBook() {
  const item = props.data;
  ipcService.openNewWindow(item.id, `/reader/book?id=${item.id}`,
    READER_TITLE_BAR_HEIGHT);
}


async function onRemoveBook() {
  $q.dialog({
    title: '确认',
    message: '你确定删除吗？',
    cancel: true
  }).onOk( async () => {
    await removeBook(props.data.id);
    emit('close');
  })
}

onMounted(() => {
  init();
})

</script>

<style lang="scss">
.book-details {
  width: 100%;
  height: 100%;

  .more {
    padding: 4px;
    .q-btn {
      width: 36px;
      height: 36px;
    }
  }

  .q-responsive {
    max-height: 400px;
  }

  .cover {
    width: 100%;
    height: 100%;
    text-align: center;
    padding: 1rem 0;

    img {
      height: 100%;
      border-radius: 4px;
    }
  }

  .meta {
    .title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .o-view-item {
      min-height: unset;
      padding: 4px 0;
    }

    .description {
      margin-top: 4px;
      .q-scrollarea {
        height: 200px;
      }
    }
  }

  .action {
    padding: 12px 40px;
  }
}
</style>
