
import { useAiStore } from 'stores/ai';
import { computed } from 'vue'
import { useAccountStore } from 'stores/account'

export default function() {
  const accountStore = useAccountStore();

  const aiStore = computed(() => {
    const currentWorkspaceId = accountStore.workspaceId;
    return useAiStore();
  });

  const provider = computed(() => {
    return aiStore.value.provider;
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

  return {
    aiStore,
    provider,
    defaultModels,
    initAiSettings,
    getDefaultModels,
    updateLocalDefaultModels,
  }
}
