import { ref, type Ref } from 'vue';
import { isCancel } from 'axios';
import { api as request } from 'src/boot/axios';

interface StreamEvent {
  content: string;
  finish_reason?: string;
}

interface UseStreamReturn {
  response: Ref<string>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
  startStream: (
    url: string,
    payload: any,
    onProgress?: (text: string) => void,
    onDone?: (text: string) => void,
  ) => Promise<void>;
  cancelStream: () => void;
}

export default function(): UseStreamReturn {
  const response = ref('');
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  const controller = ref<AbortController | null>(null);

  const processStreamData = (data: string): string | null => {
    try {
      if (data.includes('[DONE]')) return null;

      const jsonStr = data.replace('data: ', '').trim();
      const event = JSON.parse(jsonStr) as StreamEvent;
      return event.content || null;
    } catch (e) {
      console.warn('Failed to parse stream chunk:', e);
      return null;
    }
  };

  const startStream = async (
    url: string,
    payload: any,
    onProgress?: (text: string) => void,
    onDone?: (text: string) => void,
  ) => {
    isLoading.value = true;
    error.value = null;
    response.value = '';
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

          let content = '';
          let done = false;
          lines?.forEach((line: string) => {
            try {
              if (line.includes('[DONE]')) {
                done = true;
                return;
              }

              const jsonStr = line.replace('data: ', '').trim();
              const event = JSON.parse(jsonStr) as StreamEvent;
              content += event.content;
            } catch (e) {
              console.warn('Parse error:', e);
            }
          });
          response.value = content;
          onProgress?.(response.value);
          if (done) {
            onDone?.(content);
          }
        }
      });
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
    response,
    isLoading,
    error,
    startStream,
    cancelStream
  };
}
