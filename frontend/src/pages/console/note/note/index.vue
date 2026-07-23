<template>
  <o-note-page ref="notePage"
               class="page-note"
               :style="`--note-font: ${font}; --note-font-size: ${ styles.smallText ? '85%' : '100%' }`">
    <nav class="row items-center justify-between text-readable note-nav">
      <div class="row items-center">
        <note-breadcrumbs :id="noteId" />

        <div class="row items-center tag text-orange" v-if="!editable">
          <q-icon name="o_lock" class="q-mr-xs" /> {{ $t('readonly') }}
        </div>
      </div>
      <note-actions :key="currentNote.id"
                    :ydoc="collab.ydoc!"
                    @action="onAction"
                    @restore="onRestore" />
    </nav>

    <q-scroll-area class="o-scroll-wrapper" @scroll="onScroll">
      <section class="layout" :class="[pageView]">
        <note-cover :key="currentNote.id"
                    class="layout-full col-12" @cover="setCover($event)">
        </note-cover>

        <section class="layout-content row justify-center note-meta"
                :class="`${pageView} ${currentNote.cover && currentNote.icon ? 'with-cover' : ''}`">
          <section class="note-meta-wrapper">
            <div class="icon text-readable" v-if="currentNote.icon">
              <o-icon :name="currentNote.icon" />
              <o-general-icon-menu anchor="bottom left"
                                   self="top left"
                                   :offset="[0, 8]"
                                   @select="updateIcon"
                                   v-if="editable" />
            </div>
          </section>
          <section class="text-readable note-meta-wrapper" v-if="editable">
            <q-btn icon="sentiment_satisfied_alt"
                   :label="$t('note.addIcon')"
                   flat
                   @click="addIcon"
                   v-if="!currentNote.icon" />
            <q-btn icon="image"
                   :label="$t('note.cover.add')"
                   flat
                   @click="setCover('random')"
                   v-if="!currentNote.cover" />
          </section>
        </section>

        <section class="layout-content title">
          <q-input ref="title"
                   :model-value="currentNote.title"
                   debounce="100"
                   placeholder="New page"
                   class=""
                   borderless
                   :readonly="!editable"
                   @update:modelValue="setTitle"
                   @keyup.enter="onTitleEnter" />
        </section>

        <YiiEditor ref="yiiEditor"
                   class="layout-content"
                   :class="{ 'auto-numbering': styles.autoNumbering }"
                   v-bind="options"
                   :key="editorKey"
                   @create="onCreate"
                   v-if="!collab.collabEnabled || collab.collabReady" />

        <aside class="layout-right">
          <div class="sticky-top">
            <o-doc-toc ref="tocRef"
                       :editor="yiiEditor?.editor"
                       :max-level="3"
                       v-show="styles.toc" />
          </div>
        </aside>
      </section>
    </q-scroll-area>
  </o-note-page>
</template>

<script setup lang="ts">
import { QInput } from 'quasar'
import { useRoute } from 'vue-router'
import { computed, onActivated, provide, ref, useTemplateRef, watch } from 'vue'
import { Editor } from '@tiptap/core'
import {
  YiiEditor,
  ODocToc,
  OStarterKit,
  OAiBlock,
  OUploadManager,
  DefaultBlockMenuOptions,
  type SideMenuAddType,
} from '@yiitap/vue'
import 'katex/dist/katex.min.css'

import useCommon from 'core/hooks/useCommon'
import useSetting from 'core/hooks/useSetting'
import useApi from 'src/hooks/useApi'
import useNote from 'src/hooks/useNote'
import useNoteAi from 'src/hooks/useNoteAi'
import useNoteCollab from 'src/hooks/useNoteCollab'
import useAccount from 'src/hooks/useAccount'
import type { Note } from 'src/types/note'
import ONotePage from 'components/page/ONotePage.vue'
import OGeneralIconMenu from 'components/icon/OGeneralIconMenu.vue'
import NoteBreadcrumbs from 'components/note/NoteBreadcrumbs.vue'
import NoteActions from 'components/note/NoteActions.vue'
import NoteCover from 'components/note/NoteCover.vue'
import { router } from 'src/router'
import { colorById } from 'core/utils/misc'
import usePermission from 'src/hooks/usePermission'
import { sanitizeContent } from 'src/utils/note'
import { getDeviceId } from 'src/utils/auth'
import { fileService } from 'src/api/service/remote'

const route = useRoute()
const { showDialog } = useCommon()
const { darkMode, locale } = useSetting()
const { account } = useAccount()
const { getFileUrl } = useApi()
const {
  noteStore,
  currentNote,
  noteService,
  saveNote,
  saveNoteRemote,
  setCurrentNote,
  canEdit
} = useNote()
const { aiOptions, initNoteAi } = useNoteAi()
const {
  noteId,
  collab,
  initCollab,
  restoreVersion,
  addIcon,
  updateIcon,
  setCover,
  setTitle,
  throttleUpdateTime,
} = useNoteCollab()
const { hasPermission } = usePermission()

const titleRef = useTemplateRef<QInput>('title')
const notePage = ref<InstanceType<typeof ONotePage>>()
const yiiEditor = ref<InstanceType<typeof YiiEditor>>()
const tocRef = ref<InstanceType<typeof ODocToc>>()
const parent = ref('')
const source = ref('')
const scope = ref('1')
const loading = ref(false)
const loaded = ref(false)
const editorReady = ref(false)
const editable = ref(true)
const localeAlt = ref(locale.value.toLowerCase())

const options = computed(() => {
  // console.table(aiOptions.value.provider)
  const extensions = [
    OStarterKit.configure(),
    OAiBlock.configure(aiOptions.value),
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
  ] as any
  if (collab.value.collabReady) {
    extensions.push(
      {
        name: 'Collaboration',
        configure: {
          document: collab.value.ydoc,
        },
      },
      {
        name: 'CollaborationCaret',
        configure: {
          provider: collab.value.hpProvider,
          user: {
            name: account.value.name,
            color: colorById(account.value.id + getDeviceId()) || '#f783ac',
          },
        },
      }
    )
  }

  return {
    editable: editable.value,
    aiOptions: aiOptions.value,
    locale: localeAlt.value,
    darkMode: darkMode.value,
    collaboration: collab.value.collabEnabled,
    showBubbleMenu: true,
    sideMenu: {
      show: true,
      add: 'empty' as SideMenuAddType,
      addMenuOptions: {
        ...DefaultBlockMenuOptions,
        modelViewer: false,
      },
    },
    pageView: pageView.value,
    collab: {
      enabled: collab.value.collabEnabled,
    },
    extensions: extensions
  }
})

const editor = computed(() => {
  return yiiEditor.value?.editor
})

const markdown = computed(() => {
  return editor.value?.markdown
})

const editorKey = computed(() => {
  return collab.value.collabEnabled
    ? `collab-${collab.value.ydocId}`
    : `normal-${noteId.value}`
})

const pageView = computed(() => {
  return styles.value.fullWidth ? 'full' : 'page'
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

function onAction(action: Indexable) {
  switch (action.value) {
    case 'split':
      notePage.value?.toggleSide()
      break
    case 'export':
      showDialog({
        type: 'note-export',
        note: currentNote.value,
        editor: editor.value
      })
      break
    case 'import':
      showDialog({
        type: 'note-import',
        note: currentNote.value,
        editor: editor.value
      })
      break
    default:
      break
  }
}

function onCreate() {
  editorReady.value = true
  editor.value?.on('update', onUpdate)
  collab.value.editor = editor.value

  if (!currentNote.value.title) {
    titleRef.value?.focus()
  }

}

function onUpdate({ editor }: { editor: Editor }) {
  // console.log('update', editorReady.value, loading.value)
  // Only update when editor is ready
  if (!editorReady.value) return

  // When editor is loading content, NO need to update.
  if (loading.value) {
    loading.value = false
  } else {
    updateNote()
  }

  // Loading chat note
  if (!loaded.value && collab.value.collabReady) {
    loadingChatNodeCollab()
  }

  loaded.value = true
}

function onScroll() {
  const event: Event | undefined = undefined
  tocRef.value?.onScroll(event as any)
}

function onTitleEnter() {
  editor.value?.commands.focus('start')
}

function onRestore(version: Indexable) {
  if (version.type === 'update') {
    restoreVersion(version, editor.value?.schema)
  } else {
    restoreFullVersion(version)
  }
}

function updateNote() {
  // Logging
  // console.log('updateNote', editor.value!.getJSON())
  // console.log('html', editor.value!.getHTML())

  // Update only when collab is disabled
  if (!collab.value.collabEnabled) {
    throttleUpdateTime()
    const noteJson = editor.value!.getJSON()
    saveNote({
      id: noteId.value,
      content: noteJson,
      contentMarkdown: markdown.value?.serialize(noteJson)
    }, true)
  }
}

function restoreFullVersion(version: Indexable) {
  saveNoteRemote({
    id: noteId.value,
    title: version.title,
    icon: version.icon,
    cover: version.cover,
    styles: version.styles,
  }).then(res => {
    setContent(version.content, false)
  })
}

async function getAndLoadNote() {
  loading.value = true
  loaded.value = false
  noteService.get(noteId.value).then((note: any) => {
    loading.value = false
    loadingNote(note as Note)
  }).catch((err) => {
    if (err.response.status === 404) {
      createNote()
    }
  })
}

async function createNote() {
  const docNode = { type: 'doc', content: [] } as Indexable
  let emitUpdate = false
  let title = ''
  if (source.value === 'chat') {
    loading.value = false
    emitUpdate = true
    title = noteStore.value.chatToNote.message
    loadingChatNote(docNode)
  }
  saveNoteRemote({
    id: noteId.value,
    parent: parent.value || '',
    scope: scope.value || '1',
    title: title,
    content: docNode
  }).then(note => {
    const focusPosition = title === '' ? 'none' : 'end'
    loadNote(note as Note, docNode, focusPosition, emitUpdate)

    titleRef.value?.focus()
  }).finally(() => {
    loading.value = false
  })
}

function loadingNote(note: Note) {
  parent.value = note.parent
  const docNode = note.content
  let focusPosition = 'start'
  let emitUpdate = false
  if (source.value ===  'chat') {
    if (docNode.type === 'doc') {
      focusPosition = 'end'
      emitUpdate = true
      loadingChatNote(docNode)
    }
  }
  loadNote(note, docNode, focusPosition, emitUpdate)
  notePage.value?.refreshChat(note.id)
}

/**
 * Used in no collab
 * @param docNode
 */
function loadingChatNote(docNode: Indexable) {
  if (!collab.value.collabEnabled) return

  if (markdown.value && noteStore.value.chatToNote.content) {
    const contentNodes = markdown.value?.parse(noteStore.value.chatToNote.content)
    if (Array.isArray(contentNodes)) {
      docNode.content.push(...contentNodes)
    } else {
      docNode.content.push(contentNodes)
    }

    // Reset after consuming
    noteStore.value.resetChatToNote()
  } else {
    console.debug('Markdown parser is not ready')
  }
}

function loadingChatNodeCollab() {
  if (markdown.value && noteStore.value.chatToNote.content) {
    editor.value?.commands.focus('end')
    setTimeout(() => {
      const content = noteStore.value.chatToNote.content
      insertContent(content)

      // Reset after consuming
      noteStore.value.resetChatToNote()
    }, 10)
  }
}

function  loadNote(note: Note, docNode: Indexable, focus: string,
                  emitUpdate = false) {
  console.debug('Collab', collab.value.collabEnabled)
  if (collab.value.collabEnabled) {
    initCollab()
  } else {
    setContent(docNode, emitUpdate, focus)
  }

  setCurrentNote(note)
  editable.value = canEdit(note)
  router.replace({ ...route, query: {} })
}

function setContent (docNode: Indexable, emitUpdate = false, focus = 'start') {
  editor.value?.commands.setContent(docNode, { emitUpdate })

  if (focus !== 'none') {
    editor.value?.commands.focus(focus as 'start')
  }
}

const insertContent = (value: string) => {
  try {
    const json = markdown.value?.parse(value)
    if (json?.content) {
      editor.value?.commands.insertContent(sanitizeContent(json))
    }
  } catch (err) {
    console.error(err)
  }
}

watch(locale, (newValue) => {
  localeAlt.value = newValue.toLowerCase()
})

onActivated(() => {
  noteId.value = route.params.id as string
  parent.value = route.query.parent as string
  source.value = route.query.source as string
  scope.value = route.query.scope as string

  getAndLoadNote()
  initNoteAi(noteId.value)
})

provide('insertContent', insertContent)
</script>

<style lang="scss">
.page-note {
  .yiitap {
    .editor-content {
      padding: 16px 0;
    }

    .tiptap {
      font-family: var(--note-font), serif !important;
      font-size: var(--note-font-size) !important;
    }
  }


  .note-nav {
    height: 50px;
    padding: 0 10px;
    background: linear-gradient(to right,
      var(--q-secondary) 30%,
      transparent 50%,
      var(--q-secondary) 90%);

    .tag {
      font-size: 0.8rem;
      padding: 2px 6px;
      margin-left: 6px;
      border-radius: 8px;
      border: solid 1px var(--q-accent);
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
            justify-content: center;
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

.o-layout:has(.splitHorizontal) {
  .q-drawer, .o-top-header {
    z-index: 0;
  }

  .page-note {
    .o-scroll-wrapper {
      contain: unset;
    }
  }
}
</style>
