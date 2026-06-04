<template>
  <reader-side-view class="tts-player" header-class="justify-between text-readable">
    <template #header>
      <section class="col row items-center">
        <q-icon name="volume_up" size="20px" />
        <span class="q-px-sm">
          {{ $t('reading.aiReading') }}
        </span>
      </section>

      <section class="col-auto">
        <q-btn icon="close" class="o-toolbar-btn" flat @click="emit('close')" />
      </section>
    </template>

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
          <q-btn icon="fast_rewind" @click="ttsController.prev()" flat round v-if="ttsPlayerStatus === 'play'">
            <o-tooltip position="bottom">
              {{ $t('reading.player.backward') }}
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
          <q-btn icon="fast_forward" @click="ttsController.next()" flat round v-if="ttsPlayerStatus === 'play'">
            <o-tooltip position="bottom">
              {{ $t('reading.player.forward') }}
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
        <tts-provider-btn icon="graphic_eq"
                          label="TTS"
                          anchor="top left"
                          self="bottom left"
                          :min-width="playerWidth"
                          @select="onTTSProviderChanged">
          <o-tooltip position="bottom">TTS</o-tooltip>
        </tts-provider-btn>
        <tts-provider-btn icon="mdi-timer-outline"
                          label="定时关闭"
                          anchor="top middle"
                          self="bottom middle"
                          :min-width="playerWidth" v-if="false">
          <o-tooltip position="bottom">定时关闭</o-tooltip>
        </tts-provider-btn>
        <tts-rate-btn icon="speed"
                      :label="$t('reading.tts.speed')"
                      anchor="top right"
                      self="bottom right"
                      :min-width="playerWidth">
          <o-tooltip position="bottom">{{ $t('reading.tts.speed') }}</o-tooltip>
        </tts-rate-btn>
      </section>
      <section class="marquee">
        <vue3-marquee :duration="marqueeDuration"
                      :pause="ttsPlayerStatus === 'pause'"
                      :gradient-color="gradientColor"
                      gradient
                      pause-on-hover
                      animate-on-overflow-only>
          <span>{{ speakingText }}</span>
        </vue3-marquee>
      </section>

      <section class="error">
        <q-banner class="bg-transparent text-orange" rounded dense
                  v-if="ttsPlayerStatus === 'error'">
          <template v-slot:avatar>
            <q-icon name="error" />
          </template>
          {{$t('book.warning.ttsError')}}
        </q-banner>
      </section>
    </q-scroll-area>
  </reader-side-view>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Vue3Marquee } from 'vue3-marquee'

import ReaderSideView from '../ReaderSideView.vue'
import TtsProviderBtn from './options/tts-provider-btn.vue'
import TtsRateBtn from './options/tts-rate-btn.vue'

import useBook from 'src/hooks/useBook'
import useApi from 'src/hooks/useApi'
import useTTS from 'src/hooks/useTTS'
import { ebookRender } from 'src/api/service/ebook'
import { ssmlUtils } from 'src/api/service/tts/utils/ssml-util'
import useSetting from 'core/hooks/useSetting'
import { ttsManager } from 'src/api/service/tts/tts-manager'
import { globalBus } from 'src/api/event/event-bus'

const emit = defineEmits(['close'])

const { getCoverUrl } = useApi()
const {
  book,
  tocItem,
  previousTocItem,
  nextTocItem,
} = useBook()
const { theme } = useSetting()
const {
  tts,
  ttsClient,
  ttsController,
  ttsState,
  ttsPlayerStatus,
} = useTTS()

const speakingText = ref('')
const marqueeDuration = ref(20)
const coverUrl = computed(() => {
  return getCoverUrl(book.value)
})

const playIcon = computed(() => {
  switch (ttsPlayerStatus.value) {
    case 'pause':
    case 'stop':
    case 'error':
      return 'play_circle'
    case 'play':
    case 'resume':
      return 'pause_circle'
    default:
      return 'play_circle'
  }
})

const playerWidth = computed(() => {
  return `${tts.playerWidth - 30}px`
})

const gradientColor = computed(() => {
  return theme.value.name === 'dark' ? [39,42,62] : [255,255,255]
})

const onNextChapter = async () => {
  try {
    await ttsController.stop()
    await ebookRender.nextSection()
    await ttsController.play()
  } catch (err) {
    console.debug('nextChapter err', err)
  }
}

const onPrevChapter = async () => {
  try {
    await ttsController.stop()
    await ebookRender.prevSection()
    await ttsController.play()
  } catch (err) {
    console.debug('prevChapter err', err)
  }
}

const onStart = (ssml: string) => {
  const data = ssmlUtils.parseSSML(ssml)
  speakingText.value = data.text
  marqueeDuration.value = data.duration
}

const onTTSProviderChanged = async (item: Indexable) => {
  if (ttsPlayerStatus.value === 'play') {
    await ttsController.pause()
  }

  await ttsController.initialize(
    ebookRender.ttsStart,
    ebookRender.ttsResume,
    ebookRender.ttsNext,
    ebookRender.ttsPrev,
    tts.options,
    true
  )

  if (ttsPlayerStatus.value === 'pause') {
    await ttsController.resume()
  }
}

async function onTTSPlay(source = '') {
  if (source === 'selection') {
    await ttsController.stop()
    await ebookRender.ttsStop()
    await ttsController.play()
  }
}

onMounted(async () => {
  if (ttsClient.value) {
    ttsController.reload()
  } else {
    await ttsController.initialize(
      ebookRender.ttsStart,
      ebookRender.ttsResume,
      ebookRender.ttsNext,
      ebookRender.ttsPrev,
      tts.options
    )
    await ttsController.stop()
  }

  // events
  ttsManager.client?.on('start', onStart)
  window.addEventListener("pagehide", ttsController.stop)
  globalBus.on('tts-play', onTTSPlay)
})

onUnmounted(() => {
  ttsManager.client?.off('start', onStart)
  window.removeEventListener("pagehide", ttsController.stop)
  globalBus.off('tts-play', onTTSPlay)
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

  .marquee {
    padding: 20px 24px;
    border-radius: 12px;

    .horizontal {
      border-radius: 12px;
    }
  }

  .error {
    padding: 8px 16px;
  }
}
</style>
