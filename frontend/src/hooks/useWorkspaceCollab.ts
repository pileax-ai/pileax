import { computed, ref } from 'vue'
import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'

import useAccount from 'src/hooks/useAccount'
import { getCollabToken } from 'src/utils/auth'
import { useWorkspaceCollabStore } from 'stores/workspace-collab'
import { CollabCallback, CollabEvent } from 'src/types/collab'

export default function () {
  const store = useWorkspaceCollabStore()
  const { workspace } = useAccount()

  const enabled = computed(() => {
    return store.enabled
  })

  const ydocId = computed(() => {
    return `workspace@${workspace.value.id}`
  })

  const provider = computed(() => {
    return store.provider
  })

  const ydoc = computed(() => {
    return store.ydoc
  })

  const collabReady = computed(() => {
    return store.collabReady
  })

  const collab = ref({
    enabled,
    ydocId,
    ydoc,
    provider,
    collabReady,
  })

  const initCollab = async () => {
    console.debug('Init workspace collab ...')
    resetCollab()

    const doc = new Y.Doc({
      gc: false
    })
    const provider = new HocuspocusProvider({
      url: 'ws://localhost:9611',
      name: ydocId.value,
      document: doc,
      token: getCollabToken(),
      onConnect: () => {
        console.log('[Workspace] Hocuspocus connected')
        store.setCollabReady(true)
      },
      onDisconnect: () => {
        store.setCollabReady(false)
      }
    })
    provider.on('stateless', ({ payload }: { payload: string }) => {
      const { event, meta } = JSON.parse(payload)
      store.dispatchEvent(event, meta)
    })

    store.setEnabled(true)
    store.setYdoc(doc)
    store.setYdocId(ydocId.value)
    store.setProvider(provider)
  }

  const resetCollab = () => {
    // console.debug('Reset workspace collab ...', provider.value)
    if (provider.value) {
      provider.value.destroy()
      store.setProvider(null)
    }

    if (ydoc.value) {
      ydoc.value.destroy()
      store.setYdoc(null)
    }

    store.setEnabled(false)
    store.setYdocId('')
    store.setCollabReady(false)
    store.resetEventBus()
  }

  // ------------------------------------------------------------
  // Pub/Sub event
  // ------------------------------------------------------------
  const publishCollabEvent = (event: CollabEvent, meta = {}) => {
    if (!enabled.value) return
    provider.value?.sendStateless(JSON.stringify({
      event,
      meta
    }))
  }

  const subscribeCollabEvent = (event: CollabEvent, cb: CollabCallback) => {
    if (!enabled.value) return

    store.addSubscription(event, cb)
    return () => store.removeSubscription(event, cb)
  }

  return {
    collab,
    initCollab,
    resetCollab,
    publishCollabEvent,
    subscribeCollabEvent,
  }
}
