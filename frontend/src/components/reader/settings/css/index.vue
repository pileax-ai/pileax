<template>
  <section class="css-settings layout">
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
import useReaderSetting from 'src/hooks/useReaderSetting'

defineProps({
  fixedLayout: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['next'])

const { settings, setSettingItem } = useReaderSetting()
const editingCSS = ref('')

const bookCSS = computed({
  get() {
    return settings.value.bookCSS
  },
  set(value: string) {
    setSettingItem('bookCSS', value)
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
  // code
  console.debug('language', language)
  console.debug('code', code)
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
.css-settings {
  height: calc(100vh - 40px);

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
