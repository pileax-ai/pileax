
import { useAiStore } from 'stores/ai';
import { computed } from 'vue'

export default function() {
  const aiStore = useAiStore();

  const provider = computed(() => {
    return aiStore.provider;
  });

  return {
    aiStore,
    provider,
  }
}
