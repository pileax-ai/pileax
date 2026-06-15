<template>
  <section class="book-cover-picker">
    <nav class="col-12 navi">
      {{ $t('coverList') }}
    </nav>

    <section class="row col-12 covers-container">
      <template v-for="(item, index) in list" :key="index">
        <div class="col-4 image-container q-pa-sm" @click="onPick(item)">
          <img :src="getFileUrl(item.url)" alt="cover" />

          <q-icon name="done"
                  class="selected absolute-top-right bg-primary text-white"
                  v-if="currentUrl === item.url" />
          <q-icon name="close"
                  class="action absolute-top-right bg-red text-white"
                  @click.stop="onDelete(item)"
                  v-if="currentUrl !== item.url && data.coverUrl !== item.url">
            <o-tooltip>{{ $t('delete') }}</o-tooltip>
          </q-icon>
        </div>
      </template>

      <div class="row col-4 q-pa-sm items-center">
        <o-file-uploader accept=".png,.jpg,.svg"
                         :maxSize="10 * 1024 * 1024"
                         :ref-id="bookId"
                         ref-type="book"
                         reset
                         @uploaded="onCoverUpload"
                         v-if="bookId" />
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, type PropType, ref } from 'vue'
import useDialog from 'core/hooks/useDialog'
import useApi from 'src/hooks/useApi'
import { bookService } from 'src/api/service/remote'
import OFileUploader from 'core/components/fIle/OFileUploader.vue'
import useCrud from 'src/hooks/useCrud'

const props = defineProps({
  data: {
    type: Object as PropType<Indexable>,
    default: () => {}
  }
})
const emit = defineEmits(['pick'])

const { dialog, onHide } = useDialog()
const { getFileUrl } = useApi()
const { crud } = useCrud()
const list = ref<Indexable[]>()
const currentUrl = ref('')
const bookId = ref('')

function onPick(item: Indexable) {
  currentUrl.value = item.url
  emit('pick', item.url)
}

function onDelete(item: Indexable) {
  crud.remove('fileMeta', item.id, {
    onOk: () => {
      queryCover()
    }
  })
}

function onCoverUpload(info: Indexable) {
  currentUrl.value = info.url
  emit('pick', info.url)
  queryCover()
}

function queryCover() {
  bookService.queryCover(bookId.value).then(res => {
    list.value = res.list
  })
}

onMounted(() => {
  bookId.value = props.data.bookId
  currentUrl.value = props.data.coverUrl
  queryCover()
})
</script>

<style lang="scss">
.book-cover-picker {
  padding: 8px;
  width: 514px;

  nav {
    font-size: 1.2rem;
    font-weight: 600;
  }

  .covers-container {
    padding: 8px 0;
    .image-container {
      position: relative;
      height: 200px;
      border-radius: 4px;

      &:hover {
        background: var(--q-accent);
        cursor: pointer;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
        border: solid 1px var(--q-accent);
      }

      .selected, .action {
        top: 12px;
        right: 12px;
        z-index: 1;
        font-size: 1.4rem;
        border-radius: 50%;
      }
    }

    .o-file-uploader .file-uploader {
      min-height: 186px;
    }
  }
}
</style>
