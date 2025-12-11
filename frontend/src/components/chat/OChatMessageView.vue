<template>
  <YiiEditor ref="yiiEditor"
             class="o-chat-message-view"
             v-bind="options" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { YiiEditor } from '@yiitap/vue'
import '@yiitap/vue/dist/vue.css'
import MarkdownIt from 'markdown-it'
import useSetting from 'core/hooks/useSetting'

const md = new MarkdownIt({
  breaks: true,
})

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
})
const emit = defineEmits(['send'])

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
      'OVideo',
    ],
  }
})

const editor = computed(() => {
  return yiiEditor.value?.editor
})

function setContent () {
  const content = md.render(props.message)
  editor.value?.commands.setContent(content, true)
}

watch(() => props.message, (newValue) => {
  setContent()
})

onMounted(() => {
  setContent()
})
</script>

<style lang="scss">
.o-chat-message-view {
  .editor-content {
    padding: 0 !important;
    width: 100%;
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
