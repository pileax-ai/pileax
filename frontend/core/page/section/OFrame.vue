<template>
  <section class="o-frame o-page-container">
    <div class="loading">
      <q-spinner-dots
          color="primary"
          size="3em"
          v-if="loading"
      />
    </div>
    <webview :src="src"
             useragent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
             @dom-ready="onDomReady"
             v-if="ipcProvider === 'electron'" />
    <iframe :src="src"
            @load="onLoad"
            v-else />
  </section>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import { ipcProvider } from 'src/api/ipc'
const props = defineProps({
  src: {
    type: String,
    default: ''
  }
})

const loading = ref(true)

function onLoad() {
  loading.value = false
}

function onDomReady() {
  loading.value = false

  const webview = document.querySelector('webview')
  webview?.insertCSS(`
    /* 针对 Webkit 内核 (Electron) */
    ::-webkit-scrollbar {
      width: 0px !important;
      height: 0px !important;
      background: transparent !important;
    }

    /* 针对现代标准 */
    html {
      scrollbar-width: none !important; /* Firefox */
      -ms-overflow-style: none !important; /* IE/Edge */
    }
  `)
}
</script>

<style lang="scss">
.o-frame {
  .loading {
    position: absolute;
    left: 0;
    top: 100px;
    width: 100%;
    text-align: center;
  }

  iframe, webview {
    width: 100%;
    height: 100%;

    box-sizing: border-box;
    overflow: hidden;
    border: 0;
  }

}
</style>
