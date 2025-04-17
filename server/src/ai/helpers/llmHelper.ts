export const getLLM = async (provider: string, model: string) => {
  switch (provider) {
    case 'deepseek':
      const { DeepSeekLLM } = await import('../llm/deepseek');
      return new DeepSeekLLM(null, model);
    case 'openai':
      const { OpenAILLM } = await import('../llm/openai');
      return new OpenAILLM(null, model);
    default:
      throw new Error(
        `ENV: No valid LLM_PROVIDER value found in environment! Using ${process.env.LLM_PROVIDER}`
      );
  }
}
