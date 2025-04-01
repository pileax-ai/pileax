import { ChatMessage } from '@/types/chat';

/**
 * BaseLLMProvider
 *
 * @version 1.0
 */
export interface BaseLLMProvider {
  createChatCompletion(messages: ChatMessage[], options: Indexable): Promise<unknown>;
}
