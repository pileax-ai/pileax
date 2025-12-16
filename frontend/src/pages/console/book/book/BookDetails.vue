<template>
  <section class="book-details">
    <q-card flat>
      <q-responsive :ratio="1">
        <div class="cover">
          <img :src="coverUrl" />
        </div>
      </q-responsive>

      <div class="absolute-right more">
        <q-btn icon="more_horiz" flat v-if="!add">
          <book-context-menu :data="data"
                             @edit="onEdit"
                             @close="onClose" />
        </q-btn>
      </div>
    </q-card>

    <q-card class="meta-card" flat>
      <q-card-section class="meta">
        <header class="title">{{data.title}}</header>
        <o-view-item :label="$t('book.author')"
                     :value="data.author" align="right" lines="2" />
        <o-view-item :label="$t('book.publisher')"
                     :value="data.publisher" align="right" v-if="data.publisher" />
        <o-view-item :label="$t('book.format')"
                     :value="data.extension.toUpperCase()" align="right" v-if="data.extension" />
        <template v-if="add">
          <o-view-item :label="$t('book.uploadTime')"
                       :value="timeMulti(data.createTime).timestamp" align="right" />
        </template>
        <template v-else>
          <o-view-item :label="$t('book.addTime')"
                       :value="timeMulti(data.createTime).timestamp" align="right" />
          <o-view-item :label="$t('book.lastReadTime')"
                       :value="timeMulti(data.updateTime).timestamp" align="right" />
        </template>

        <section class="description" v-if="data.description">
          <span class="text-readable">{{ $t('description') }}</span>
          <q-scroll-area>
            <div v-html="data.description"></div>
          </q-scroll-area>
        </section>
      </q-card-section>

      <q-card-section class="row col-12 justify-center">
        <q-btn icon="add"
               :label="$t('add')"
               class="bg-primary text-white action"
               flat
               @click="emit('add')" v-if="add" />
        <q-btn icon="menu_book"
               :label="$t('book.startReading')"
               class="bg-primary text-white action"
               flat
               @click="openBook" v-else />
      </q-card-section>
    </q-card>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { timeMulti } from 'core/utils/format'
import useApi from 'src/hooks/useApi'
import { ipcService } from 'src/api/ipc'
import { READER_TITLE_BAR_HEIGHT } from 'core/constants/style'
import BookContextMenu from 'pages/console/book/book/BookContextMenu.vue'

const props = defineProps({
  data: {
    type: Object,
    default: function () {
      return {}
    }
  },
  add: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['add', 'close', 'edit'])

const { getCoverUrl } = useApi()
const coverUrl = ref('')

function onEdit() {
  emit('edit', props.data)
}

function onClose(args: Indexable) {
  emit('close', args)
}

function openBook() {
  const item = props.data
  ipcService.openNewWindow(item.bookId, `/reader/book?id=${item.bookId}`,
    READER_TITLE_BAR_HEIGHT)
}

function init() {
  coverUrl.value = getCoverUrl(props.data)
}

onMounted(() => {
  init()
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
    padding-top: 1rem;

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
        height: 160px;
      }
    }
  }

  .action {
    padding: 12px 40px;
  }
}
</style>
