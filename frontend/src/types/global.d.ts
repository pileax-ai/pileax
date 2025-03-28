import type {OpenDialogOptions} from 'electron';

declare global {
  interface Window {
    electronAPI: {
      hi: (message: string) => void;
      showDialog: (options: OpenDialogOptions) => Promise<any>;
      getServerInfo: () => Promise<Indexable>;
      openNewWindow: (id: string, url: string) => Promise<any>;
      readFile: (filePath: string) => Promise<any>;
      readImage: (filePath: string) => Promise<any>;
      readBookFile: (filePath: string) => Promise<any>;
      readBookCover: (filePath: string) => Promise<any>;
      saveBookFiles: (metadata: any) => Promise<any>;
      saveImageFile: (metadata: any) => Promise<any>;
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
    };
  }

}
export {};
