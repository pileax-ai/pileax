<template>
  <q-page class="page-note">
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
            <o-emoji-menu @select="setIcon" v-close-popup />
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
  </q-page>
</template>

<script setup lang="ts">
import { YiiEditor, ODocToc } from '@yiitap/vue';
import '@yiitap/vue/dist/vue.css';

import { useRoute } from 'vue-router';
import { computed, onActivated, onMounted, ref } from 'vue';
import { debounce } from 'quasar';

import useNote from 'src/hooks/useNote';
import { Note } from 'src/types/note';
import OEmojiMenu from 'components/form/OEmojiMenu.vue';
import NoteBreadcrumbs from 'components/note/NoteBreadcrumbs.vue';
import NoteActions from 'components/note/NoteActions.vue';

const route = useRoute();
const {
  notes,
  currentNote,
  noteService,
  setCurrentNote,
  addIcon,
  setIcon,
} = useNote();

const yiiEditor = ref<InstanceType<typeof YiiEditor>>();
const tocRef = ref<InstanceType<typeof ODocToc>>()
const id = ref('');
const parent = ref('');
const noteHtml = ref('');
const noteJson = ref<Indexable>({});
const aiOption = ref<AiOption>({
  provider: 'deepseek',
});
const pageView = ref('page');
const showToc = ref(true);
const loading = ref(false);

const options = computed(() => {
  return {
    aiOption: aiOption.value,
    title: true,
    content: '',
    showMainMenu: false,
    showBubbleMenu: true,
    showSideMenu: true,
    pageView: pageView.value,
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

function onAction(action: Indexable) {
  switch (action.value) {
    case 'fullWidth':
      pageView.value = action.actionValue ? 'full' : 'page';
      break;
    case 'toc':
      showToc.value = action.actionValue;
      break;
    default:
      break;
  }
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
  loading.value = true;
  parent.value = note.parent;
  setCurrentNote(note);
  setContent(note.content, true);
}

function setContent (content: string, emitUpdate = false) {
  editor.value?.commands.setContent(content, emitUpdate);
  editor.value?.commands.focus('start');
}

function onScroll() {
  const event: Event | undefined = undefined;
  tocRef.value?.onScroll(event)
}

function onUpdate({ json, html }: { json: any; html: string }) {
  // console.log('update', json)
  console.log('update', html);
  noteJson.value = json;
  noteHtml.value = html;

  if (loading.value) {
    loading.value = false;
  } else {
    updateNote();
  }
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
    height: 50px;
    padding: 0 10px;
  }

  .o-scroll-wrapper {
    top: 50px;

    .note-meta {
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

    .editor-content.page {
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
