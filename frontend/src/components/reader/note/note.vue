<template>
  <q-scroll-area class="o-scroll-wrapper book-note"
                 :class="{ 'dense': dense }"
                 @scroll="onScroll">
    <section class="layout" :class="dense ? 'full' : 'page'">
      <YiiEditor ref="yiiEditor"
                 class="layout-content"
                 v-bind="options"
                 :key="editorKey"
                 @create="onCreate" />
    </section>

    <div class="toc">
      <o-doc-toc ref="tocRef"
                 :editor="editor"
                 :max-level="3" />
    </div>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Editor } from '@tiptap/core'

import useBook from 'src/hooks/useBook'
import useBookNote from 'src/hooks/useBookNote'
import { bookAnnotationService, fileService } from 'src/api/service/remote'
import {
  AnyExtension,
  DefaultBlockMenuOptions,
  ODocToc,
  OStarterKit,
  OUploadManager, type SideMenuAddType,
  YiiEditor,
} from '@yiitap/vue'
import useSetting from 'core/hooks/useSetting'
import useApi from 'src/hooks/useApi'

const props = defineProps({
  dense: {
    type: Boolean,
    default: false
  },
})

const { darkMode, locale } = useSetting()
const { getFileUrl } = useApi()
const { progress } = useBook()
const {
  bookId,
  note,
  noteId,
  isPhysical,
  setCurrentNote,
  saveNote,
  saveNoteRemote
} = useBookNote()

const yiiEditor = ref<InstanceType<typeof YiiEditor>>()
const tocRef = ref<InstanceType<typeof ODocToc>>()
const loading = ref(false)
const loaded = ref(false)
const localeAlt = ref(locale.value.toLowerCase())
const editorReady = ref(false)

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
    sideMenu: props.dense
      ? {
        show: false,
      }
      : {
        show: true,
        add: 'empty' as SideMenuAddType,
        addMenuOptions: {
          ...DefaultBlockMenuOptions,
          modelViewer: false,
        },
      } as any,
    pageView: props.dense ? 'full' : 'page',
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

function onScroll() {
  const event: Event | undefined = undefined
  tocRef.value?.onScroll(event as any)
}

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
  setContent(docNode, true)
  setCurrentNote(note, false)
}

function getAndLoadNote() {
  if (!noteId.value) return

  loading.value = true
  loaded.value = false

  bookAnnotationService.get(noteId.value).then((res: Indexable) => {
    loadingNote(res)
  }).catch((err) => {
    if (err.response.status === 404) {
      createNote()
    }
  })
}

watch(noteId, getAndLoadNote)

onMounted(async () => {
  getAndLoadNote()
})
</script>

<style lang="scss">
.book-note {
  --view-margin: 50px;

  &.dense {
    --view-margin: 14px;
    .yiitap {
      .tiptap {
        font-size: 85% !important;

        h1 {
          font-size: 1.8rem;
        }
      }
    }

    .toc {
      top: 0;
    }
  }

  .layout {
    display: grid;
    grid-template-rows:
        auto
        1fr;

    &.page {
      grid-template-columns:
          [full-start] minmax(var(--view-margin), 1fr)
          [content-start] minmax(400px, 900px)
          [content-end] minmax(var(--view-margin), 1fr)
          [full-end];
    }

    &.full {
      grid-template-columns:
          [full-start] minmax(0, var(--view-margin))
          [content-start] 1fr
          [content-end] minmax(0, var(--view-margin))
          [full-end];
    }
  }

  .layout-full {
    grid-column: full;
  }

  .layout-content {
    grid-column: content;
  }

  .toc {
    position: fixed;
    right: 14px;
    top: 40px;
    //background: red;
    z-index: 1;

    &.isPhysical {}
  }

  .tippy-box {
    background: none!important;
  }

  .ProseMirror {
    padding-inline: var(--view-margin);
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
