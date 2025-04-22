<template>
  <section class="annotation-details">
    <q-card class="cover-card" flat>
      <div class="cover">
        <img :src="coverUrl" />
      </div>
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
        <header class="title text-readable">{{data.bookTitle}}</header>
        <o-view-item label="章节" :value="data.chapter" align="right" lines="2" />
        <o-view-item label="时间" :value="timeMulti(data.createTime).timestamp" align="right" />

        <section class="note">
          <q-scroll-area>
            <div v-html="data.note"></div>
          </q-scroll-area>
        </section>
      </q-card-section>

      <q-card-section class="row col-12 justify-center">
        <q-btn icon="visibility"
               label="开始预览"
               class="bg-cyan text-white action"
               flat
               @click="openBook" />
        <div class="col-12 text-center text-tips caption q-mt-md">
          预览模式下，不会保存阅读进度.
        </div>
      </q-card-section>
    </q-card>
  </section>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed, onMounted, ref } from 'vue';
import { removeBook } from 'src/service/book';
import { timeMulti } from 'core/utils/format';

const props = defineProps({
  data: {
    type: Object,
    default: function () {
      return {};
    }
  },
  coverUrl: {
    type: String,
    default: ''
  },
});
const emit = defineEmits(['close']);

const $q = useQuasar();

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
      label: 'Recent',
      value: 'recent',
      icon: 'schedule',
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

function openBook() {
  const item = props.data;
  if (process.env.MODE === 'electron') {
    window.electronAPI.openNewWindow(item.id, `/reader/annotation?id=${item.id}`);
  } else {
    window.open(`/reader/annotation?id=${item.id}`, '_blank');
  }
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
</script>

<style lang="scss">
.annotation-details {
  width: 100%;
  height: 100%;

  .more {
    padding: 4px;
    .q-btn {
      width: 36px;
      height: 36px;
    }
  }

  .cover-card {
    height: 200px;
  }

  .cover {
    width: 100%;
    height: 100%;
    text-align: center;
    padding-top: 1rem;

    img {
      height: 100%;
      border-radius: 4px;
    }
  }

  .meta {
    .title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .o-view-item {
      min-height: unset;
      padding: 4px 0;
    }

    .note {
      margin-top: 16px;
      font-size: 1.1rem;
      text-align: justify;
      .q-scrollarea {
        height: 240px;
      }
    }
  }

  .action {
    padding: 12px 40px;
  }
}
</style>
