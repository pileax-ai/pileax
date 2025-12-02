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
          <q-btn icon="fast_rewind"
                 @click="onPrevChapter"
                 flat round :disable="!previousTocItem">
            <o-tooltip position="bottom" v-if="previousTocItem">
              {{ previousTocItem?.label }}
            </o-tooltip>
          </q-btn>
          <q-btn @click="ttsPlayer.prev()" flat round v-if="ttsState.isPlaying">
            <q-icon name="play_arrow" class="rotate-180" />
            <o-tooltip position="bottom">
              后退
            </o-tooltip>
          </q-btn>
        </div>
        <div class="action">
          <q-btn :icon="playIcon"
                 class="play text-primary"
                 flat round
                 @click="ttsPlayer.togglePlayPause()" />
        </div>
        <div class="row action justify-end">
          <q-btn @click="ttsPlayer.next()" flat round v-if="ttsState.isPlaying">
            <q-icon name="play_arrow" />
            <o-tooltip position="bottom">
              前进
            </o-tooltip>
          </q-btn>
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
  ttsState,
  ttsPlayer
} = useTTS()

const coverUrl = computed(() => {
  return getCoverUrl(book.value);
})

const playIcon = computed(() => {
  return ttsState.value.isPlaying
    ? ttsState.value.isPaused ? 'play_circle' : 'pause_circle'
    : 'play_circle'
})

const onNextChapter = async () => {
  await ttsPlayer.stop();
  await ebookRender.nextSection();
  await ttsPlayer.play();
}

const onPrevChapter = async () => {
  await ttsPlayer.stop();
  await ebookRender.prevSection();
  await ttsPlayer.play();
}

onMounted(async () => {
  await ttsPlayer.initialize(
    ebookRender.ttsStart,
    ebookRender.ttsNext,
    ebookRender.ttsPrev,
    'browser', {
      lang: 'zh-CN',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0
    }
  )
  window.addEventListener("pagehide", ttsPlayer.stop);
})

onUnmounted(() => {
  window.addEventListener("pagehide", ttsPlayer.stop)
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
      min-width: 56px;
      min-height: 56px;
      .q-icon {
        font-size: 56px;
      }
    }
  }
}
</style>
