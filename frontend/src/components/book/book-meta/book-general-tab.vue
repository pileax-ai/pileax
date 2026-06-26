<template>
  <div class="book-general-tab">
    <book-general-viewer :book-id="bookId"
                         @edit="onEdit"
                         v-if="view === 'view'">
    </book-general-viewer>
    <book-general-editor :book-id="bookId"
                         @view="onView"
                         v-if="view === 'edit'">
    </book-general-editor>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import BookGeneralEditor from './book-general-editor.vue'
import BookGeneralViewer from './book-general-viewer.vue'

const props = defineProps({
  bookId: {
    type: String,
    default: ''
  },
})

const view = ref('view')

function onView() {
  view.value = 'view'
}

function onEdit() {
  view.value = 'edit'
}
</script>

<style lang="scss">
.book-general-tab {
  .o-simple-form {
    padding: 0 1rem;
  }
}
</style>
