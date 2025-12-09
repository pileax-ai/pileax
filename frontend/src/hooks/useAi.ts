
import { useAiStore } from 'stores/ai';
import { computed } from 'vue'
import { useAccountStore } from 'stores/account'

export default function() {
  const accountStore = useAccountStore();

  const aiStore = computed(() => {
    const currentWorkspaceId = accountStore.workspaceId;
    return useAiStore(currentWorkspaceId);
  });

  const provider = computed(() => {
    return aiStore.value.provider;
  })

  const localModels = computed(() => {
    return aiStore.value.localModels;
  })

  const defaultModels = computed(() => {
    return aiStore.value.defaultModels;
  })

  const initAiSettings = () => {
    getDefaultModels()
  }

  const getDefaultModels = () => {
    aiStore.value.getDefaultModels()
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
    getDefaultModels,
    updateLocalDefaultModels,
    setLocalModel,
    getLocalModel,
  }
}
