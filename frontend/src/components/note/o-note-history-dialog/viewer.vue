<template>
  <q-page ref="notePage"
          class="note-version-viewer"
          :style="`--note-font: ${font}; --note-font-size: ${ styles.smallText ? '85%' : '100%' }`">
    <q-scroll-area class="o-scroll-wrapper">
      <section class="layout" :class="[pageView]">
        <header class="layout-full col-12 cover"
                 v-if="version.cover">
          <img :src="version.cover" alt="cover" />
        </header>

        <section class="layout-content row justify-center note-meta"
                :class="`${pageView} ${version.cover && version.icon ? 'with-cover' : ''}`">
          <section class="note-meta-wrapper">
            <div class="icon text-readable" v-if="version.icon">
              <o-icon :name="version.icon" />
            </div>
          </section>
        </section>

        <section class="layout-content title">
          <q-input :model-value="version.title"
                   class=""
                   borderless readonly />
        </section>

        <YiiEditor ref="yiiEditor"
                   class="layout-content"
                   v-bind="options" />
      </section>
    </q-scroll-area>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, type PropType, ref, watch } from 'vue'
import { YiiEditor } from '@yiitap/vue'
import 'katex/dist/katex.min.css'

import useSetting from 'core/hooks/useSetting'
import ONotePage from 'components/page/ONotePage.vue'
import * as Y from 'yjs'
import { base64ToUint8Array } from 'core/utils/format'
import { yXmlFragmentToProseMirrorRootNode } from '@tiptap/y-tiptap'

const props = defineProps({
  ydoc: {
    type: Object as PropType<Y.Doc>,
    default: () => {}
  },
  version: {
    type: Object as PropType<Indexable>,
    default: () => {}
  },
})

const { darkMode, locale } = useSetting()

const notePage = ref<InstanceType<typeof ONotePage>>()
const yiiEditor = ref<InstanceType<typeof YiiEditor>>()
const pageView = ref('page')
const localeAlt = ref(locale.value.toLowerCase())

const options = computed(() => {
  return {
    editable: false,
    locale: localeAlt.value,
    darkMode: darkMode.value,
    title: true,
    showMainMenu: false,
    showBubbleMenu: false,
    sideMenu: {
      show: false,
    },
    pageView: pageView.value,
    extensions: [
      'InlineMath',
      'Markdown',
      'OAiBlock',
      'OBlockMath',
      'OBlockquote',
      'OCallout',
      'OCodeBlock',
      'OColon',
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
    ]
  }
})

const editor = computed(() => {
  return yiiEditor.value?.editor
})

const styles: Indexable = computed(() => {
  return props.version.styles || {
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

function previewVersion() {
  if (editor.value) {
    if (props.version.type === 'update') {
      const updateBinary = base64ToUint8Array(props.version.doc)
      const historyDoc = new Y.Doc()
      Y.applyUpdate(historyDoc, updateBinary)

      const historyFragment = historyDoc.getXmlFragment('default')
      const historyContent = yXmlFragmentToProseMirrorRootNode(historyFragment, editor.value.schema)

      editor.value.commands.setContent(historyContent)
    } else if (props.version.type === 'full') {
      editor.value.commands.setContent(props.version.content)
    }
  }
}

watch(() => props.version, (newValue) => {
  previewVersion()
})

onMounted(() => {
  previewVersion()
})
</script>

<style lang="scss">
.note-version-viewer {
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
  }

  .o-scroll-wrapper {

    .layout {
      display: grid;
      grid-template-rows:
        auto
        1fr;

      &.page {
        grid-template-columns:
          [full-start] minmax(100px, 1fr)
          [content-start] minmax(400px, 800px)
          [content-end] minmax(100px, 1fr)
          [full-end];
      }

      &.full {
        grid-template-columns:
          [full-start] 100px
          [content-start] 1fr
          [content-end] 100px
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
      padding-top: 1rem;
      &.with-cover {
        padding-top: 0 !important;
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
  }
}
</style>
