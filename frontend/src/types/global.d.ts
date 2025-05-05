import type {OpenDialogOptions} from 'electron';

declare global {
  interface Window {
    electronAPI: {
      hi: (message: string) => void;
      showDialog: (options: OpenDialogOptions) => Promise<any>;
      getServerInfo: () => Promise<Indexable>;
      openNewWindow: (id: string, url: string, titleBarHeight = 40) => Promise<any>;
      minimizeWindow: () => Promise<any>;
      maximizeWindow: () => Promise<any>;
      closeWindow: () => Promise<any>;
      isWindowMaximized: () => Promise<boolean>;
      readFile: (filePath: string) => Promise<any>;
      readImage: (filePath: string) => Promise<any>;
      readBookFile: (filePath: string) => Promise<any>;
      readBookCover: (filePath: string) => Promise<any>;
      saveBookFiles: (metadata: any) => Promise<any>;
      saveImageFile: (metadata: any) => Promise<any>;
      setTheme: (theme: 'system' | 'light' | 'dark') => Promise<any>;
      dbExecute: (entity: string, method: string, params: any) => Promise<any>;
    };

    ebook: {
      open: (bookElement: any, data: any, cfi: string, importing: boolean) => Promise<any>;
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
