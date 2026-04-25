<template>
  <q-page ref="notePage"
               class="page-note-share"
               :style="`--note-font: ${font}; --note-font-size: ${ styles.smallText ? '85%' : '100%' }`">
    <o-simple-toolbar :class="{ 'gradient': gradient }"
                      :show-logo="pageStatus === 404">
      <template #left>
        <o-common-item :icon="currentNote.icon" :label="currentNote.title" />
      </template>

      <template #right>
        <o-doc-toc ref="tocRef"
                   class="mobile-only"
                   trigger="click"
                   :editor="yiiEditor?.editor"
                   :max-level="3"
                   button />
      </template>
    </o-simple-toolbar>
    <q-scroll-area class="o-scroll-wrapper" @scroll="onScroll">
      <content404 v-if="pageStatus === 404"></content404>
      <section class="layout" :class="[pageView]" v-else>
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
                   v-if="currentNote.id" />

        <aside class="layout-right desktop-only">
          <div class="sticky-top">
            <o-doc-toc ref="tocRef"
                       :editor="yiiEditor?.editor"
                       :max-level="3" />
          </div>
        </aside>
      </section>
    </q-scroll-area>
  </q-page>
</template>

<script setup lang="ts">
import { QInput, QPage } from 'quasar'
import { useRoute } from 'vue-router'
import { useFavicon, useTitle } from '@vueuse/core'
import { computed, onActivated, ref, watch, watchEffect } from 'vue'
import { YiiEditor, ODocToc, OStarterKit, AnyExtension } from '@yiitap/vue'
import 'katex/dist/katex.min.css'

import useSetting from 'core/hooks/useSetting'
import OSimpleToolbar from 'core/page/toolbar/OSimpleToolbar.vue'
import NoteShareCover from 'components/note/NoteShareCover.vue'
import Content404 from 'core/page/content/Content404.vue'
import { noteShareService } from 'src/api/service/remote'
import { NoteDefaultIcon } from 'core/constants/constant'
import useCommon from 'core/hooks/useCommon'
import { createEmojiFavicon } from 'core/utils/url'

const { t } = useCommon()
const route = useRoute()
const { darkMode, locale } = useSetting()
const docTitle = useTitle('ABC')
const docFavicon = useFavicon()

const notePage = ref<InstanceType<typeof QPage>>()
const yiiEditor = ref<InstanceType<typeof YiiEditor>>()
const tocRef = ref<InstanceType<typeof ODocToc>>()
const noteShareId = ref('')
const currentNote = ref<Indexable>({})
const loading = ref(false)
const localeAlt = ref(locale.value.toLowerCase())
const pageView = ref('page')
const pageStatus = ref(200)
const scrollPosition = ref(0)

const gradient = computed(() => {
  return scrollPosition.value > 60
})

const options = computed(() => {
  return {
    content: currentNote.value.content,
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
    ] as any
  }
})

const styles: Indexable = computed(() => {
  return currentNote.value?.styles || {
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

function onScroll(info: any) {
  const event: Event | undefined = undefined
  tocRef.value?.onScroll(event as any)

  scrollPosition.value = info.verticalPosition
}

async function loadNote() {
  loading.value = true
  noteShareService.getDetails(noteShareId.value).then((note: any) => {
    pageStatus.value = 200
    currentNote.value = note || {}
  }).catch((err) => {
    if (err.response.status === 404) {
      pageStatus.value = 404
    }
  }).finally(() => {
    loading.value = false
  })
}

const dynamicFavicon = computed(() => {
  if (pageStatus.value !== 200) {
    return '/logo.png'
  }
  return createEmojiFavicon(currentNote.value.icon || NoteDefaultIcon)
})

watchEffect(() => {
  docTitle.value = currentNote.value.title || t('product.name')
})

watch(dynamicFavicon, (newIcon) => {
  docFavicon.value = newIcon
})

watch(locale, (newValue) => {
  localeAlt.value = newValue.toLowerCase()
})

onActivated(() => {
  noteShareId.value = route.params.id as string

  loadNote()
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

  .o-simple-toolbar {
    height: 60px;
    background: var(--q-secondary);
    z-index: 1;

    &.gradient {
      background: linear-gradient(to right,
        var(--q-secondary) 10%,
        transparent 80%,
        var(--q-secondary) 90%);
    }
  }

  .o-scroll-wrapper {
    .layout {
      padding-top: 60px;
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

.mobile .page-note-share {
  .o-simple-toolbar {
    padding: 0 6px;
    background: var(--q-secondary) !important;

    .o-toolbar-extra {
      padding: 0;
    }
  }

  .layout {
    .note-share-cover {
      height: 200px;
    }

    &.page {
      grid-template-columns:
          [full-start] minmax(0, 1fr)
          [content-start] minmax(400px, 900px)
          [content-end] minmax(0, 1fr)
          [full-end];
    }

    .title, .note-meta-wrapper, .ProseMirror {
      padding-inline: 1rem;
    }
  }
}
</style>
