<template>
  <q-page class="page-note">
    <header class="note-header">
    </header>

    <q-scroll-area class="o-scroll-wrapper" @scroll="onScroll">
      <YiiEditor ref="yiiEditor" v-bind="options" @update="onUpdate" />
    </q-scroll-area>

    <o-doc-toc ref="tocRef" :editor="yiiEditor?.editor" :max-level="3" />
  </q-page>
</template>

<script setup lang="ts">
import { YiiEditor, ODocToc } from '@yiitap/vue';
import '@yiitap/vue/dist/vue.css';

import { useRoute } from 'vue-router';
import { computed, onActivated, onMounted, ref } from 'vue';
import { debounce } from 'quasar';

import { BasicFeaturesArticle } from 'src/api/mock/data/article';
import useNote from 'src/hooks/useNote';
import {Note} from 'src/types/note';

const route = useRoute();
const { currentNote, noteService, setCurrentNote } = useNote();

const yiiEditor = ref<InstanceType<typeof YiiEditor>>();
const tocRef = ref<InstanceType<typeof ODocToc>>()
const id = ref('');
const parent = ref('');
const noteHtml = ref('');
const noteJson = ref<Indexable>({});
const aiOption = ref<AiOption>({
  provider: 'deepseek',
});

const options = computed(() => {
  return {
    aiOption: aiOption.value,
    content: '',
    showMainMenu: false,
    showBubbleMenu: true,
    showSideMenu: true,
    pageView: 'page',
    mainMenu: [
    ],
    extensions: [
      'OAiBlock',
      'OBlockquote',
      'OCallout',
      'OCodeBlock',
      'OColon',
      'OColorHighlighter',
      'OHeading',
      'OImage',
      'OParagraph',
      'OSlash',
      'OSlashZh',
      'OLink',
      'OTrailingNode',
      'OVideo',
    ],
  }
})

const editor = computed(() => {
  return yiiEditor.value?.editor;
})

const updateNoteNext = debounce( () => {
  updateNoteRemote();
}, 500)

function initEditor() {
  //
}

async function loadNote() {
  noteService.value.getNote(id.value).then((note: any) => {
    postLoadNote(note as Note);
  }).catch((err) => {
    createNote();
  })
}

async function createNote() {
  const note = await noteService.value.saveNote({
    id: id.value,
    parent: parent.value || '',
    title: 'New page',
    content: ''
  });
  setCurrentNote(note);
  setContent('');
}

function postLoadNote(note: Note) {
  parent.value = note.parent;
  setCurrentNote(note);
  setContent(note.content, true);
}

function setContent (content: string, emitUpdate = false) {
  editor.value?.commands.setContent(content, emitUpdate);
  editor.value?.commands.focus('start');
}

function onScroll(event: Event) {
  tocRef.value?.onScroll(event)
}

function onUpdate({ json, html }: { json: any; html: string }) {
  // console.log('update', json)
  // console.log('update', html);
  noteJson.value = json;
  noteHtml.value = html;
  updateNote();
}

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
  const note = await noteService.value.saveNote({
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

onActivated(() => {
  id.value = route.params.id as string;
  parent.value = route.query.parent as string;
  loadNote();
})

onMounted(() => {
  initEditor();
})
</script>

<style lang="scss">
.page-note {
  .note-header {
    height: 40px;
  }

  .o-scroll-wrapper {
    top: 40px;
  }

  .editor-content.page {
    width: 100%;
    max-width: 1000px;
  }


  .o-doc-toc {
    position: absolute;

    right: 20px;
  }
}
</style>
