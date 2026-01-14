<template>
  <o-note-page ref="notePage"
               class="page-note"
               :style="`--note-font: ${font}; --note-font-size: ${ styles.smallText ? '85%' : '100%' }`">
    <header class="row items-center justify-between note-header text-readable">
      <note-breadcrumbs :id="id" />
      <note-actions @action="onAction" />
    </header>

    <q-scroll-area class="o-scroll-wrapper" @scroll="onScroll">
      <section class="col-12 cover"
               v-if="currentNote.cover">
        <img :src="currentNote.cover" alt="cover" />
      </section>
      <header class="row justify-center note-meta"
              :class="`${pageView} ${currentNote.cover && currentNote.icon ? 'with-cover' : ''}`">
        <section class="note-meta-wrapper">
          <div class="icon text-readable" v-if="currentNote.icon">
            <span v-if="false">
              {{ currentNote.icon }}
            </span>
            <o-icon :name="currentNote.icon" />
            <o-general-icon-menu anchor="bottom left"
                                 self="top left"
                                 :offset="[0, 8]"
                                 @select="setIcon" />
          </div>
        </section>
        <section class="text-readable note-meta-wrapper">
          <q-btn icon="sentiment_satisfied_alt"
                 :label="$t('note.addIcon')"
                 flat
                 @click="addIcon"
                 v-if="!currentNote.icon" />
          <q-btn icon="image"
                 label="Add Cover"
                 flat
                 @click="addCover"
                 v-if="!currentNote.cover" />
        </section>
      </header>
      <YiiEditor ref="yiiEditor" v-bind="options" @update="onUpdate" />
    </q-scroll-area>

    <o-doc-toc ref="tocRef" :editor="yiiEditor?.editor" :max-level="3" v-show="showToc" />
  </o-note-page>
</template>

<script setup lang="ts">
import { YiiEditor, ODocToc } from '@yiitap/vue'
import 'katex/dist/katex.min.css'

import { useRoute } from 'vue-router'
import { computed, onActivated, onMounted, provide, ref, watch } from 'vue'
import { debounce } from 'quasar'

import useSetting from 'core/hooks/useSetting'
import useNote from 'src/hooks/useNote'
import type { Note } from 'src/types/note'
import OGeneralIconMenu from 'components/icon/OGeneralIconMenu.vue'
import NoteBreadcrumbs from 'components/note/NoteBreadcrumbs.vue'
import NoteActions from 'components/note/NoteActions.vue'
import ONotePage from 'components/page/ONotePage.vue'
import { chatContentToHtml } from 'src/utils/note'
import { router } from 'src/router'

const route = useRoute()
const { darkMode, locale } = useSetting()
const {
  noteStore,
  currentNote,
  noteService,
  setCurrentNote,
  addCover,
  addIcon,
  setIcon,
} = useNote()

const notePage = ref<InstanceType<typeof ONotePage>>()
const yiiEditor = ref<InstanceType<typeof YiiEditor>>()
const tocRef = ref<InstanceType<typeof ODocToc>>()
const id = ref('')
const parent = ref('')
const source = ref('')
const noteHtml = ref('')
const noteJson = ref<Indexable>({})
const aiOption = ref<AiOption>({
  provider: 'deepseek',
})
const pageView = ref('page')
const showToc = ref(true)
const loading = ref(false)
const editorReady = ref(false)
const localeAlt = ref(locale.value.toLowerCase())

const options = computed(() => {
  return {
    aiOption: aiOption.value,
    locale: localeAlt.value,
    darkMode: darkMode.value,
    title: true,
    content: '',
    showMainMenu: false,
    showBubbleMenu: true,
    sideMenu: {
      show: true,
      add: 'menu',
    },
    pageView: pageView.value,
    mainMenu: [
    ],
    extensions: [
      'Emoji',
      'InlineMath',
      'Markdown',
      'OAiBlock',
      'OBlockMath',
      'OBlockquote',
      'OCallout',
      'OCodeBlock',
      // 'OColon',
      'OColorHighlighter',
      'ODetails',
      'OHeading',
      'OImage',
      'OLink',
      'OParagraph',
      'OShortcut',
      'OSlash',
      'OSlashZh',
      'OTrailingNode',
      'OVideo',
    ],
  }
})

const editor = computed(() => {
  return yiiEditor.value?.editor
})

const styles = computed(() => {
  let s = {}
  try {
    s = JSON.parse(currentNote.value.styles || '')
  } catch (err) {
    // console.warn(err);
  }
  return s as Indexable
})

const font = computed(() => {
  switch (styles.value.font) {
    case 'serif':
      return 'Lyon-Text, Georgia, "Songti SC", SimSun, serif'
    case 'mono':
      return 'iawriter-mono, Nitti, Menlo, Courier, monospace'
    default:
      return ''
  }
})

function initEditor() {
  editorReady.value = false
  editor.value?.on('create', () => {
    editorReady.value = true
  })
}

function onAction(action: Indexable) {
  switch (action.value) {
    case 'fullWidth':
      pageView.value = action.actionValue ? 'full' : 'page'
      break
    case 'split':
      notePage.value?.toggleSide()
      break
    case 'toc':
      showToc.value = action.actionValue
      break
    default:
      break
  }
}

async function getAndLoadNote() {
  loading.value = true
  noteService.get(id.value).then((note: any) => {
    loading.value = false
    loadingNote(note as Note)
  }).catch((err) => {
    createNote()
  })
}

async function createNote() {
  let content = ''
  let focusPosition = 'start'
  let emitUpdate = false
  if (source.value === 'chat') {
    loading.value = false
    emitUpdate = true
    content = chatContentToHtml(noteStore.value.chatToNote.content, noteStore.value.chatToNote.message)
    focusPosition = 'end'
  }
  noteService.save({
    id: id.value,
    parent: parent.value || '',
    title: 'New page',
    content: content
  }).then(note => {
    loadNote(note, content, focusPosition, emitUpdate)
  }).finally(() => {
    loading.value = false
  })
}

function loadingNote(note: Note) {
  parent.value = note.parent
  let content = note.content
  let focusPosition = 'start'
  let emitUpdate = false
  if (source.value ===  'chat') {
    emitUpdate = true
    const appendHtml = chatContentToHtml(noteStore.value.chatToNote.content)
    content += appendHtml
    focusPosition = 'end'
  }
  loadNote(note, content, focusPosition, emitUpdate)
  notePage.value?.refreshChat(note.id)
}

function loadNote(note: Note, content: string, focus: string,
                  emitUpdate = false) {
  setCurrentNote(note)
  setContent(content, emitUpdate, focus)
  noteStore.value.resetChatToNote()
  router.replace({ ...route, query: {} })
}

function setContent (content: string, emitUpdate = false, focus = 'start') {
  editor.value?.commands.setContent(content, {
    emitUpdate
  })
  editor.value?.commands.focus(focus as 'start')
}

function onScroll() {
  const event: Event | undefined = undefined
  tocRef.value?.onScroll(event as any)
}

function onUpdate({ json, html }: { json: any; html: string }) {
  // When editor created, there is one update which is no meaning.
  // Ignore this update.
  if (!editorReady.value) return
  // console.log('update', html, editorReady.value, loading.value);
  noteJson.value = json
  noteHtml.value = html

  // When editor is loading content, NO need to update to your server.
  if (loading.value) {
    loading.value = false
  } else {
    updateNote()
  }
}

const updateNoteNext = debounce( () => {
  updateNoteRemote()
}, 500)

async function updateNote() {
  const note = {
    ...currentNote.value,
    id: id.value,
    title: getTitle(),
    content: noteHtml.value
  }
  setCurrentNote(note)
  updateNoteNext()
}

async function updateNoteRemote() {
  const note = await noteService.save({
    id: id.value,
    title: getTitle(),
    content: noteHtml.value
  })
  setCurrentNote(note)
}

function getTitle () {
  let title = ''
  const content = noteJson.value.content
  if (content && content.length > 0) {
    const c = content[0].content
    if (c && c.length > 0) {
      title = c[0].text
    }
  }
  return title || 'New page'
}

const insertContent = (value: string) => {
  const html = chatContentToHtml(value)
  editor.value?.commands.insertContent(html)
  console.log('insert', value)
}

watch(locale, (newValue) => {
  localeAlt.value = newValue.toLowerCase()
})

provide('insertContent', insertContent)

onActivated(() => {
  id.value = route.params.id as string
  parent.value = route.query.parent as string
  source.value = route.query.source as string
  getAndLoadNote()
})

onMounted(() => {
  initEditor()
})
</script>

<style lang="scss">
.page-note {
  .tiptap {
    font-family: var(--note-font) !important;
    font-size: var(--note-font-size) !important;
  }


  .note-header {
    height: 50px;
    padding: 0 10px;
    background: linear-gradient(to right,
      var(--q-secondary) 30%,
      transparent 50%,
      var(--q-secondary) 90%);
  }

  .o-scroll-wrapper {
    top: 50px;

    .cover {
      height: 280px;
      img {
        display: block;
        object-fit: cover;
        width: 100%;
        max-height: 280px;
      }
    }

    .note-meta {
      padding: 0 100px;
      &.page {
        .note-meta-wrapper {
          max-width: 800px;
        }
      }
      &.with-cover {
        margin-top: -40px;
      }

      .note-meta-wrapper {
        width: 100%;

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

    .editor-content.page-view {
      width: 100%;
      max-width: 1000px;
    }
  }


  .o-doc-toc {
    position: absolute;
    right: 20px;
  }
}
</style>
