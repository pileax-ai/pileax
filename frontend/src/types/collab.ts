export enum CollabEvent {
  NOTE_ADD = 'NOTE_ADD',
  NOTE_DELETE = 'NOTE_DELETE',
  NOTE_REFRESH = 'NOTE_REFRESH',
}

export type CollabCallback = (meta?: any) => void
