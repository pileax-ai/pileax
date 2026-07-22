<template>
  <o-common-dialog class="note-import-dialog dialog-theme"
                   :show="dialog.type === 'note-import'"
                   :ok="$t('import')"
                   :content-style="style"
                   @close="onHide"
                   @ok="onImport">
    <header class="row justify-center items-center" v-touch-pan.prevent.mouse="onPan">
      <q-icon name="mdi-arrow-collapse-up" />
    </header>
    <section class="content">
      <div class="meta">
        <o-view-item icon="o_article" :label="$t('note._')" clickable>
          <template #value>
            <div class="row">
              <o-icon :name="note.icon" v-if="note.icon" />
              <span :class="{ 'q-ml-xs': note.icon }">{{ note.title || 'Untitled' }}</span>
            </div>
          </template>
        </o-view-item>
      </div>
      <o-file-uploader accept=".md,.txt"
                       :maxSize="10 * 1024 * 1024"
                       reset local
                       @ready="onReady" />
    </section>
  </o-common-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import OCommonDialog from 'core/components/dialog/OCommonDialog.vue'
import useDialog from 'core/hooks/useDialog'
import useNote from 'src/hooks/useNote'
import OFileUploader from 'core/components/fIle/OFileUploader.vue'
import type { Chat } from 'src/types/chat'

const { dialog, onHide } = useDialog()
const { setChatToNote, addNote } = useNote()
const pos = reactive({ x: 0, y: 0 })

const note = computed(() => {
  return dialog.value.note
})

const style = computed(() => {
  return {
    minWidth: '600px',
    maxWidth: '640px',
    padding: '0px',
    transform: `translate(${pos.x}px, ${pos.y}px)`
  }
})

const onPan = (evt: any) => {
  pos.x += evt.delta.x
  pos.y += evt.delta.y
}

const onReady = (file: File) => {
  const fileName = file.name

  const reader = new FileReader()
  reader.onload = (e: ProgressEvent<FileReader>) => {
    const result = e.target?.result
    if (typeof result === 'string') {
      onImport(fileName, result)
    }
  }
  reader.onerror = (err) => {
    console.error('Error reading file:', err)
  }
  reader.readAsText(file)
}

const onImport = (title: string, content: string) => {
  setChatToNote({
    message: title,
    content: content
  } as Chat)
  addNote({ parent: note.value.id, source: 'chat' })
}
</script>

<style lang="scss">
@import "./dialog-theme";
.note-import-dialog {
  .q-banner {
    &__avatar {
      align-self: center;
    }
  }
  .content {
    .meta {
      padding: 0 0 1rem 0;

      .o-view-item {
        min-height: 42px;
        padding: 0 1rem;
        .labels {
          margin-left: 1rem;
        }
      }
    }
  }
}
</style>
