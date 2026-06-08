<template>
  <section class="book-note-view">
    <book-note v-if="noteId"></book-note>
    <section class="row col-12 justify-center book-note-list" v-else>
      <section class="note-header ellipsis">
        {{ book.title }}
      </section>
      <q-list class="note-list" bordered separator v-if="recentNotes.length">
        <template v-for="(item, index) in recentNotes" :key="index">
          <o-common-item icon="article"
                         :label="item.title"
                         clickable right-side
                         @click="openNote(item.id)"
                         v-if="index < 10">
            <template #side>
              <div class="row items-center">
                {{ timeMulti(item.updateTime).fromNow() }}
                <q-icon name="chevron_right" size="1.2rem" class="q-ml-md" />
              </div>
            </template>
          </o-common-item>
        </template>
      </q-list>
      <o-no-data class="col-12" image v-else>
        <q-btn icon="add"
               label="New note"
               class="bg-primary text-white"
               @click="onNewNote" />
      </o-no-data>
    </section>
  </section>
</template>

<script setup lang="ts">
import BookNote from 'components/reader/note/note.vue'

import 'js/ebook.js'
import useBook from 'src/hooks/useBook'
import useBookNote from 'src/hooks/useBookNote'
import { UUID } from 'core/utils/crypto'
import { timeMulti } from 'core/utils/dayjs'
import { computed } from 'vue'

const { book } = useBook()
const { noteId, notes, openNote } = useBookNote()

const recentNotes = computed(() => {
  return notes.value.slice().sort((a, b) => {
    const timeA = new Date(a.updateTime).getTime()
    const timeB = new Date(b.updateTime).getTime()
    return timeB - timeA
  })
})

function onNewNote() {
  openNote(UUID())
}
</script>

<style lang="scss">
.book-note-view {
  width: 100%;
  max-width: 800px;

  .note-header {
    width: 100%;
    max-width: 800px;
    font-size: 2rem;
    font-weight: bold;
    padding: 12px 0 24px 0;
    text-align: center;
  }
  .note-list {
    width: 100%;
    max-width: 800px;
    border-radius: 10px;

    .q-item {
      padding: 0 12px;
      &:first-child {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
      &:last-child {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
      }
    }

  }
}
</style>
