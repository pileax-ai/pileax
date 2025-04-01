
/**
 * BaseLLMProvider
 *
 * @version 1.0
 */
export interface BaseLLMProvider {
  streamChatCompletion(messages: null | undefined, options: Indexable): Promise<unknown>;
}
