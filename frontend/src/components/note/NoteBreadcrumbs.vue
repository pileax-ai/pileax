<template>
  <section class="note-breadcrumbs">
    <q-breadcrumbs gutter="none">
      <q-breadcrumbs-el class="text-tips" v-if="currentNote.scope === 2">
        <div class="row items-center q-mr-xs">
          <q-icon name="o_workspaces" />
        </div>
        <o-tooltip position="bottom" :delay="800">
          {{ workspace.name }}
        </o-tooltip>
      </q-breadcrumbs-el>
      <template v-for="(item, index) in links" :key="index">
        <q-breadcrumbs-el :to="`/note/${item.id}`"
                          :class="{ 'is-icon': isIcon(item.icon || '') }"
                          class="text-tips">
          <q-icon :name="item.icon || NoteDefaultIcon" />
          <div class="label">
            {{ item.title }}
          </div>
          <o-tooltip position="bottom" :delay="800">
            {{ item.title }}
          </o-tooltip>
        </q-breadcrumbs-el>
      </template>
      <q-breadcrumbs-el :to="`/note/${currentNote.id}`"
                        :class="{ 'is-icon': isIcon(currentNote.icon || '') }"
                        class="text-tips">
        <q-icon :name="currentNote.icon || NoteDefaultIcon" />
        <div class="label">
          {{ currentNote.title || 'New page' }}
        </div>
        <o-tooltip position="bottom" :delay="800">
          {{ currentNote.title || 'New page' }}
        </o-tooltip>
      </q-breadcrumbs-el>
    </q-breadcrumbs>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Note } from 'src/types/note'
import { isIcon } from 'core/utils/misc'
import { NoteDefaultIcon } from 'core/constants/constant'
import useNote from 'src/hooks/useNote'
import useWorkspace from 'src/hooks/useWorkspace'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
})

const { notes, currentNote } = useNote()
const { workspace } = useWorkspace()

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
  .label {
    max-width: max(15vw, 100px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  a {
    padding: 2px 4px;

    &:hover {
      background: var(--q-accent);
      border-radius: 4px;
    }

    .q-icon {
      margin-top: -6px;
      margin-right: 4px;
    }
    .is-icon {
      .q-icon {
        margin-top: -2px;
      }
    }
  }

  .q-breadcrumbs__separator {
    margin: 0 2px;
    opacity: 0.3;
  }
}
</style>
