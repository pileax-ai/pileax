import { shallowRef, markRaw } from 'vue'
import * as Y from 'yjs'
import { defineStore } from 'pinia'

import { CODE } from 'core/app'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { CollabCallback, CollabEvent } from 'src/types/collab'

export const useWorkspaceCollabStore = defineStore('workspace-collab', {
  state: () => ({
    enabled: false,
    provider: shallowRef<HocuspocusProvider | null>(null),
    ydoc: shallowRef<Y.Doc | null>(null),
    ydocId: '',
    collabReady: false,
    eventBus: markRaw(new Map<CollabEvent, Set<CollabCallback>>())
  }),
  actions: {
    setEnabled(value: boolean) {
      this.enabled = value
    },
    setProvider(value: HocuspocusProvider | null) {
      this.provider = value ? markRaw(value) : null
    },
    setYdoc(value: Y.Doc | null) {
      this.ydoc = value
    },
    setYdocId(value: string) {
      this.ydocId = value
    },
    setCollabReady(value: boolean) {
      this.collabReady = value
    },
    resetEventBus() {
      this.eventBus = new Map<CollabEvent, Set<CollabCallback>>()
    },
    addSubscription(event: CollabEvent, cb: CollabCallback) {
      if (!this.eventBus.has(event)) {
        this.eventBus.set(event, new Set())
      }
      this.eventBus.get(event)!.add(cb)
    },
    removeSubscription(event: CollabEvent, cb: CollabCallback) {
      this.eventBus.get(event)?.delete(cb)
    },
    dispatchEvent(event: CollabEvent, meta: any) {
      const listeners = this.eventBus.get(event)
      if (listeners) {
        listeners.forEach(cb => cb(meta))
      }
    }
  },
  persist: {
    key: `${CODE}.collab`,
    pick: ['enabled', 'ydocId', 'collabReady']
  }
})
