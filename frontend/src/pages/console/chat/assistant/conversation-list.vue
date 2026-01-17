<template>
  <section class="assistant-chat-conversation-list">
    <header class="row justify-between items-center header">
      <div class="text-bold">{{ $t('chat.conversations') }}</div>
      <div>
        <q-btn icon="more_horiz" class="pi-toolbar-btn" flat v-if="false" />
      </div>
    </header>

    <chat-conversations ref="conversationsRef"
                        :max-width="maxWidth"
                        :active-id="currentMenu.id"
                        @open="openConversation" />
  </section>
</template>

<script setup lang="ts">
import { onActivated, onMounted, ref, watch } from 'vue'
import type { ChatConversation } from 'src/types/chat'
import { router } from 'src/router'
import useChatConversation from 'src/hooks/useChatConversation'
import useNavi from 'src/hooks/useNavi'
import ChatConversations from 'components/chat/ChatConversations.vue'

defineProps({
  maxWidth: {
    type: Number,
    default: 300
  },
})
const { conversationTimer } = useChatConversation()
const { currentMenu } = useNavi()

const conversationsRef = ref<InstanceType<typeof ChatConversations>>()

function openConversation(item: ChatConversation) {
  console.log('open', item)
  router.push({name: 'chat-conversation',
    params: {appId: item.appId, id: item.id}})
}

watch(() => conversationTimer.value, (newValue) => {
  conversationsRef.value?.refresh()
})

onMounted(() => {
  // console.log('mounted: conversation list')
})

onActivated(() => {
  conversationsRef.value?.refresh()
})
</script>

<style lang="scss">
.assistant-chat-conversation-list {
  .header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    padding: 0 10px;
    z-index: 1;
    background: var(--q-secondary);
  }

  .chat-conversations {
    position: absolute;
    top: 40px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: scroll;
    .group {
      position: sticky;
    }
  }

  .o-navi-item {
    border-radius: 4px;
    margin-bottom: 2px;

    &:before {
      border-radius: 4px;
    }
  }
}
</style>
