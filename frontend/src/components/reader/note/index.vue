<template>
  <reader-side-view class="book-note" header-class="justify-between text-readable">
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

    <q-scroll-area class="o-scroll-wrapper">
      <YiiEditor ref="yiiEditor"
                 class="layout-content"
                 v-bind="options"
                 :key="editorKey"
                 @create="onCreate" />
    </q-scroll-area>

    <footer class="meta">
      <book-note-meta v-model="showMeta" v-if="note.type === 'note'" />
      <book-annotation v-model="showMeta" v-else-if="note.type === 'annotation'" />
    </footer>
  </reader-side-view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Editor } from '@tiptap/core'

import ReaderSideView from '../ReaderSideView.vue'
import BookNoteMeta from './meta.vue'
import BookAnnotation from './annotation.vue'

import useBook from 'src/hooks/useBook'
import useBookNote from 'src/hooks/useBookNote'
import { bookAnnotationService, fileService } from 'src/api/service/remote'
import {
  AnyExtension,
  DefaultBlockMenuOptions,
  OStarterKit,
  OUploadManager,
  YiiEditor
} from '@yiitap/vue'
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

const yiiEditor = ref<InstanceType<typeof YiiEditor>>()
const loading = ref(false)
const loaded = ref(false)
const localeAlt = ref(locale.value.toLowerCase())
const editorReady = ref(false)
const showMeta = ref(false)

const editorKey = computed(() => {
  return `normal-${noteId.value}`
})
const options = computed(() => {
  return {
    editable: true,
    title: true,
    locale: localeAlt.value,
    darkMode: darkMode.value,
    showBubbleMenu: true,
    sideMenu: {
      show: false,
    } as any,
    pageView: 'full',
    extensions: [
      OStarterKit.configure(),
      OUploadManager.configure({
        onUpload: onUpload,
      }),
      'InlineMath',
      'Markdown',
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
    ] as AnyExtension[]
  }
})

const editor = computed(() => {
  return yiiEditor.value?.editor
})

const markdown = computed(() => {
  return editor.value?.markdown
})

function onUpload(file: File, type: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const ref = {
      refId: noteId.value,
      refType: 'note'
    }
    fileService.upload(file, ref).then(res => {
      resolve(getFileUrl(res.url))
    }).catch(err => {
      reject(new Error('Failed to upload'))
    })
  })
}

function onCreate() {
  editorReady.value = true
  editor.value?.on('update', onUpdate)
}

function onUpdate({ editor }: { editor: Editor }) {
  // Only update when editor is ready
  if (!editorReady.value) return
  // console.log('update', editorReady.value, loading.value)

  // When editor is loading content, NO need to update.
  if (loading.value) {
    loading.value = false
  } else {
    updateNote()
  }

  loaded.value = true
}

function parseTitle (noteJson: any) {
  let title = ''
  const content = noteJson.content
  if (content && content.length > 0) {
    const c = content[0].content
    if (c && c.length > 0) {
      title = c[0].text
    }
  }
  return title || 'New'
}

function updateNote() {
  // console.log('updateNote', editor.value!.getJSON())
  // console.log('html', editor.value!.getHTML())

  const noteJson = editor.value!.getJSON()
  const data: Indexable = {
    id: noteId.value,
    note_json: noteJson,
    note: markdown.value?.serialize(noteJson),
  }
  if (note.value.type === 'note') {
    data.title = parseTitle(noteJson)
  }
  saveNote(data, true)
}

async function createNote() {
  saveNoteRemote({
    id: noteId.value,
    bookId: bookId.value,
    type: 'note',
    value: progress.value.cfi,
    chapter: progress.value.tocItem?.label,
    page: progress.value.location?.current || 0,
    note: '',
    title: 'New',
  }).then(note => {
    editor.value?.commands.focus('start')
    setCurrentNote(note)
  }).finally(() => {
    loading.value = false
  })
}

function setContent (docNode: Indexable, emitUpdate = false, focus = 'start') {
  editor.value?.commands.setContent(docNode, { emitUpdate })

  if (focus !== 'none') {
    setTimeout(() => {
      editor.value?.commands.focus(focus as 'start')
    }, 500)
  }
}

function loadingNote(note: Indexable) {
  const docNode = note.noteJson
  setContent(docNode, false, 'end')
  setCurrentNote(note, false)
}

function getAndLoadNote() {
  loading.value = true
  loaded.value = false

  bookAnnotationService.get(noteId.value).then((res: Indexable) => {
    loadingNote(res)
  }).catch((err) => {
    if (err.response.status === 404) {
      createNote()
    }
  }).finally(() => {
    loading.value = false
  })
}

function onEditMeta() {
  showMeta.value = !showMeta.value
}

watch(noteId, getAndLoadNote)

onMounted(async () => {
  getAndLoadNote()
})
</script>

<style lang="scss">
.book-note {
  .yiitap {
    .tiptap {
      font-size: 85% !important;

      h1 {
        font-size: 1.8rem;
      }
    }
  }

  .o-scroll-wrapper {
    top: 50px;

    .layout {
      display: grid;
      grid-template-rows:
        auto
        1fr;

      &.page {
        grid-template-columns:
          [full-start] minmax(14px, 1fr)
          [content-start] minmax(400px, 900px)
          [content-end] minmax(14px, 1fr)
          [full-end];
      }

      &.full {
        grid-template-columns:
          [full-start] minmax(0, 14px)
          [content-start] 1fr
          [content-end] minmax(0, 14px)
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

  }

  .tippy-box {
    background: none!important;
  }

  .ProseMirror {
    padding-inline: 14px;
  }

  footer.meta {
    position: absolute;
    left: 8px;
    right: 8px;
    bottom: 8px;
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
