
import { useAiStore } from 'stores/ai';
import { computed } from 'vue'

export default function() {
  const aiStore = useAiStore();

  const llm = computed(() => {
    return aiStore.llm;
  });

  return {
    aiStore,
    llm,
  }
}
