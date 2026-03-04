import { ref, type Ref } from 'vue'
import { isCancel } from 'axios'
import { api as request } from 'src/boot/axios'
import { getCommonHeaders } from 'core/utils/common'
import useApi from 'src/hooks/useApi'

type StartStreamParams = {
  url: string;
  payload: any;
  onProgress?: (reasoningContent: string, content: string) => void;
  onDone?: (reasoningContent: string, content: string) => void;
  onErrorDone?: (chat: Indexable) => void;
  chunk?: boolean;
}

interface StreamEvent {
  type: string;
  content: string;
  finish_reason?: string;
}

interface UseStreamReturn {
  reasoningContent: Ref<string>;
  content: Ref<string>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
  startStream: ({
    url,
    payload,
    onProgress,
    onDone,
    onErrorDone,
    chunk,
  }: StartStreamParams) => Promise<void>;
  cancelStream: () => void;
}

export default function(): UseStreamReturn {
  const { apiBase } = useApi()
  const reasoningContent = ref('')
  const content = ref('')
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const controller = ref<AbortController | null>(null)

  const startStream = async ({
    url,
    payload,
    onProgress,
    onDone,
    onErrorDone,
    chunk = false
  }: StartStreamParams) => {
    isLoading.value = true
    error.value = null
    reasoningContent.value = ''
    content.value = ''
    controller.value = new AbortController()
    let chunkBuffer = ''

    try {
      const headers = getCommonHeaders() as any as HeadersInit
      const res = await fetch(apiBase.value + url, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.value?.signal,
      })

      if (res.ok && res.body) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { value, done } = await reader.read()
          if (done) break

          // Decode current chunk and append to buffer
          chunkBuffer += decoder.decode(value, { stream: true })

          // SSE messages are typically separated by double newlines
          const messages = chunkBuffer.split('\n\n')

          // Keep the last partial segment in the buffer for the next iteration
          chunkBuffer = messages.pop() || ''

          for (const message of messages) {
            const line = message.trim()
            if (!line) continue

            // console.log('line', line)
            // Check for custom end-of-stream event
            if (line.includes('event: [DONE]')) {
              onDone?.(reasoningContent.value, content.value)
              return
            }

            // Process standard SSE data fields
            if (line.startsWith('data: ')) {
              try {
                const jsonStr = line.replace('data: ', '').trim()
                const event = JSON.parse(jsonStr) as StreamEvent

                if (event.type === 'reasoning') {
                  if (chunk) {
                    reasoningContent.value = event.content
                  } else {
                    reasoningContent.value += event.content
                  }
                } else {
                  if (chunk) {
                    content.value = event.content
                  } else {
                    content.value += event.content
                  }
                }

                // Trigger progress callback with updated strings
                onProgress?.(reasoningContent.value, content.value)
              } catch (e) {
                // If parsing fails, the message might be incomplete; push back to buffer
                chunkBuffer = message + '\n\n' + chunkBuffer
              }
            }
          }
        } // while
      } else if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        const chat = errorData.data
        if (chat.result === -1) {
          onErrorDone?.(chat)
        }
      }
    } catch (err: any) {
      if (!isCancel(err)) {
        error.value = err as Error
      }
    } finally {
      isLoading.value = false
    }

  }

  const startStream0 = async ({
                               url,
                               payload,
                               onProgress,
                               onDone,
                               onErrorDone,
                               chunk = false
                             }: StartStreamParams) => {
    isLoading.value = true
    error.value = null
    reasoningContent.value = ''
    content.value = ''
    controller.value = new AbortController()

    try {
      const res = await request({
        url: url,
        method: 'POST',
        data: payload,
        signal: controller.value?.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'stream'
        },
        responseType: 'text', // stream
        onDownloadProgress: (progressEvent) => {
          const rawData = progressEvent.event.target?.responseText
          console.log('=============', rawData)
          if (!rawData) return

          const lines = rawData
            ?.split('\n\n')
            .filter((line: string) => line.startsWith('data: ') || line.startsWith('event: '))

          let done = false
          let text = ''
          let reasoningText = ''
          lines?.forEach((line: string) => {
            try {
              if (line.includes('event: [DONE]')) {
                console.log('DONE')
                done = true
                return
              }

              const jsonStr = line.replace('data: ', '').trim()
              const event = JSON.parse(jsonStr) as StreamEvent
              if (event.type === 'reasoning') {
                reasoningText += event.content
              } else {
                text += event.content
              }
              // const message = line.replace('data: ', '').trim();
              // text += message
            } catch (e) {
              console.warn('Parse error:', e)
            }
          })
          content.value = text
          reasoningContent.value = reasoningText
          onProgress?.(reasoningContent.value, content.value)
          if (done) {
            onDone?.(reasoningContent.value, content.value)
          }
        }
      })

      // may error
      const data = JSON.parse(res.data)
      const chat = data.data
      if (chat.result === -1) {
        onErrorDone?.(chat)
      }
    } catch (err) {
      if (!isCancel(err)) {
        error.value = err as Error
      }
    } finally {
      isLoading.value = false
    }
  }

  const cancelStream = () => {
    controller.value?.abort()
  }

  return {
    reasoningContent,
    content,
    isLoading,
    error,
    startStream,
    cancelStream
  }
}
