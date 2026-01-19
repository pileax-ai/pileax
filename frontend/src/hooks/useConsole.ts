import { computed, ref, watch } from 'vue'
import useAccount from 'src/hooks/useAccount'
import useAi from 'src/hooks/useAi'
import useNote from 'src/hooks/useNote'

export default function () {
  const { workspace, initWorkspace } = useAccount()
  const { initAiSettings, checkAiSettings } = useAi()
  const { initNoteData } = useNote()

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

  watch(workspace, (newValue, oldValue) => {
    console.log(`workspace: ${oldValue.id} -> ${newValue.id}`)
    if (newValue.id) {
      refreshWorkspaceData()
    }
  })

  return {
    initWorkspaceData
  }
}
