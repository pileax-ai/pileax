
import { useAiStore } from 'stores/ai'
import { computed } from 'vue'
import { useAccountStore } from 'stores/account'
import useCommon from 'core/hooks/useCommon'
import useDialog from 'core/hooks/useDialog'
import useGuide from 'src/hooks/useGuide'
import { notifyWarning } from 'core/utils/control'

export default function() {
  const accountStore = useAccountStore()
  const { t } = useCommon()
  const { openDialog } = useDialog()
  const { showGuide } = useGuide()

  const aiStore = computed(() => {
    const currentWorkspaceId = accountStore.workspaceId
    return useAiStore(currentWorkspaceId)
  })

  const provider = computed(() => {
    return aiStore.value.provider
  })

  const localModels = computed(() => {
    return aiStore.value.localModels
  })

  const defaultModels = computed(() => {
    return aiStore.value.defaultModels
  })

  const initAiSettings = async () => {
    await getDefaultModels()
  }

  const checkAiSettings = (notify = 'dialog') => {
    const aiAvailable = (defaultModels.value.length > 0)
    if (!aiAvailable) {
      if (notify === 'dialog') {
        showGuide('ai-guide', {
          icon: 'mdi-creation-outline',
          title: t('ai.providers.set'),
          message: t('ai.providers.setTips'),
          ok: t('ai.settings'),
          onOk: () => {
            setTimeout(() => {
              openDialog({type: 'settings', tab: 'ai'})
            }, 0)
          }
        })
      } else if (notify === 'notify') {
        notifyWarning('Set AI providers to enable AI capabilities.', {
          position: 'top-right'
        })
      }
    }
    return aiAvailable
  }

  const getDefaultModels = async () => {
    await aiStore.value.getDefaultModels()
  }

  const updateLocalDefaultModels = (item: Indexable) => {
    aiStore.value.updateLocalDefaultModels(item)
  }

  const setLocalModel = (type: string, value: Indexable) => {
    aiStore.value.setLocalModel(type, value)
  }

  const getLocalModel = (type: string) => {
    return aiStore.value.getLocalModel(type)
  }

  return {
    aiStore,
    provider,
    localModels,
    defaultModels,
    initAiSettings,
    checkAiSettings,
    getDefaultModels,
    updateLocalDefaultModels,
    setLocalModel,
    getLocalModel,
  }
}
