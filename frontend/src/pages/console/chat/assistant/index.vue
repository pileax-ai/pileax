<template>
  <o-split-page ref="pageRef"
                class="page-assistant-chat">
    <template #horizontal-side>
      <o-assistant-chat enable-upload @expand="pageRef?.expandHorizontalSide" />
    </template>
    <template #vertical-side>
      <chat-session-list />
    </template>

    <chat-session />
  </o-split-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import OAssistantChat from 'components/chat/OAssistantChat.vue';
import OSplitPage from 'core/page/template/OSplitPage.vue';
import ChatSession from './session.vue';
import ChatSessionList from './session-list.vue';

const pageRef = ref<InstanceType<typeof OSplitPage>>();
</script>

<style lang="scss">
.page-assistant-chat {
}
</style>
