import { watch } from 'vue'
import useAccount from 'src/hooks/useAccount'
import useAi from 'src/hooks/useAi'
import useNote from 'src/hooks/useNote'
import useWorkspaceCollab from 'src/hooks/useWorkspaceCollab'
import { CollabEvent } from 'src/types/collab'
import useOpenFile from 'src/hooks/useOpenFile'

export default function () {
  const { workspace, initWorkspace } = useAccount()
  const { initAiSettings, checkAiSettings } = useAi()
  const { initNoteData, refreshNote, deleteNote } = useNote()
  const { initOpenFile } = useOpenFile()
  const { initCollab, resetCollab, subscribeCollabEvent } = useWorkspaceCollab()

  function initCheck() {
    setTimeout(() => {
      checkAiSettings()
    }, 30 * 1000)
  }

  /**
   * Init workspace data
   */
  async function initWorkspaceData() {
    if (workspace.value.id) {
      await initAiSettings()
      initCheck()
      initNoteData()
      initWorkspaceCollab()
      initOpenFile()
    }
  }

  /**
   * Refresh workspace data
   */
  async function refreshWorkspaceData() {
    await initAiSettings()
    initCheck()
    initNoteData()
  }

  function initWorkspaceCollab() {
    if (workspace.value.id) {
      if (workspace.value.type === 'team') {
        initCollab()
        initSubscriptions()
      } else {
        resetCollab()
      }
    }
  }

  function initSubscriptions() {
    const unsubscribeRefresh = subscribeCollabEvent(CollabEvent.NOTE_REFRESH, (meta) => {
      refreshNote(meta, false)
    })
    const unsubscribeDelete = subscribeCollabEvent(CollabEvent.NOTE_DELETE, (meta) => {
      deleteNote(meta, false)
    })

    // onUnmounted(() => {
    //   if (unsubscribe) {
    //     unsubscribe()
    //   }
    // })
  }

  watch(workspace, (newValue, oldValue) => {
    // console.log(`workspace: ${oldValue.id} -> ${newValue.id}`, newValue)
    if (newValue.id) {
      refreshWorkspaceData()
      initWorkspaceCollab()
    }
  })

  return {
    initWorkspaceData,
    initOpenFile,
  }
}
