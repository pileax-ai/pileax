<template>
  <o-note-page ref="notePage"
               class="page-note-share"
               :style="`--note-font: ${font}; --note-font-size: ${ styles.smallText ? '85%' : '100%' }`">
    <q-scroll-area class="o-scroll-wrapper" @scroll="onScroll">
      <section class="layout" :class="[pageView]">
        <note-share-cover :key="currentNote.id"
                          :current-note="currentNote"
                    class="layout-full col-12">
        </note-share-cover>

        <section class="layout-content row justify-center note-meta"
                :class="`${pageView} ${currentNote.cover && currentNote.icon ? 'with-cover' : ''}`">
          <section class="note-meta-wrapper">
            <div class="icon text-readable" v-if="currentNote.icon">
              <o-icon :name="currentNote.icon" />
            </div>
          </section>
        </section>

        <section class="layout-content title">
          <q-input ref="title"
                   :model-value="currentNote.title"
                   debounce="100"
                   placeholder="Loading"
                   class=""
                   borderless
                   readonly />
        </section>

        <YiiEditor ref="yiiEditor"
                   class="layout-content"
                   :class="{ 'auto-numbering': styles.autoNumbering }"
                   v-bind="options"
                   @create="onCreate" />

        <aside class="layout-right">
          <div class="sticky-top">
            <o-doc-toc ref="tocRef"
                       :editor="yiiEditor?.editor"
                       :max-level="3" />
          </div>
        </aside>
      </section>
    </q-scroll-area>
  </o-note-page>
</template>

<script setup lang="ts">
import { QInput } from 'quasar'
import { useRoute } from 'vue-router'
import { computed, onActivated, ref, useTemplateRef, watch } from 'vue'
import { Editor } from '@tiptap/core'
import { YiiEditor, ODocToc, OStarterKit } from '@yiitap/vue'
import 'katex/dist/katex.min.css'

import useSetting from 'core/hooks/useSetting'
import type { Note } from 'src/types/note'
import ONotePage from 'components/page/ONotePage.vue'
import NoteShareCover from 'components/note/NoteShareCover.vue'
import { noteShareService } from 'src/api/service/remote'

const route = useRoute()
const { darkMode, locale } = useSetting()

const titleRef = useTemplateRef<QInput>('title')
const notePage = ref<InstanceType<typeof ONotePage>>()
const yiiEditor = ref<InstanceType<typeof YiiEditor>>()
const tocRef = ref<InstanceType<typeof ODocToc>>()
const noteShareId = ref('')
const currentNote = ref<Indexable>({})
const loading = ref(false)
const loaded = ref(false)
const editorReady = ref(false)
const localeAlt = ref(locale.value.toLowerCase())
const pageView = ref('page')

const options = computed(() => {
  return {
    editable: false,
    locale: localeAlt.value,
    darkMode: darkMode.value,
    pageView: pageView.value,
    extensions: [
      OStarterKit.configure(),
      'InlineMath',
      'Markdown',
      'OAiBlock',
      'OAudio',
      'OBlockMath',
      'OColon',
      'OColorHighlighter',
      'ODetails',
      'OEmbed',
      'OImage',
      'OMultiColumn',
      'OShortcut',
      'OVideo',
    ]
  }
})

const editor = computed(() => {
  return yiiEditor.value?.editor
})

const styles: Indexable = computed(() => {
  return currentNote.value.styles || {
    font: 'default',
    smallText: false,
    fullWidth: false,
    toc: true,
  }
})

const font = computed(() => {
  switch (styles.value.font) {
    case 'serif':
      return 'Lyon-Text, Georgia, ui-serif, SimSun, serif'
    case 'mono':
      return 'iawriter-mono, Nitti, Menlo, Courier, monospace'
    default:
      return ''
  }
})

function onCreate() {
  editorReady.value = true
  editor.value?.on('update', onUpdate)

  if (!currentNote.value.title) {
    titleRef.value?.focus()
  }

}

function onUpdate({ editor }: { editor: Editor }) {
  // Only update when editor is ready
  if (!editorReady.value) return
  // console.log('update', editorReady.value, loading.value)

  // When editor is loading content, NO need to update.
  if (loading.value) {
    loading.value = false
  }

  loaded.value = true
}

function onScroll() {
  const event: Event | undefined = undefined
  tocRef.value?.onScroll(event as any)
}

async function getAndLoadNote() {
  loading.value = true
  loaded.value = false
  noteShareService.getDetails(noteShareId.value).then((note: any) => {
    loading.value = false
    loadingNote(note as Note)
  }).catch((err) => {
    if (err.response.status === 404) {
      // 404
    }
  })
}


function loadingNote(note: Note) {
  const docNode = note.content
  let focusPosition = 'start'
  let emitUpdate = false
  loadNote(note, docNode, focusPosition, emitUpdate)
}

function loadNote(note: Note, docNode: Indexable, focus: string,
                  emitUpdate = false) {
  currentNote.value = note
  setContent(docNode, emitUpdate, focus)
}

function setContent (docNode: Indexable, emitUpdate = false, focus = 'start') {
  editor.value?.commands.setContent(docNode, { emitUpdate })

  if (focus !== 'none') {
    editor.value?.commands.focus(focus as 'start')
  }
}

watch(locale, (newValue) => {
  localeAlt.value = newValue.toLowerCase()
})

onActivated(() => {
  noteShareId.value = route.params.id as string

  getAndLoadNote()
})
</script>

<style lang="scss">
.page-note-share {
  .yiitap {
    .editor-content {
      padding: 16px 0;
    }

    .tiptap {
      font-family: var(--note-font), serif !important;
      font-size: var(--note-font-size) !important;
    }
  }

  .o-scroll-wrapper {
    .layout {
      display: grid;
      grid-template-rows:
        auto
        1fr;

      &.page {
        grid-template-columns:
          [full-start] minmax(50px, 1fr)
          [content-start] minmax(400px, 900px)
          [content-end] minmax(50px, 1fr)
          [full-end];
      }

      &.full {
        grid-template-columns:
          [full-start] minmax(0, 50px)
          [content-start] 1fr
          [content-end] minmax(0, 50px)
          [full-end];
      }
    }

    .layout-full {
      grid-column: full;
    }

    .layout-content {
      grid-column: content;
    }

    .layout-right {
      position: sticky;
      top: 0;
      grid-column: content-end / full-end;
      grid-row: 2;

      .sticky-top {
        position: sticky;
        top: 0;
      }
      .o-doc-toc {
        position: absolute;
        right: 20px;
      }
    }

    .title {
      margin-top: 10px;
      padding-inline: 54px;
      font-family: var(--note-font), serif !important;
      .q-field {
        &__native {
          font-size: 2.85rem;
          font-weight: 600;
          line-height: 1.2;

          &::placeholder {
            color: rgba(0, 0, 0, 0.2);
          }
        }

        &__control {
          padding: 0;
        }
      }
    }

    .note-cover {
      height: 280px;
    }

    .note-meta {
      z-index: 1;
      &.with-cover {
        margin-top: -40px;
      }

      .note-meta-wrapper {
        width: 100%;
        padding-inline: 54px;

        .icon {
          width: 80px;
          height: 80px;
          font-size: 80px;
          line-height: 1.1;
          &:hover {
            background: rgba(0,0,0,0.1);
            border-radius: 4px;
            cursor: pointer;
          }

          .o-icon {
            font-size: 80px;
            line-height: 1.1;
          }
        }
        .q-btn {
          padding: 0 8px;

          .on-left {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
