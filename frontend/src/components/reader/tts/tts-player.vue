<template>
  <section class="tts-player bg-secondary no-drag-region">
    <header class="row col-12 justify-between items-center text-readable">
      <section class="col row items-center">
        <q-icon name="volume_up" size="20px" />
        <span class="q-px-sm">
          AI朗读
        </span>
      </section>

      <section class="col-auto">
        <q-btn icon="close" class="o-toolbar-btn" flat @click="emit('close')" />
      </section>
    </header>
    <q-scroll-area class="o-scroll-wrapper">
      <q-responsive :ratio="1">
        <div class="cover">
          <img :src="coverUrl" alt="Cover" />
        </div>
      </q-responsive>
      <section class="col-12 text-bold text-center">
        {{ tocItem.label }}
      </section>
      <section class="row col-12 justify-around items-center control">
        <div>
          <q-btn icon="fast_rewind"
                 @click="onPrevChapter"
                 flat round :disable="!previousTocItem">
            <o-tooltip position="bottom" v-if="previousTocItem">
              {{ previousTocItem?.label }}
            </o-tooltip>
          </q-btn>
        </div>
        <div>
          <q-btn icon="pause_circle" class="play text-primary"
                 flat round @click="onPause" v-if="ttsPlaying" />
          <q-btn icon="play_circle" class="play text-primary"
                 flat round @click="onPlay" v-else />
        </div>
        <div>
          <q-btn icon="fast_forward"
                 @click="onNextChapter"
                 flat round :disable="!nextTocItem">
            <o-tooltip position="bottom" v-if="nextTocItem">
              {{ nextTocItem?.label }}
            </o-tooltip>
          </q-btn>
        </div>
      </section>
    </q-scroll-area>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue'
import useBook from 'src/hooks/useBook';
import useApi from 'src/hooks/useApi';
import {
  ttsStart,
  ttsStop,
  ttsPrepare,
  ttsNext,
  ttsPrev
} from 'src/api/service/ebook/book';
import { useTTS } from 'src/hooks/useTTS'
import { ebookRender } from 'src/api/service/ebook'
const emit = defineEmits(['close']);

const { getCoverUrl } = useApi();
const {
  store,
  book,
  tocItem,
  previousTocItem,
  nextTocItem,
} = useBook();

const {
  ttsPlayer
} = useTTS()

const coverUrl = computed(() => {
  return getCoverUrl(book.value);
})
const tts = computed(() => store.tts);
const ttsPlaying = computed({
  get() {
    return tts.value.playing;
  },
  set(val: boolean) {
    store.setTTSItem('playing', val);
  }
});

async function onPause() {
  ttsPlaying.value = false;
  await ttsPlayer.stop();
}

async function onPlay() {
  ttsPlaying.value = true;
  await ttsPlayer.play();
}

const onNextChapter = async () => {
  await onPause();
  ebookRender.nextSection();
  setTimeout(async () => {
    await onPlay();
  }, 1000)
}

const onPrevChapter = async () => {
  await onPause();
  ebookRender.prevSection();
  setTimeout(async () => {
    await onPlay();
  }, 1000)
}

onMounted(async () => {
  await ttsPlayer.initialize(
    ttsStart,
    ttsNext,
    ttsPrev,
    'browser', {
      lang: 'zh-CN',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0
    }
  )
})

onBeforeUnmount(() => {
  ttsPlayer.stop()
})
</script>

<style lang="scss">
.tts-player {
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

  .control {
    padding: 2rem 0;
    .play {
      min-width: 56px;
      min-height: 56px;
      .q-icon {
        font-size: 56px;
      }
    }
  }
}
</style>
