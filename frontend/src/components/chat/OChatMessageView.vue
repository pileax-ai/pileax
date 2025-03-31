<template>
  <YiiEditor ref="yiiEditor"
             class="o-chat-message-view"
             v-bind="options" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { YiiEditor } from '@yiitap/vue';
import '@yiitap/vue/dist/vue.css';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  breaks: true,
})

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
})
const emit = defineEmits(['send']);

const yiiEditor = ref<InstanceType<typeof YiiEditor>>();
const options = computed(() => {
  return {
    editable: false,
    content: '',
    pageView: 'full',
    extensions: [
      'OBlockquote',
      'OCallout',
      'OCodeBlock',
      'OColon',
      'OColorHighlighter',
      'OImage',
      'OParagraph',
      'OLink',
      'OVideo',
    ],
  }
})

const editor = computed(() => {
  return yiiEditor.value?.editor;
})

function setContent () {
  const content = md.render(props.message);
  editor.value?.commands.setContent(content, true);
}

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
}
</style>
