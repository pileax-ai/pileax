<template>
  <o-split-page class="o-note-page"
                v-model:show="showSide"
                :init-size="400"
                :max-size="800"
                @size="onWidthChanged"
                reverse>
    <template #before>
      <slot></slot>
    </template>

    <template #after>
      <note-chat @close="toggleSide" :note-id="noteId" v-if="noteId" />
      <slot name="side"></slot>
    </template>
  </o-split-page>
</template>

<script setup lang="ts">
import { onActivated, ref } from 'vue'
import OSplitPage from 'core/page/template/OSplitPage.vue'
import NoteChat from 'components/note/NoteChat.vue'
import useNote from 'src/hooks/useNote'

const props = defineProps({
  contentClass: {
    type: String,
    default: 'bg-accent'
  }
})
const { noteStore } = useNote()
const showSide = ref(false)
const width = ref(0)
const noteId = ref('')

function toggleSide() {
  showSide.value = !showSide.value
}

function refreshChat(id: string) {
  noteId.value = id
}

function onWidthChanged(value: number) {
  noteStore.value.setChatWidth(value)
}

onActivated(() => {
  width.value = noteStore.value.chatWidth
})

defineExpose({
  toggleSide,
  refreshChat
})
</script>

<style lang="scss">
.o-note-page {
}
</style>
