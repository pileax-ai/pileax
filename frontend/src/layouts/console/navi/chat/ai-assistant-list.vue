<template>
  <section class="ai-assistant-list fit" :style="`max-width: ${maxWidth}px`">
    <q-expansion-item label="聊天助手"
                      header-class="o-navi-item text-readable"
                      default-opened>
      <q-btn icon="add" label="添加助手" class="bg-dark add" flat />
    </q-expansion-item>
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
.ai-assistant-list {
  padding: 0 8px;
  .add {
    width: 100%;
  }
}
</style>
