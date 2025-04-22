<template>
  <q-dialog ref="modal"
            position="standard"
            @before-show="init"
            @show="emit('show')"
            @hide="emit('close')"
            class="book-selection-share-dialog">
    <q-card flat>
      <q-card-section ref="captureRef" id="capture" class="bg-secondary share">
        <section class="content">
          {{ selection.text }}
        </section>
        <section class="bg-accent meta">
          <q-item>
            <q-item-section avatar>
              <q-img :src="coverUrl">
              </q-img>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">
                {{book.title}}
              </q-item-label>
              <q-item-label caption>
                {{progress.tocItem?.label}}
              </q-item-label>
              <q-item-label class="author" caption>
                {{book.author || 'Author'}}
              </q-item-label>
            </q-item-section>
          </q-item>
        </section>
      </q-card-section>
      <q-card-section class="row justify-between bg-secondary share-actions">
        <q-btn label="Cancel" class="text-readable" flat v-close-popup />
        <q-btn flat :disable="loading" @click="onDownload">
          <q-spinner-ios class="text-readable" size="20px" v-if="loading" />
          <span v-else>Download</span>
        </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import html2canvas from 'html2canvas';
import useBook from 'src/hooks/useBook';
import useApi from 'src/hooks/useApi';
import { notifyDone } from 'core/utils/control';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
});
const emit = defineEmits(['ok', 'close', 'show']);

const { getCoverUrl } = useApi();
const { book, progress, selection } = useBook();
const modal = ref();
const captureRef = ref(null);
const loading = ref(false);

const coverUrl = ref('');
const coverPath = computed(() => {
  return `${book.value.path}/${book.value.coverName}`;
})

async function onDownload() {
  const captureElement = document.getElementById('capture');
  if (!captureElement) return;

  loading.value = true;

  // Capture image
  const canvas = await html2canvas(captureElement, {
    scale: 3,
    backgroundColor: 'transparent',
    useCORS: true,
    logging: false
  });
  const base64Image = canvas.toDataURL('image/png');

  // Save to disk
  if (process.env.MODE === 'electron') {
    saveToDisk(base64Image);
  } else {
    download(base64Image);
  }
  modal.value.hide();
}

function download(base64Image: any) {
  const link = document.createElement('a');
  link.href = base64Image;
  link.download = `share.${Math.floor(Date.now() / 1000)}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  loading.value = false;
  notifyDone();
}

function saveToDisk(base64Image: any) {
  window.electronAPI.showDialog({
    properties: ['openDirectory']
  }).then(async (result: any) => {
    if (!result.canceled && result.filePaths.length > 0) {
      await window.electronAPI.saveImageFile({
        filePath: result.filePaths[0],
        data: base64Image
      });
    }
    loading.value = false;
  }).catch((err: any) => {
    loading.value = false;
  });
}

function init() {
  // window.electronAPI.readBookCover(coverPath.value).then((res: any) => {
  //   coverUrl.value = res.url;
  // }).catch((err: any) => {
  //   console.error('打开文件失败：', err);
  // })
  coverUrl.value = getCoverUrl(book.value);
}

watch(() => props.show, (newValue) => {
  if (newValue) {
    modal.value.show();
  } else {
    modal.value.hide();
  }
})

onMounted(() => {
  if (props.show) {
    modal.value.show();
  }
})
</script>

<style lang="scss">
.book-selection-share-dialog {
  .dialog-content {
    padding: 16px 16px;
    min-height: unset!important;
    word-break: break-all;
  }

  .q-card {
    max-width: 400px;
    min-width: 240px;
    background: transparent;

    .q-card__section {
      border-radius: 6px;
    }
  }

  .share {
    padding: 24px;
    .content {
      font-size: 1.2rem;
      text-align: justify;
    }
    .meta {
      margin-top: 24px;
      border-radius: 4px;

      .author {
        margin-top: 10px;
        font-size: 1rem!important;
      }
    }
  }

  .share-actions {
    margin-top: 1rem;
    padding: 0;

    .q-btn {
      width: 50%;
      height: 56px;
    }
  }
}
</style>
