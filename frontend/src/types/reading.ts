export interface BookTocItem {
  id: number;
  label: string;
  href: string;
  subitems?: BookTocItem[]
}

export enum BookOperation {
  Manual = 'manual',
  Load = 'load',
  Preview = 'preview',
  None = 'none',
}

export enum ReadingMode {
  Read = 'read',
  Preview = 'preview',
}
