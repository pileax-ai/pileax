<template>
  <section class="note-breadcrumbs">
    <q-breadcrumbs>
      <template v-for="(item, index) in links" :key="index">
        <q-breadcrumbs-el :icon="item.icon"
                          :label="item.title"
                          :to="`/note/${item.id}`"
                          class="text-tips" />
      </template>
      <q-breadcrumbs-el :icon="currentNote.icon || '✍'"
                        :label="currentNote.title"
                        class="text-tips" />
    </q-breadcrumbs>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useNote from 'src/hooks/useNote'
import type { Note } from 'src/types/note'

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

  a {
    //color: var(--q-info);
    padding: 2px 4px;

    &:hover {
      background: var(--q-accent);
      border-radius: 4px;
    }
  }
}
</style>
