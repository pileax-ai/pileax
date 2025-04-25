<template>
  <q-page class="o-note-page">
    <q-splitter v-model="splitterPercent"
                :limits="[0, 50]"
                separator-class="bg-accent"
                :separator-style="`width: ${splitterPercent ? 6 : 0}px;`"
                reverse>
      <template #before>
        <slot></slot>
      </template>

      <template #after>
        <note-chat @close="toggleSide" />
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from 'vue';
import NoteChat from 'components/note/NoteChat.vue'

const props = defineProps({
  contentClass: {
    type: String,
    default: 'bg-accent'
  }
});
const splitterPercent = ref(0);

function toggleSide() {
  splitterPercent.value = splitterPercent.value ? 0 : 30;
}

defineExpose({
  toggleSide
})
</script>

<style lang="scss">
.o-note-page {
  .q-splitter {
    height: 100vh;
  }
}
</style>
