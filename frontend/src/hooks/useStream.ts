import { ref, type Ref } from 'vue';
import { isCancel } from 'axios';
import { api as request } from 'src/boot/axios';

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
  startStream: (
    url: string,
    payload: any,
    onProgress?: (reasoningContent: string, content: string) => void,
    onDone?: (reasoningContent: string, content: string) => void,
    onErrorDone?: (chat: Indexable) => void,
  ) => Promise<void>;
  cancelStream: () => void;
}

export default function(): UseStreamReturn {
  const reasoningContent = ref('');
  const content = ref('');
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  const controller = ref<AbortController | null>(null);

  const startStream = async (
    url: string,
    payload: any,
    onProgress?: (reasoningContent: string, content: string) => void,
    onDone?: (reasoningContent: string, content: string) => void,
    onErrorDone?: (chat: Indexable) => void,
  ) => {
    isLoading.value = true;
    error.value = null;
    reasoningContent.value = '';
    content.value = '';
    controller.value = new AbortController();

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
          const rawData = progressEvent.event.target?.responseText;
          // console.log('=============', rawData)
          if (!rawData) return;

          const lines = rawData
            ?.split('\n\n')
            .filter((line: string) => line.startsWith('data: '));

          let text = '';
          let reasoningText = '';
          let done = false;
          lines?.forEach((line: string) => {
            try {
              if (line.includes('[DONE]')) {
                done = true;
                return;
              }

              const jsonStr = line.replace('data: ', '').trim();
              const event = JSON.parse(jsonStr) as StreamEvent;
              if (event.type === 'reasoning') {
                reasoningText += event.content;
              } else {
                text += event.content;
              }
            } catch (e) {
              console.warn('Parse error:', e);
            }
          });
          content.value = text;
          reasoningContent.value = reasoningText;
          onProgress?.(reasoningContent.value, content.value);
          if (done) {
            onDone?.(reasoningContent.value, content.value);
          }
        }
      });

      // may error
      const data = JSON.parse(res.data);
      const chat = data.data;
      if (chat.result === -1) {
        onErrorDone?.(chat);
      }
    } catch (err) {
      if (!isCancel(err)) {
        error.value = err as Error;
      }
    } finally {
      isLoading.value = false;
    }
  };

  const cancelStream = () => {
    controller.value?.abort();
  };

  return {
    reasoningContent,
    content,
    isLoading,
    error,
    startStream,
    cancelStream
  };
}
