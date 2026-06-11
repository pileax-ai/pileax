<template>
  <section class="book-css-settings layout">
    <YiiCodeEditor
      ref="yiiEditor"
      class="layout-content"
      v-bind="editorOptions"
      @update="onUpdate"
    />

    <footer class="row col-12 justify-center items-center">
      <q-btn :label="$t('save')" class="bg-primary text-white" @click="onSave" flat />
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Editor } from '@tiptap/core'
import {
  YiiCodeEditor,
} from '@yiitap/vue'
import useBook from 'src/hooks/useBook'
import { changeStyle } from 'src/api/service/ebook/book'
import useReaderSetting from 'src/hooks/useReaderSetting'

defineProps({
  fixedLayout: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['next'])

const { bookCss, setBookCss } = useBook()
const { settings } = useReaderSetting()
const editingCSS = ref('')

const bookCSS = computed({
  get() {
    return bookCss.value
  },
  set(value: string) {
    setBookCss(value)
    changeStyle({
      ...settings.value,
      bookCSS: value
    })
  }
})

const editorOptions = computed(() => {
  return {
    editable: true,
    content:
      `<pre><code class="language-css">${bookCSS.value}</code></pre>`,
    pageView: 'page',
  }
})

function onUpdate({ editor, language, code, }: { editor: Editor, language: string, code: string }) {
  editingCSS.value = code
}

function onSave() {
  bookCSS.value = editingCSS.value
}

onMounted(() => {
  editingCSS.value = bookCSS.value
})
</script>

<style lang="scss">
.book-css-settings {
  height: calc(100vh - 80px);

  .editor-content {
    padding: 0 0 60px 0;
  }

  .ProseMirror {
    padding: 0;

    .o-code-block-view {
      margin: 0;

      .code-block-toolbar {
        display: none;
      }

      pre {
        background: transparent;
      }
    }
  }

  footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    border-top: solid 1px var(--q-accent);
    background: var(--q-secondary);

    .q-btn {
      min-width: 120px;
    }
  }
}
</style>
