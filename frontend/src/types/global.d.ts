import type { OpenDialogOptions, SaveDialogOptions } from 'electron';
import type { IpcApi } from 'src/api/ipc';

declare global {
  interface Window {
    electronIpcAPI: IpcApi;
    tauriIpcAPI: IpcApi;
    webIpcAPI: IpcApi;

    ebook: {
      open: (bookElement: any, data: any,
             { cfi, importing, userStyle }:
             { cfi?: string, importing?: boolean, userStyle?: Indexable }) => Promise<any>;
      nextPage: () => void;
      prevPage: () => void;
      goToHref: (href: string) => void;
      goToPercent: (percent: number) => void;
      addAnnotation: (annotation: any) => void;
      removeAnnotation: (cfi: string) => void;
      renderAnnotations: (annotations: []) => void;
      changeStyle: (newStyle: Indexable) => void;
      search: (text: string, opts: Indexable) => void;
      clearSearch: () => void;
      ttsStart: () => Promise<string>;
      ttsStop: () => Promise<void>;
      ttsPrepare: () => Promise<void>;
      ttsNext: () => Promise<string>;
      ttsPrev: () => Promise<string>;
      ttsNextSection: () => Promise<string>;
      ttsPrevSection: () => Promise<string>;
    };
  }

}
export {};
