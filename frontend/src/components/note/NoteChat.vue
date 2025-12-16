<template>
  <q-layout view="lHh lpr lFf" container class="bg-secondary note-chat">
    <q-header class="bg-secondary text-info header">
      <q-toolbar>
        <q-toolbar-title class="text-bold">
          <q-icon name="mdi-creation" />
        </q-toolbar-title>
        <o-chat-toc ref="tocRef" :chats="chats" :mini-view="false">
          <template #trigger>
            <q-btn icon="toc" flat round dense />
          </template>
        </o-chat-toc>
        <q-btn icon="delete_sweep" flat round dense />
        <q-btn icon="close" flat round dense @click="emit('close')" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="bg-secondary">
        <chat-section ref-type="note"
                      :ref-id="noteId"
                      :description="$t('ai.basedOnNote')"
                      :tag="$t('ai.basedOnNote')"
                      dense @chats="onChats">
        </chat-section>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import ChatSection from 'components/chat/ChatSection.vue'
import { ref } from 'vue'
import OChatToc from 'components/chat/OChatToc.vue'

const props = defineProps({
  noteId: {
    type: String,
    default: ''
  },
})
const emit = defineEmits(['close'])

const chats = ref<Indexable[]>([])

const onChats = (value: Indexable[]) => {
  console.log('chats', value)
  chats.value = value
}
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
