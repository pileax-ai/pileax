<template>
  <section>
    <ai-provider-search-dialog v-if="type === 'ai-provider-search'" />
    <book-collection-dialog v-if="type === 'book-collection'" />
    <chat-to-note-dialog v-if="type === 'chat-note-select'" />
    <guide-dialog v-if="type === 'guide'" />
    <note-search-dialog v-if="type === 'note-search'" />
    <signin-dialog v-if="type === 'signin'" />
    <tips-dialog v-if="type === 'tips'" />
    <o-settings-dialog v-if="type === 'settings'" />
    <o-note-history-dialog v-if="type === 'note-history'" />
  </section>
</template>

<script setup lang="ts">
import {computed, watch} from 'vue'
import { useComponentStore } from 'stores/component'

import AiProviderSearchDialog from './AiProviderSearchDialog.vue'
import BookCollectionDialog from './BookCollectionDialog.vue'
import ChatToNoteDialog from './ChatToNoteDialog.vue'
import GuideDialog from './GuideDialog.vue'
import NoteSearchDialog from './NoteSearchDialog.vue'
import SigninDialog from './SigninDialog.vue'
import TipsDialog from './TipsDialog.vue'

import OSettingsDialog from 'src/components/settings/OSettingsDialog.vue'
import ONoteHistoryDialog from 'src/components/note/o-note-history-dialog/index.vue'

const componentStore = useComponentStore()

const type = computed(() => componentStore.dialog.type)

watch(() => type.value, (newValue) => {
  // console.log('type', type);
})
</script>

<style lang="stylus">
</style>
