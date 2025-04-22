<template>
  <q-layout view="lHh lpr lFf" container class="bg-secondary note-chat">
    <q-header class="bg-secondary text-info header">
      <q-toolbar>
        <q-toolbar-title class="text-bold">
          <q-icon name="public" />
        </q-toolbar-title>
        <q-btn icon="delete_sweep" flat round dense />
        <q-btn icon="close" flat round dense @click="emit('close')" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="bg-secondary">
        <section class="row col-12 justify-center">
          <section class="chat-list">
            <template v-for="(item, index) in chats" :key="index">
              <o-chat-message :chat="item"
                              align-right @like="onLike($event, index)" />
            </template>

            <template v-if="isLoading">
              <o-chat-message :chat="newChat"
                              align-right
                              :streaming="isLoading" />
            </template>
          </section>
        </section>
      </q-page>
    </q-page-container>

    <q-footer class="bg-secondary text-info">
      <o-chat-input dense />
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import useNote from 'src/hooks/useNote';
import useStream from 'src/hooks/useStream';

import OChatInput from 'components/chat/OChatInput.vue';
import OChatMessage from 'components/chat/OChatMessage.vue'

const emit = defineEmits(['close']);

const { isLoading, startStream, cancelStream } = useStream();

const start = ref(true);
const chats = ref<Indexable[]>([]);
const newChat = ref<Indexable>({})
const showScrollBtn = ref(false);

function onLike(item: Indexable, index: number) {
  chats.value.splice(index, 1, item);
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
  }

  .q-footer {
    padding: 1rem;
  }
}
</style>
