<template>
  <YiiEditor ref="yiiEditor"
             class="o-note-viewer"
             v-bind="options" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { YiiEditor, OStarterKit } from '@yiitap/vue'
import '@yiitap/vue/dist/vue.css'
import MarkdownIt from 'markdown-it'
import useSetting from 'core/hooks/useSetting'

const md = new MarkdownIt({
  breaks: true,
})

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  markdown: {
    type: Boolean,
    default: false
  },
})

const { darkMode, locale } = useSetting()
const yiiEditor = ref<InstanceType<typeof YiiEditor>>()
const options = computed(() => {
  return {
    editable: false,
    locale: locale.value,
    darkMode: darkMode.value,
    content: '',
    pageView: 'full',
    extensions: [
      OStarterKit.configure(),
      'InlineMath',
      'Markdown',
      'OBlockMath',
      'OColorHighlighter',
      'ODetails',
      'OImage',
      'OVideo',
    ],
  }
})

const editor = computed(() => {
  return yiiEditor.value?.editor
})

function setContent () {
  const content = props.markdown
    ? md.render(props.content)
    : props.content
  editor.value?.commands.setContent(content)
}

watch(() => props.content, (newValue) => {
  setContent()
})

onMounted(() => {
  setContent()
})
</script>

<style lang="scss">
.o-note-viewer {
  .editor-content {
    padding: 0 !important;
    width: 100%;
  }

  .ProseMirror {
    padding: 0;
  }

  table {
    width: unset;
    th, td {
      border-left: none;
      border-right: none;
    }
  }

  &.error {
    .ProseMirror p {
      color: red!important;
    }
  }
}
</style>
