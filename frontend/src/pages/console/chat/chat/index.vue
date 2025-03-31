<template>
  <o-common-page ref="pageRef" class="page-chat" header footer scrollable>
    <template #header>
      <o-ai-provider-select-btn />
    </template>

    <section class="row col-12 justify-center">
      <section class="chat-list">
        <template v-for="(item, index) in messages" :key="index">
          <o-chat-message v-bind="item"
                          :align-right="item.role==='user'"
                          :class="{ 'latest': index === messages.length-1 }">
          </o-chat-message>
        </template>
      </section>
    </section>

    <template #footer>
      <o-chat-input @send="onSend" />

      <div class="row col-12 justify-center q-py-sm bg-secondary text-tips warning">
        内容由 AI 生成，请仔细甄别
      </div>
    </template>
  </o-common-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue';
import OCommonPage from 'core/page/template/OCommonPage.vue';
import OChatInput from 'components/chat/OChatInput.vue';
import OAiProviderSelectBtn from 'components/ai/OAiProviderSelectBtn.vue';
import OChatMessage from 'components/chat/OChatMessage.vue';

const pageRef = ref(null);

const messages = ref([
  {
    role: 'user',
    message: 'Have you seen Quasar?'
  },
  {
    role: 'system',
    message: 'Youth\n\n Youth is not a time of life; it is a state of mind; it is not a matter of rosy cheeks, red lips and supple knees; it is a matter of the will, a quality of the imagination, a vigor of the emotions; it is the freshness of the deep springs of life.',
    think: true
  },
  {
    role: 'user',
    message: 'Paragraph\n' +
      '\n' +
      'Youth is not a time of life; it is a state of mind; it is not a matter of rosy cheeks, red lips and supple knees; it is a matter of the will, a quality of the imagination, a vigor of the emotions; it is the freshness of the deep springs of life.\n' +
      '\n' +
      'Youth means a temperamental predominance of courage over timidity, of the appetite for adventure over the love of ease. This often exists in a man of 60 more than a boy of 20. Nobody grows old merely by a number of years. We grow old by deserting our ideals.\n' +
      '\n' +
      'Years may wrinkle the skin, but to give up enthusiasm wrinkles the soul. Worry, fear, self-distrust bows the heart and turns the spirit back to dust.\n' +
      '\n' +
      'Whether 60 or 16, there is in every human being’s heart the lure of wonder, the unfailing childlike appetite of what’s next and the joy of the game of living. In the center of your heart and my heart there is a wireless station: so long as it receives messages of beauty, hope, cheer, courage and power from men and from the Infinite, so long are you young.\n' +
      '\n' +
      'When the aerials are down, and your spirit is covered with snows of cynicism and the ice of pessimism, then you are grown old, even at 20, but as long as your aerials are up, to catch waves of optimism, there is hope you may die young at 80.',
  },
])

async function onSend(data: Indexable) {
  console.log('send', data)
  messages.value.push({
    role: 'user',
    message: data.message
  })
  messages.value.push({
    role: 'system',
    message: `### Go

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("Hello, world!")
}`
  })

  await nextTick();
  // Scroll to bottom
  pageRef.value?.scrollToBottom();
}
</script>

<style lang="scss">
.page-chat {
  header.header {
    position: absolute;
    top: 0;
    left: 0;
    padding: 1rem;
    z-index: 1;
  }

  .o-page-container {
    top: 64px;
    bottom: 140px;
    padding: 0 1rem 1rem 1rem;
  }

  .chat-list {
    width: 100%;
    max-width: 800px;
  }

  footer.footer {
    justify-content: center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    .warning {
      font-size: 0.8rem;
      //opacity: 0.75;
    }
  }
}
</style>
