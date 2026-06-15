<template>
  <o-common-dialog class="note-export-dialog dialog-theme"
                   :show="dialog.type === 'note-export'"
                   :ok="$t('export')"
                   :content-style="style"
                   @close="onHide"
                   @ok="onExport"
                   show-cancel show-ok>
    <header class="row justify-center items-center" v-touch-pan.prevent.mouse="onPan">
      <q-icon name="mdi-arrow-collapse-down" />
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
        <o-view-item icon="o_dataset" :label="$t('note.format')">
          <template #value>
            <q-btn-toggle
              v-model="format"
              color="accent"
              text-color="readable"
              toggle-color="primary"
              toggle-text-color="white"
              unelevated
              size="12px"
              :options="NoteFormats"
            />
          </template>
        </o-view-item>
      </div>
    </section>
  </o-common-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import OCommonDialog from 'core/components/dialog/OCommonDialog.vue'
import useDialog from 'core/hooks/useDialog'
import useCommon from 'core/hooks/useCommon'
import useNote from 'src/hooks/useNote'

const { dialog, onHide, onOk } = useDialog()
const { t } = useCommon()
const { exportMarkdown } = useNote()
const pos = reactive({ x: 0, y: 0 })
const format = ref('markdown')

const note = computed(() => {
  return dialog.value.note
})

const editor = computed(() => {
  return dialog.value.editor
})

const style = computed(() => {
  return {
    minWidth: '600px',
    maxWidth: '640px',
    padding: '0px',
    transform: `translate(${pos.x}px, ${pos.y}px)`
  }
})

const NoteFormats = computed(() => {
  return [
    { label: 'Markdown', value: 'markdown', },
    // { label: 'PDF', value: 'pdf', },
    // { label: 'DOCX', value: 'docx', },
  ]
})

const onPan = (evt: any) => {
  pos.x += evt.delta.x
  pos.y += evt.delta.y
}

const onExport = () => {
  const markdownSerializer = editor.value?.markdown
  const markdown = markdownSerializer?.serialize(editor.value!.getJSON())
  exportMarkdown(note.value.title || 'Untitled', markdown)
  onOk()
}
</script>

<style lang="scss">
@import "./dialog-theme";
.note-export-dialog {
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
