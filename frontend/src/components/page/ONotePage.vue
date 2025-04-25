<template>
  <q-page class="o-note-page">
    <q-splitter v-model="width"
                :limits="[0, 50]"
                separator-class="bg-accent"
                :separator-style="`width: ${width ? 6 : 0}px;`"
                reverse
                @update:modelValue="onWidthChanged">
      <template #before>
        <slot></slot>
      </template>

      <template #after>
        <note-chat @close="toggleSide" :note-id="noteId" v-if="noteId" />
        <slot name="side"></slot>
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup lang="ts">
import { onActivated, ref } from 'vue'
import NoteChat from 'components/note/NoteChat.vue';
import useNote from 'src/hooks/useNote'

const props = defineProps({
  contentClass: {
    type: String,
    default: 'bg-accent'
  }
});
const { noteStore } = useNote();
const width = ref(0);
const noteId = ref('');

function toggleSide() {
  width.value = width.value ? 0 : 30;
  noteStore.setChatWidth(width.value);
}

function refreshChat(id: string) {
  noteId.value = id;
}

function onWidthChanged(value: number) {
  noteStore.setChatWidth(value);
}

onActivated(() => {
  width.value = noteStore.chatWidth;
})

defineExpose({
  toggleSide,
  refreshChat
})
</script>

<style lang="scss">
.o-note-page {
  .q-splitter {
    height: 100vh;
  }
}
</style>
