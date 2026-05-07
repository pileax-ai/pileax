<template>
  <YiiEditor ref="yiiEditor"
             class="o-markdown-view"
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
  text: {
    type: String,
    default: ''
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
  const content = md.render(props.text)
  editor.value?.commands.setContent(content)
}

watch(() => props.text, (newValue) => {
  setContent()
})

onMounted(() => {
  setContent()
})
</script>

<style lang="scss">
.o-markdown-view {
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
