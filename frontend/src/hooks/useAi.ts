
import { useAiStore } from 'stores/ai';
import { computed } from 'vue'

export default function() {
  const aiStore = useAiStore();

  const provider = computed(() => {
    return aiStore.provider;
  })

  const defaultModels = computed(() => {
    return aiStore.defaultModels;
  })

  const initAiSettings = () => {
    getDefaultModels()
  }

  const getDefaultModels = () => {
    aiStore.getDefaultModels()
  }

  const updateLocalDefaultModels = (item: Indexable) => {
    aiStore.updateLocalDefaultModels(item)
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
