<template>
  <q-layout view="lHh lpr lFf" container class="bg-secondary note-chat">
    <q-header class="bg-secondary text-info header">
      <q-toolbar>
        <q-toolbar-title class="text-bold">
          <q-icon name="mdi-creation" />
        </q-toolbar-title>
        <q-btn icon="delete_sweep" flat round dense />
        <q-btn icon="close" flat round dense @click="emit('close')" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="bg-secondary">
        <chat-section ref-type="chat"
                      :ref-id="noteId"
                      description="基于笔记问答"
                      tag="基于笔记" dense>
        </chat-section>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import ChatSection from 'components/chat/ChatSection.vue'

const props = defineProps({
  noteId: {
    type: String,
    default: ''
  },
});
const emit = defineEmits(['close']);
</script>

<style lang="scss">
.note-chat {
  height: calc(100vh - 40px);

  .q-toolbar {
    min-height: 40px;
    .q-toolbar__title {
      font-size: 1rem;
    }

    .q-icon {
      font-size: 1.2rem;
    }
    border-bottom: solid 1px var(--q-accent);
  }
}
</style>
