import { computed, ref } from 'vue'
import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'

import useAccount from 'src/hooks/useAccount'
import { getCollabToken } from 'src/utils/auth'
import { useWorkspaceCollabStore } from 'stores/workspace-collab'
import { CollabCallback, CollabEvent } from 'src/types/collab'

export default function () {
  const { workspace } = useAccount()

  const store = computed(() => {
    return useWorkspaceCollabStore(workspace.value.id)
  })

  const enabled = computed(() => {
    return store.value.enabled
  })

  const ydocId = computed(() => {
    return `workspace@${workspace.value.id}`
  })

  const hpProvider = computed(() => {
    return store.value.provider
  })

  const ydoc = computed(() => {
    return store.value.ydoc
  })

  const collabReady = computed(() => {
    return store.value.collabReady
  })

  const collab = ref({
    enabled,
    ydocId,
    ydoc,
    hpProvider,
    collabReady,
  })

  const initCollab = async () => {
    console.debug('Init workspace collab ...')
    if (hpProvider.value) {
      console.debug('Reuse workspace collab ...')
      return
    }

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
        store.value.setCollabReady(true)
      },
      onDisconnect: () => {
        store.value.setCollabReady(false)
      }
    })
    provider.on('stateless', ({ payload }: { payload: string }) => {
      const { event, meta } = JSON.parse(payload)
      store.value.dispatchEvent(event, meta)
    })

    store.value.setEnabled(true)
    store.value.setYdoc(doc)
    store.value.setYdocId(ydocId.value)
    store.value.setProvider(provider)
  }

  const resetCollab = () => {
    // console.debug('Reset workspace collab ...', hpProvider.value)
    if (hpProvider.value) {
      hpProvider.value.destroy()
      store.value.setProvider(null)
    }

    if (ydoc.value) {
      ydoc.value.destroy()
      store.value.setYdoc(null)
    }

    store.value.setEnabled(false)
    store.value.setYdocId('')
    store.value.setCollabReady(false)
    store.value.resetEventBus()
  }

  // ------------------------------------------------------------
  // Pub/Sub event
  // ------------------------------------------------------------
  const publishCollabEvent = (event: CollabEvent, meta = {}) => {
    if (!enabled.value) return
    hpProvider.value?.sendStateless(JSON.stringify({
      event,
      meta
    }))
  }

  const subscribeCollabEvent = (event: CollabEvent, cb: CollabCallback) => {
    if (!enabled.value) return

    store.value.addSubscription(event, cb)
    return () => store.value.removeSubscription(event, cb)
  }

  return {
    collab,
    initCollab,
    resetCollab,
    publishCollabEvent,
    subscribeCollabEvent,
  }
}
