import { defineStore } from 'pinia';
import { CODE } from 'core/app';

export const useAiStore = defineStore('ai', {
  state: () => ({
    llm: 'deepseek',
    llmMeta: {} as Indexable,
  }),
  actions: {
    setLlm(value: string) {
      this.llm = value;
    },
    setLlmMeta(value: Indexable) {
      this.llm = value.name;
      this.llmMeta = value;
    },
  },
  persist: {
    key: `${CODE}.ai`
  }
});
