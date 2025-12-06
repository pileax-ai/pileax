export interface ChatInput {
  id: string;
  message: string;
  reasoning: boolean;
}

export interface Chat {
  id?: string;
  userId?: number;
  conversationId?: string;
  message: string;
  content: string;
  reasoning: string;
  reasoningContent: string;
  provider?: string;
  model?: string;
  result?: number;
  like?: number;
  createTime?: string;
  updateTime?: string;
}

export interface ChatConversation {
  id: string;
  appId: string;
  userId?: number;
  name: string;
  modelProvider?: string;
  modelType?: string;
  modelName?: string;
  favorite: number;
  createTime: string;
  updateTime: string;
}
