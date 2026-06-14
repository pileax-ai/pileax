<template>
  <reader-side-view class="reader-note-view" header-class="justify-between text-readable">
    <template #header>
      <section class="col row items-center">
        <q-icon name="o_article" size="20px" />
        <span class="q-px-sm">
          {{ $t('note._') }}
        </span>
      </section>

      <section class="col-auto">
        <q-btn icon="mdi-tune-variant" class="o-toolbar-btn" flat @click="onEditMeta" />
        <q-btn icon="close" class="o-toolbar-btn" flat @click="emit('close')" />
      </section>
    </template>

    <book-note dense />

    <footer class="meta" :class="{ expand: showMeta }">
      <book-note-meta v-model="showMeta" v-if="note.type === 'note'" />
      <book-annotation v-model="showMeta" v-else-if="note.type === 'annotation'" />
    </footer>
  </reader-side-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import ReaderSideView from '../ReaderSideView.vue'
import BookNote from './note.vue'
import BookNoteMeta from './meta.vue'
import BookAnnotation from './annotation.vue'

import useBookNote from 'src/hooks/useBookNote'

const emit = defineEmits(['close'])

const {
  note,
} = useBookNote()

const showMeta = ref(false)

function onEditMeta() {
  showMeta.value = !showMeta.value
}
</script>

<style lang="scss">
.reader-note-view {

  footer.meta {
    position: absolute;
    left: 8px;
    right: 8px;
    bottom: 8px;
    z-index: -1;

    &.expand {
      z-index: 1;
    }
  }
}

</style>
