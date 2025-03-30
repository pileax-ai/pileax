<template>
  <o-common-page class="row justify-center items-center page-chat-start"
                 content-class="justify-center" header>
    <template #header>
      <o-ai-provider-select-btn />
    </template>

    <section class="row justify-center start-panel">
      <header>
        <div class="row justify-center items-center welcome">
          <img src="/logo.png" alt="Logo" />
          我是PileaX，很高兴遇见你!
        </div>
        <div class="message text-readable">我是你的AI助手，请把你的任务交给我吧~</div>
      </header>

      <o-chat-input @send="onSend" />

      <footer></footer>
    </section>
  </o-common-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import OCommonPage from 'core/page/template/OCommonPage.vue';
import OChatInput from 'components/chat/OChatInput.vue';
import OAiProviderSelectBtn from 'components/ai/OAiProviderSelectBtn.vue';
import { router } from 'src/router';

const route = useRoute();

function onSend(data: Indexable) {
  console.log('send', data)

  router.push({ name: 'chat-chat', params: { id: 'uuid' } })
}
</script>

<style lang="scss">
.page-chat-start {
  header.header {
    position: absolute;
    top: 0;
    left: 0;
    padding: 1rem;
  }

  .start-panel {
    width: 100%;
    max-width: 800px;

    header, footer, .start-card {
      width: 100%;
    }

    header {
      text-align: center;
      padding-bottom: 20px;
      .welcome {
        font-size: 1.6rem;
        font-weight: 600;

        img {
          display: block;
          height: 32px;
          margin-right: 8px;
        }
      }
      .message {
        margin-top: 4px;
      }
    }

    footer {
      height: 200px;
    }
  }

}
</style>
