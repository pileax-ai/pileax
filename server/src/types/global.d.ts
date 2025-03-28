declare global {
  type Indexable<T = any> = {
    [key: string]: T;
  };

  interface KeyValue {
    key: string,
    value: any
  }
}
export {};
