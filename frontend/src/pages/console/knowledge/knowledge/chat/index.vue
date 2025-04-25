<template>
  <o-console-section class="chat-tab"
                     icon="forum"
                     title="对话">
    <chat-section ref-type="knowledge"
                  :ref-id="knowledgeId"
                  description="基于知识库问答"
                  tag="基于知识库"
                  toc header multi-session default-open
                  v-if="knowledgeId">
    </chat-section>
  </o-console-section>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from 'vue'
import OConsoleSection from 'core/page/section/OConsoleSection.vue';
import ChatSection from 'components/chat/ChatSection.vue';

const props = defineProps({
  knowledgeId: {
    type: String,
    required: true
  },
  knowledge: {
    type: Object as PropType<Indexable>,
    default: () => {}
  },
  showAction: {
    type: Boolean,
    default: false
  },
});

</script>

<style lang="scss">
.chat-tab {
  .console-header {
    display: none;
  }
  .console-content {
    padding: 0 !important;
  }

  .chat-section {
    height: calc(100vh - 98px);
  }
}

.full-screen-page {
  .chat-tab {
    .chat-section {
      height: calc(100vh - 42px);

      header.header {
        padding-top: 1rem;
      }
    }
  }
}
</style>
