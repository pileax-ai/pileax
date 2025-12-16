<template>
  <section class="note-breadcrumbs">
    <q-breadcrumbs gutter="none">
      <template v-for="(item, index) in links" :key="index">
        <q-breadcrumbs-el :icon="item.icon || NoteDefaultIcon"
                          :label="item.title"
                          :to="`/note/${item.id}`"
                          :class="{ 'is-icon': isIcon(item.icon || '') }"
                          class="text-tips" />
      </template>
      <q-breadcrumbs-el :icon="currentNote.icon || NoteDefaultIcon"
                        :label="currentNote.title"
                        :to="`/note/${currentNote.id}`"
                        :class="{ 'is-icon': isIcon(currentNote.icon || '') }"
                        class="text-tips" />
    </q-breadcrumbs>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useNote from 'src/hooks/useNote'
import type { Note } from 'src/types/note'
import { isIcon } from 'core/utils/misc'
import { NoteDefaultIcon } from 'core/constants/constant'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
})

const { notes, currentNote } = useNote()

const links = computed(() => {
  const list: Note[] = []
  let note: Note | undefined = notes.value.find((item) => item.id === props.id)
  if (!note) {
    return list
  }

  while (note.parent) {
    note = notes.value.find((item) => item.id === note?.parent)
    if (note?.id) {
      list.unshift(note)
    } else {
      break
    }
  }
  return list
})
</script>

<style lang="scss">
.note-breadcrumbs {
  .q-icon {
    margin-top: -6px;
    margin-right: 4px;
  }
  .is-icon {
    .q-icon {
      margin-top: -2px;
    }
  }

  a {
    padding: 2px 4px;

    &:hover {
      background: var(--q-accent);
      border-radius: 4px;
    }
  }
}
</style>
