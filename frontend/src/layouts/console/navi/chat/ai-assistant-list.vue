<template>
  <section class="ai-assistant-list fit" :style="`max-width: ${maxWidth}px`">
    <q-expansion-item :label="$t('chats.assistants')"
                      header-class="o-navi-item text-readable"
                      default-opened>
      <q-btn icon="add" :label="$t('chats.assistant.add')" class="bg-dark add" flat />
    </q-expansion-item>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ChatConversation } from 'src/types/chat'
import { router } from 'src/router'
import useChatConversation from 'src/hooks/useChatConversation'
import useNavi from 'src/hooks/useNavi'
import type ChatConversations from 'components/chat/ChatConversations.vue'

defineProps({
  maxWidth: {
    type: Number,
    default: 300
  },
})
const { conversationTimer } = useChatConversation()
const { currentMenu } = useNavi()

const conversationsRef = ref<InstanceType<typeof ChatConversations>>()

function openSession(item: ChatConversation) {
  router.push({name: 'chat-conversation', params: {id: item.id}})
}

watch(() => conversationTimer.value, (newValue) => {
  conversationsRef.value?.refresh()
})
</script>

<style lang="scss">
.ai-assistant-list {
  padding: 0 8px;
  .add {
    width: 100%;
  }
}
</style>
