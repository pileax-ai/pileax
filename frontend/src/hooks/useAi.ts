
import { useAiStore } from 'stores/ai'
import { computed } from 'vue'
import { useWorkspaceStore } from 'src/stores/workspace'
import useCommon from 'core/hooks/useCommon'
import useDialog from 'core/hooks/useDialog'
import useGuide from 'src/hooks/useGuide'
import { notifyWarning } from 'core/utils/control'

export default function() {
  const workspaceStore = useWorkspaceStore()
  const { t } = useCommon()
  const { openDialog } = useDialog()
  const { showGuide } = useGuide()

  const aiStore = computed(() => {
    const currentWorkspaceId = workspaceStore.workspaceId
    return useAiStore(currentWorkspaceId)
  })

  const provider = computed(() => {
    return aiStore.value.provider
  })

  const localModels = computed(() => {
    return aiStore.value.localModels
  })

  const localChatModel = computed(() => {
    return localModels.value['chat']
  })

  const defaultModels = computed(() => {
    return aiStore.value.defaultModels
  })

  const defaultChatModel = computed(() => {
    return aiStore.value.defaultModels.find(m => m.modelType === 'chat')
  })

  const chatModel = computed(() => {
    return localChatModel.value || defaultChatModel.value || {}
  })

  const initAiSettings = async () => {
    await getDefaultModels()
  }

  const checkAiSettings = ({notify = 'dialog', alwaysShow = false} = {}) => {
    const aiAvailable = (defaultModels.value.length > 0)
    if (!aiAvailable) {
      if (notify === 'dialog') {
        showGuide('ai-guide', {
          icon: 'mdi-creation-outline',
          title: t('ai.providers.set'),
          message: t('ai.providers.setTips'),
          ok: t('ai.settings'),
          alwaysShow: alwaysShow,
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
    localChatModel,
    defaultModels,
    chatModel,
    initAiSettings,
    checkAiSettings,
    getDefaultModels,
    updateLocalDefaultModels,
    setLocalModel,
    getLocalModel,
  }
}
