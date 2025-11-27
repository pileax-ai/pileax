<template>
  <section class="chat-conversation-list fit" :style="`max-width: ${maxWidth}px`">
    <chat-conversations ref="conversationsRef"
                   :max-width="maxWidth"
                   :active-id="currentMenu.id"
                   @open="openSession" />
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ChatConversation } from 'src/types/chat';
import { router } from 'src/router';
import useChatConversation from 'src/hooks/useChatConversation';
import useNavi from 'src/hooks/useNavi';
import ChatConversations from 'components/chat/ChatConversations.vue';

defineProps({
  maxWidth: {
    type: Number,
    default: 300
  },
});
const { conversationTimer } = useChatConversation();
const { currentMenu } = useNavi();

const conversationsRef = ref<InstanceType<typeof ChatConversations>>();

function openSession(item: ChatConversation) {
  router.push({name: 'chat-conversation', params: {id: item.id}});
}

watch(() => conversationTimer.value, (newValue) => {
  conversationsRef.value?.refresh();
})
</script>

<style lang="scss">
.chat-conversation-list {

}
</style>
