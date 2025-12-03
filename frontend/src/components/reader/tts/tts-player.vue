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
      <section class="row col-12 justify-between items-center player-control">
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

      <section class="row col-12 justify-between items-center player-settings">
        <tss-provider-btn icon="mdi-account-tie-voice-outline"
                          label="TTS"
                          anchor="top left"
                          self="bottom left"
                          :min-width="playerWidth"
                          @select="onTTSProviderChanged">
          <o-tooltip position="bottom">TTS</o-tooltip>
        </tss-provider-btn>
        <tss-provider-btn icon="mdi-timer-outline"
                          label="定时关闭"
                          anchor="top middle"
                          self="bottom middle"
                          :min-width="playerWidth" v-if="false">
          <o-tooltip position="bottom">定时关闭</o-tooltip>
        </tss-provider-btn>
        <tss-rate-btn icon="speed"
                      label="语速"
                      anchor="top right"
                      self="bottom right"
                      :min-width="playerWidth">
          <o-tooltip position="bottom">语速</o-tooltip>
        </tss-rate-btn>
      </section>
    </q-scroll-area>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import useBook from 'src/hooks/useBook';
import useApi from 'src/hooks/useApi';
import useTTS from 'src/hooks/useTTS'
import { ebookRender } from 'src/api/service/ebook'
import TssProviderBtn from './options/tss-provider-btn.vue'
import TssRateBtn from './options/tss-rate-btn.vue'
const emit = defineEmits(['close']);

const { getCoverUrl } = useApi();
const {
  book,
  tocItem,
  previousTocItem,
  nextTocItem,
} = useBook();

const {
  tts,
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

const playerWidth = computed(() => {
  return `${tts.playerWidth - 30}px`;
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

const onTTSProviderChanged = async (item: Indexable) => {
  console.log('provide', item)
  if (ttsState.isPlaying) {
    await ttsController.pause();
  }

  await ttsController.initialize(
    ebookRender.ttsStart,
    ebookRender.ttsResume,
    ebookRender.ttsNext,
    ebookRender.ttsPrev,
    tts.options,
    true
  );

  if (ttsState.isPaused) {
    await ttsController.resume();
  }
}

onMounted(async () => {
  if (ttsClient.value) {
    ttsController.reload();
  } else {
    await ttsController.initialize(
      ebookRender.ttsStart,
      ebookRender.ttsResume,
      ebookRender.ttsNext,
      ebookRender.ttsPrev,
      tts.options
    )
  }

  // events
  ttsClient.value?.on('start', onStart);
  window.addEventListener("pagehide", ttsController.stop);
})

onUnmounted(() => {
  ttsClient.value?.off('start', onStart);
  window.removeEventListener("pagehide", ttsController.stop)
})
</script>

<style lang="scss">
.tts-player {
  .q-responsive {
    min-height: 320px;
    max-height: 50vh;
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
  }

  .player-control {
    padding: 2rem 15px;
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

  .player-settings {
    padding: 0 15px;

    .q-btn {
      padding: 4px 14px !important;
      &:first-of-type {
        .q-btn__content {
          align-items: start!important;

          .label {
            margin: 0!important;
          }
        }
      }
    }
    &:last-of-type {
      .q-btn__content {
        align-items: end!important;

        .label {
          margin: 0!important;
        }
      }
    }
  }
}
</style>
