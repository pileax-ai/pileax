<template>
  <reader-side-view class="book-note-view" header-class="justify-between text-readable">
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
import { computed, onMounted, ref, watch } from 'vue'
import { Editor } from '@tiptap/core'

import ReaderSideView from '../ReaderSideView.vue'
import BookNote from './note.vue'
import BookNoteMeta from './meta.vue'
import BookAnnotation from './annotation.vue'

import useBook from 'src/hooks/useBook'
import useBookNote from 'src/hooks/useBookNote'
import { bookAnnotationService, fileService } from 'src/api/service/remote'
import useSetting from 'core/hooks/useSetting'
import useApi from 'src/hooks/useApi'

const emit = defineEmits(['close'])

const { darkMode, locale } = useSetting()
const { getFileUrl } = useApi()
const { progress } = useBook()
const {
  bookId,
  note,
  noteId,
  setCurrentNote,
  saveNote,
  saveNoteRemote
} = useBookNote()

const showMeta = ref(false)


function onEditMeta() {
  showMeta.value = !showMeta.value
}
</script>

<style lang="scss">
.book-note-view {
  .yiitap {
    .tiptap {
      font-size: 85% !important;

      h1 {
        font-size: 1.8rem;
      }
    }
  }


  .tippy-box {
    background: none!important;
  }

  .ProseMirror {
    padding-inline: 0!important;
  }

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

.slash-tippy, .tippy {
  .tippy-box {
    background: none!important;
  }

  .tippy-content {
    background: none!important;
  }
}
</style>
