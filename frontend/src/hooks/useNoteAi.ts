
import { computed, ref } from 'vue'
import useAi from 'src/hooks/useAi'
import useStream from 'src/hooks/useStream'
import { AiOptions, AiProvider, ChatMessage, type CompletionOptions } from '@yiitap/vue'

export default function() {
  const { chatModel, checkAiSettings } = useAi()
  const { startStream } = useStream()
  const noteId = ref('')

  const initNoteAi = (id: string) => {
    noteId.value = id
  }

  const onStreamingChatCompletion = async ({
    messages,
    onChunk,
    options,
  }: CompletionOptions) => {
    if (!checkAiSettings({ alwaysShow: true })
      || messages.length === 0) {
      return
    }
    console.table(messages)

    const lastMessage = messages.at(-1)
    const payload = {
      conversationId: options?.id || noteId.value,
      message: lastMessage?.content,
      refId: noteId.value,
      refType: options?.type === 'ai-block'
        ? 'note-block'
        : 'note-content',
      modelProvider: chatModel.value.provider,
      modelName: chatModel.value.modelName,
      modelType: chatModel.value.modelType,
    }
    console.table(payload)

    await startStream({
      url: '/chat/note/completions',
      payload: payload,
      chunk: true,
      onProgress: (reasoningContent: string, content: string) => {
        onChunk(content)
      }
    })

    return ''
  }

  const aiOptions = computed(() => {
    const { provider, modelName, modelType } = chatModel.value
    return {
      provider: {
        provider, modelName, modelType
      } as AiProvider,
      onStreamingChatCompletion,
    } as AiOptions
  })

  return {
    initNoteAi,
    onStreamingChatCompletion,
    aiOptions
  }
}
