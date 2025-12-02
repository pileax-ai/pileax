import 'js/ebook.js';

export type EbookApi = {
  open: (bookElement: any, data: any,
         { cfi, importing, userStyle }:
         { cfi?: string, importing?: boolean, userStyle?: Indexable }) => Promise<any>;
  nextPage: () => void;
  prevPage: () => void;
  nextSection: () => Promise<any>,
  prevSection: () => Promise<any>,
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
  ttsNext: (move: boolean) => Promise<string>;
  ttsPrev: () => Promise<string>;
  ttsNextSection: () => Promise<string>;
  ttsPrevSection: () => Promise<string>;
}

export const createEbookRender = (): EbookApi => {
  let api: any = null;

  const handler: ProxyHandler<any> = {
    get: (_, prop: string) => {
      if (!api) {
        api = window.ebook;
        if (!api) throw new Error('window.ebook not loaded');
      }
      const fn = api[prop as keyof typeof api];
      return typeof fn === "function" ? fn.bind(api) : fn;
    }
  };

  return new Proxy({}, handler) as EbookApi;
}

export const ebookRender = createEbookRender();
