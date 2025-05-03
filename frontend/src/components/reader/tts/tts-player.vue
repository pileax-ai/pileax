<template>
  <section class="tts-player bg-secondary">
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
      <section class="row col-12">
        <div class="row col-12">
          {{ book.title }}
        </div>
      </section>
      <section class="row col-12 justify-around items-center control">
        <div>
          <q-btn icon="fast_rewind"
                 flat round />
        </div>
        <div>
          <q-btn icon="stop_circle" class="play text-primary"
                 flat round @click="onStop" v-if="ttsPlaying" />
          <q-btn icon="play_circle" class="play text-primary"
                 flat round @click="onPlay" v-else />
        </div>
        <div>
          <q-btn icon="fast_forward"
                 flat round />
        </div>
      </section>
    </q-scroll-area>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import useBook from 'src/hooks/useBook';
import useApi from 'src/hooks/useApi';
import { ttsStart, ttsPrepare, ttsNext, ttsStop } from 'src/service/book'
import { sleep } from 'openai/core'
const emit = defineEmits(['close']);

const { getCoverUrl } = useApi();
const {
  store,
  book,
} = useBook();

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

async function onStop() {
  ttsPlaying.value = false;
  await ttsStop();
}

async function onPlay() {
  ttsPlaying.value = true;
  const start = await ttsStart();
  console.log('start', start);
  await sleep(3000);

  for (let i = 0; i < 3; i++) {
    const next = await ttsNext();
    console.log('next', next);
    await sleep(3000)
  }
  // console.log('next', next);
  // speakWithEdgeTTS(next);
}

async function onPlay0() {
  const start = await ttsStart();
  console.log('start', start);
  await sleep(3000);

  for (let i = 0; i < 10; i++) {
    const next = await ttsNext();
    console.log('next', next);
    await sleep(3000)
  }
  // console.log('next', next);
  // speakWithEdgeTTS(next);
}

function speak(text: string, lang = 'zh-CN') {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = lang;
  msg.rate = 1;
  msg.pitch = 1;

  const voices = speechSynthesis.getVoices();
  msg.voice = voices.find(v => v.lang === lang) || null;

  speechSynthesis.speak(msg);
}

function speakWithEdgeTTS(text: string) {
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();

  // 选择 Edge 浏览器中可用的中文语音（如 Microsoft Xiaoxiao）
  const voice = voices.find(v =>
    v.name.includes('Microsoft Xiaoxiao') ||
    (v.lang === 'zh-CN' && v.name.includes('Microsoft'))
  );
  console.log('voice', voice);

  if (voice) {
    utterance.voice = voice;
    utterance.lang = 'zh-CN';
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  } else {
    console.warn('没有找到 Microsoft 中文语音，使用默认');
    speak(text);
  }
}
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
