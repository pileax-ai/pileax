<template>
  <o-note-page ref="notePage" class="page-note">
    <header class="row items-center justify-between note-header text-readable">
      <note-breadcrumbs :id="id" />
      <note-actions @action="onAction" />
    </header>

    <q-scroll-area class="o-scroll-wrapper" @scroll="onScroll">
      <header class="row justify-center note-meta" :class="pageView">
        <section class="col-12 cover" v-if="false">
          Cover
        </section>
        <section class="note-meta-wrapper">
          <div class="icon" v-if="currentNote.icon">
            <span>
              {{ currentNote.icon }}
            </span>
            <o-emoji-menu @select="setIcon" />
          </div>
        </section>
        <section class="text-readable note-meta-wrapper">
          <q-btn icon="sentiment_satisfied_alt" label="Add Icon" flat
                 @click="addIcon" v-if="!currentNote.icon" />
          <q-btn icon="image" label="Add Cover" flat />
        </section>
      </header>
      <YiiEditor ref="yiiEditor" v-bind="options" @update="onUpdate" />
    </q-scroll-area>

    <o-doc-toc ref="tocRef" :editor="yiiEditor?.editor" :max-level="3" v-show="showToc" />
  </o-note-page>
</template>

<script setup lang="ts">
import { YiiEditor, ODocToc } from '@yiitap/vue';
import 'katex/dist/katex.min.css'

import { useRoute } from 'vue-router';
import { computed, onActivated, onMounted, provide, ref } from 'vue'
import { debounce } from 'quasar';

import useSetting from 'core/hooks/useSetting';
import useNote from 'src/hooks/useNote';
import { Note } from 'src/types/note';
import OEmojiMenu from 'components/icon/OEmojiMenu.vue';
import NoteBreadcrumbs from 'components/note/NoteBreadcrumbs.vue';
import NoteActions from 'components/note/NoteActions.vue';
import ONotePage from 'components/page/ONotePage.vue';
import { chatContentToHtml } from 'src/utils/note'
import { router } from 'src/router'

const route = useRoute();
const { darkMode, locale } = useSetting();
const {
  noteStore,
  currentNote,
  noteService,
  setCurrentNote,
  addIcon,
  setIcon,
} = useNote();

const notePage = ref<InstanceType<typeof ONotePage>>();
const yiiEditor = ref<InstanceType<typeof YiiEditor>>();
const tocRef = ref<InstanceType<typeof ODocToc>>()
const id = ref('');
const parent = ref('');
const source = ref('');
const noteHtml = ref('');
const noteJson = ref<Indexable>({});
const aiOption = ref<AiOption>({
  provider: 'deepseek',
});
const pageView = ref('page');
const showToc = ref(true);
const loading = ref(false);
const ready = ref(false);

const options = computed(() => {
  return {
    aiOption: aiOption.value,
    locale: locale.value,
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
  return yiiEditor.value?.editor;
})

function initEditor() {
  ready.value = false;
  editor.value?.on('create', () => {
    ready.value = true;
  })
}

function onAction(action: Indexable) {
  switch (action.value) {
    case 'fullWidth':
      pageView.value = action.actionValue ? 'full' : 'page';
      break;
    case 'split':
      notePage.value?.toggleSide();
      break;
    case 'toc':
      showToc.value = action.actionValue;
      break;
    default:
      break;
  }
}

async function getAndLoadNote() {
  noteService.get(id.value).then((note: any) => {
    loadingNote(note as Note);
  }).catch((err) => {
    createNote();
  })
}

async function createNote() {
  let content = '';
  let focusPosition = 'start';
  let emitUpdate = false;
  if (source.value === 'chat') {
    loading.value = false;
    emitUpdate = true;
    content = chatContentToHtml(noteStore.chatToNote.content, noteStore.chatToNote.message);
    focusPosition = 'end';
  }
  noteService.save({
    id: id.value,
    parent: parent.value || '',
    title: 'New page',
    content: content
  }).then(note => {
    loadNote(note, content, focusPosition, emitUpdate);
  });
}

function loadingNote(note: Note) {
  loading.value = true;
  parent.value = note.parent;
  let content = note.content;
  let focusPosition = 'start';
  let emitUpdate = false;
  if (source.value ===  'chat') {
    loading.value = false;
    emitUpdate = true;
    const appendHtml = chatContentToHtml(noteStore.chatToNote.content)
    console.log('appendHtml', appendHtml)
    content += appendHtml;
    focusPosition = 'end';
  }
  loadNote(note, content, focusPosition, emitUpdate);
  notePage.value?.refreshChat(note.id);
}

function loadNote(note: Note, content: string, focus: string,
                  emitUpdate = false) {
  setCurrentNote(note);
  setContent(content, emitUpdate, focus);
  noteStore.setChatToNote({});
  router.replace({ query: {} });
}

function setContent (content: string, emitUpdate = false, focus = 'start') {
  editor.value?.commands.setContent(content, {
    emitUpdate
  });
  editor.value?.commands.focus(focus as 'start');
}

function onScroll() {
  const event: Event | undefined = undefined;
  tocRef.value?.onScroll(event)
}

function onUpdate({ json, html }: { json: any; html: string }) {
  if (!ready.value) return;
  // console.log('update', json)
  // console.log('update', html);
  noteJson.value = json;
  noteHtml.value = html;

  if (loading.value) {
    loading.value = false;
  } else {
    updateNote();
  }
}

const updateNoteNext = debounce( () => {
  updateNoteRemote();
}, 500)

async function updateNote() {
  const note = {
    ...currentNote.value,
    id: id.value,
    title: getTitle(),
    content: noteHtml.value
  };
  setCurrentNote(note);
  updateNoteNext();
}

async function updateNoteRemote() {
  const note = await noteService.save({
    id: id.value,
    title: getTitle(),
    content: noteHtml.value
  });
  setCurrentNote(note);
}

function getTitle () {
  let title = '';
  let content = noteJson.value.content;
  if (content && content.length > 0) {
    let c = content[0].content;
    if (c && c.length > 0) {
      title = c[0].text;
    }
  }
  return title || 'New page';
}

const insertContent = (value: string) => {
  const html = chatContentToHtml(value)
  editor.value?.commands.insertContent(html);
  console.log('insert', value)
}

provide('insertContent', insertContent)

onActivated(() => {
  id.value = route.params.id as string;
  parent.value = route.query.parent as string;
  source.value = route.query.source as string;
  getAndLoadNote();
})

onMounted(() => {
  initEditor();
})
</script>

<style lang="scss">
.page-note {
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

    .note-meta {
      //margin-top: 50px;
      padding: 0 100px;
      &.page {
        .note-meta-wrapper {
          max-width: 800px;
        }
      }
      .note-meta-wrapper {
        width: 100%;

        .icon {
          width: 80px;
          height: 80px;
          font-size: 80px;
          line-height: 1.1;

          &:hover {
            background: var(--q-accent);
            border-radius: 4px;
            cursor: pointer;
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
