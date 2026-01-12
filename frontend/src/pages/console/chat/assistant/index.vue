<template>
  <o-split-side-page ref="pageRef"
                class="page-assistant-chat"
                @side-width="onSideWidth">
    <template #vertical-side>
      <chat-conversation-list />
    </template>
    <template #horizontal-side>
      <o-assistant-chat enable-upload
                        :loading="conversationRef?.isLoading"
                        @send="conversationRef?.onSend"
                        @stop="conversationRef?.onStop"
                        @expand="pageRef?.expandHorizontalSide" />
    </template>

    <router-view v-slot="{ Component, route }">
      <keep-alive>
        <component ref="conversationRef"
                   :is="Component"
                   :key="route.path" />
      </keep-alive>
    </router-view>
  </o-split-side-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import OAssistantChat from 'components/chat/OAssistantChat.vue'
import OSplitSidePage from 'core/page/template/OSplitSidePage.vue'
import type ChatConversation from './conversation/index.vue'
import ChatConversationList from './conversation-list.vue'

const pageRef = ref<InstanceType<typeof OSplitSidePage>>()
const conversationRef = ref<InstanceType<typeof ChatConversation>>()
const sideWidth = ref(320)
const sideHeight = ref(160)

function onSideWidth(value: number) {
  sideWidth.value = value
}
</script>

<style lang="scss">
.page-assistant-chat {
}
</style>
