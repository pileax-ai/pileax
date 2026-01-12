const positionValues = [
  'bottom right', 'bottom left', 'bottom middle', 'bottom start', 'bottom end',
  'top right', 'top left', 'top middle', 'top start', 'top end',
  'center right', 'center left', 'center middle', 'center start', 'center end',
] as const

declare global {
  type Indexable<T = any> = {
    [key: string]: T;
  };
  type PositionType = typeof positionValues[number];

  interface KeyValue {
    key: string,
    value: any
  }

  interface OptionValue {
    label: string;
    value: string | number;
    name?: string;
    icon?: string;
    color?: string;
    tips?: string;
  }

  interface Action {
    action: string | number,
    path: string,
    link?: string,
    type?: string
  }

  const __APP_INFO__: {
    package: {
      name: string;
      version: string;
      dependencies: Indexable[];
    };
    build: {
      mode: string;
      time: string;
    }
  }
}
export {}
