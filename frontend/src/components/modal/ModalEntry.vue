<template>
  <section>
    <note-search-dialog v-if="type === 'note-search'" />
    <chat-to-note-dialog v-if="type === 'chat-note-select'" />
    <ai-provider-search-dialog v-if="type === 'ai-provider-search'" />
    <tips-dialog v-if="type === 'tips'" />
    <o-settings-dialog v-if="type === 'settings'" />
  </section>
</template>

<script setup lang="ts">
import {computed, watch} from 'vue';
import { useComponentStore } from 'stores/component';

import OSettingsDialog from 'src/components/settings/OSettingsDialog.vue';
import AiProviderSearchDialog from './AiProviderSearchDialog.vue';
import ChatToNoteDialog from './ChatToNoteDialog.vue';
import NoteSearchDialog from './NoteSearchDialog.vue';
import TipsDialog from './TipsDialog.vue';

const componentStore = useComponentStore();

const type = computed(() => componentStore.dialog.type);

watch(() => type.value, (newValue) => {
  // console.log('type', type);
})
</script>

<style lang="stylus">
</style>
