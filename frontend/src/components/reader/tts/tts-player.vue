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
        <div class="row action justify-start">
          <q-btn icon="skip_previous"
                 @click="onPrevChapter"
                 flat round :disable="!previousTocItem">
            <o-tooltip position="bottom" v-if="previousTocItem">
              {{ previousTocItem?.label }}
            </o-tooltip>
          </q-btn>
          <q-btn icon="fast_rewind" @click="ttsController.prev()" flat round v-if="ttsState.isPlaying">
            <o-tooltip position="bottom">
              后退
            </o-tooltip>
          </q-btn>
        </div>
        <div class="action">
          <q-btn :icon="playIcon"
                 class="play text-primary"
                 flat round
                 @click="ttsController.togglePlayPause()" />
        </div>
        <div class="row action justify-end">
          <q-btn icon="fast_forward" @click="ttsController.next()" flat round v-if="ttsState.isPlaying">
            <o-tooltip position="bottom">
              前进
            </o-tooltip>
          </q-btn>
          <q-btn icon="skip_next"
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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import useBook from 'src/hooks/useBook';
import useApi from 'src/hooks/useApi';
import { useTTS } from 'src/hooks/useTTS'
import { ebookRender } from 'src/api/service/ebook'
const emit = defineEmits(['close']);

const { getCoverUrl } = useApi();
const {
  book,
  tocItem,
  previousTocItem,
  nextTocItem,
} = useBook();

const {
  ttsClient,
  ttsController,
  ttsState,
} = useTTS()

const coverUrl = computed(() => {
  return getCoverUrl(book.value);
})

const playIcon = computed(() => {
  return ttsState.isPlaying
    ? ttsState.isPaused ? 'play_circle' : 'pause_circle'
    : 'play_circle'
})

const onNextChapter = async () => {
  try {
    await ttsController.stop();
    await ebookRender.nextSection();
    await ttsController.play();
  } catch (err) {
    console.debug('nextChapter err')
  }
}

const onPrevChapter = async () => {
  try {
    await ttsController.stop();
    await ebookRender.prevSection();
    await ttsController.play();
  } catch (err) {
    console.debug('prevChapter err')
  }
}

const onStart = (text: string) => {
  // todo: show playing text
  // console.log('start', text)
}

onMounted(async () => {
  await ttsController.initialize(
    ebookRender.ttsStart,
    ebookRender.ttsResume,
    ebookRender.ttsNext,
    ebookRender.ttsPrev,
    'edge', {
      ...ttsState.options,
      lang: 'zh-CN'
    }
  )

  ttsClient.value?.on('start', onStart);
  window.addEventListener("pagehide", ttsController.stop);
})

onUnmounted(() => {
  ttsClient.value?.off('start', onStart);
  window.addEventListener("pagehide", ttsController.stop)
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
    .action {
      min-width: 84px;
    }
    .play {
      min-width: 80px;
      min-height: 80px;
      .q-icon {
        font-size: 64px;
      }
    }
  }
}
</style>
