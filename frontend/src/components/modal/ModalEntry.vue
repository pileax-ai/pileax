<template>
  <section>
    <ai-provider-search-dialog v-if="type === 'ai-provider-search'" />
    <chat-to-note-dialog v-if="type === 'chat-note-select'" />
    <note-search-dialog v-if="type === 'note-search'" />
    <tips-dialog v-if="type === 'tips'" />
    <signin-dialog v-if="type === 'signin'" />
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
import SigninDialog from './SigninDialog.vue';

const componentStore = useComponentStore();

const type = computed(() => componentStore.dialog.type);

watch(() => type.value, (newValue) => {
  // console.log('type', type);
})
</script>

<style lang="stylus">
</style>
