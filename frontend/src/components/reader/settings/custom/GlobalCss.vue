<template>
  <section class="global-css-settings layout">
    <header class="row col-12 justify-between items-center text-readable">
      <div style="margin-left: -10px;">
         <q-checkbox v-model="globalCSSEnabled" />{{ $t('reading.setting.style.globalCssTips') }}
      </div>
      <div>
        <q-icon name="help"
                size="1.4rem"
                class="text-tips cursor-pointer"
                @click="openGuide('reading/styles/global')">
          <o-tooltip position="left" transition>{{ $t('help') }}</o-tooltip>
        </q-icon>
      </div>
    </header>
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
import useGuide from 'src/hooks/useGuide'

defineProps({
  fixedLayout: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['next'])

const { openGuide } = useGuide()
const { settings, setSettingItem } = useReaderSetting()
const editingCSS = ref('')

const globalCSS = computed({
  get() {
    return settings.value.globalCSS
  },
  set(value: string) {
    setSettingItem('globalCSS', value)
  }
})

const globalCSSEnabled = computed({
  get() {
    return settings.value.globalCSSEnabled
  },
  set(value: string) {
    setSettingItem('globalCSSEnabled', value)
  }
})

const editorOptions = computed(() => {
  return {
    editable: true,
    content:
      `<pre><code class="language-css">${globalCSS.value}</code></pre>`,
    pageView: 'page',
  }
})

function onUpdate({ editor, language, code, }: { editor: Editor, language: string, code: string }) {
  editingCSS.value = code
}

function onSave() {
  globalCSS.value = editingCSS.value
}

onMounted(() => {
  editingCSS.value = globalCSS.value
})
</script>

<style lang="scss">
.global-css-settings {
  height: calc(100vh - 80px);

  .editor-content {
    padding: 40px 0 60px 0;
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

  header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    padding: 0 1rem !important;
    background: var(--q-secondary) !important;
    z-index: 1;
  }

  footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    border-top: solid 1px var(--q-accent);
    background: var(--q-secondary);
    z-index: 1;

    .q-btn {
      min-width: 120px;
    }
  }
}
</style>
