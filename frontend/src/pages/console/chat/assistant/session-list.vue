<template>
  <section class="assistant-chat-session-list">
    <header class="row justify-between items-center header">
      <div>话题</div>
      <div>
        <q-btn icon="more_horiz" class="pi-toolbar-btn" flat v-if="false" />
      </div>
    </header>

    <chat-sessions ref="sessionsRef"
                   :max-width="maxWidth"
                   :active-id="currentMenu.id"
                   @open="openSession" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
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
  router.push({name: 'chat-session',
    params: {assistant: item.assistant, id: item.id}});
}

watch(() => sessionTimer.value, (newValue) => {
  sessionsRef.value?.refresh();
})

onMounted(() => {
  console.log('mounted: session list')
})
</script>

<style lang="scss">
.assistant-chat-session-list {
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

  .chat-sessions {
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
