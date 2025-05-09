<template>
  <o-split-page ref="pageRef"
                class="page-assistant-chat">
    <template #vertical-side>
      <chat-session-list />
    </template>
    <template #horizontal-side>
      <o-assistant-chat enable-upload
                        :loading="sessionRef?.isLoading"
                        @send="sessionRef?.onSend"
                        @stop="sessionRef?.onStop"
                        @expand="pageRef?.expandHorizontalSide" />
    </template>

    <router-view v-slot="{ Component, route }">
      <keep-alive>
        <component ref="sessionRef"
                   :is="Component"
                   :key="route.path" />
      </keep-alive>
    </router-view>
  </o-split-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import OAssistantChat from 'components/chat/OAssistantChat.vue';
import OSplitPage from 'core/page/template/OSplitPage.vue';
import ChatSession from './session/index.vue';
import ChatSessionList from './session-list.vue';
import { ChatInput } from 'src/types/chat'

const pageRef = ref<InstanceType<typeof OSplitPage>>();
const sessionRef = ref<InstanceType<typeof ChatSession>>();

function onSend(data: ChatInput) {
  console.log('send', data, sessionRef);
  sessionRef.value?.onSend(data);
}
</script>

<style lang="scss">
.page-assistant-chat {
}
</style>
