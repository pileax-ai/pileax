import type { OpenDialogOptions, SaveDialogOptions } from 'electron'

declare global {
  interface Window {
    electronAPI: {
      hi: (message: string) => void;
      closeWindow: () => Promise<any>;
      dbExecute: (entity: string, method: string, params: any) => Promise<any>;
      getPath: (key: string) => Promise<string>;
      getServerInfo: () => Promise<Indexable>;
      isWindowMaximized: () => Promise<boolean>;
      maximizeWindow: () => Promise<any>;
      minimizeWindow: () => Promise<any>;
      migrateLibrary: (options: any) => Promise<any>;
      openNewWindow: (id: string, url: string, titleBarHeight = 40) => Promise<any>;
      readBookCover: (filePath: string) => Promise<any>;
      readBookFile: (filePath: string) => Promise<any>;
      readFile: (filePath: string) => Promise<any>;
      readImage: (filePath: string) => Promise<any>;
      reload: (force: boolean) => Promise<any>;
      saveBookFiles: (metadata: any) => Promise<any>;
      saveImageFile: (metadata: any) => Promise<any>;
      setTheme: (theme: 'system' | 'light' | 'dark') => Promise<any>;
      showDialog: (options: OpenDialogOptions) => Promise<any>;
      showSaveDialog: (options: SaveDialogOptions) => Promise<any>;
    };

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
