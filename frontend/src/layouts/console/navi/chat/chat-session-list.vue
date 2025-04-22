<template>
  <section class="chat-session-list fit" :style="`max-width: ${maxWidth}px`">
    <chat-sessions ref="sessionsRef"
                   :max-width="maxWidth"
                   :active-id="currentMenu.id"
                   @open="openSession" />
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ChatSession } from 'src/types/chat';
import { router } from 'src/router';
import useChatSession from 'src/hooks/useChatSession';
import useNavi from 'src/hooks/useNavi';
import ChatSessions from 'components/chat/ChatSessions.vue';

defineProps({
  maxWidth: {
    type: Number,
    default: 300
  },
});
const { sessionTimer } = useChatSession();
const { currentMenu } = useNavi();

const sessionsRef = ref<InstanceType<typeof ChatSessions>>();

function openSession(item: ChatSession) {
  router.push({name: 'chat-session', params: {id: item.id}});
}

watch(() => sessionTimer.value, (newValue) => {
  sessionsRef.value?.refresh();
})
</script>

<style lang="scss">
.chat-session-list {

}
</style>
