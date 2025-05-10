export interface ChatInput {
  message: string;
  reasoning: boolean;
}

export interface Chat {
  id?: string;
  userId?: number;
  sessionId?: string;
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

export interface ChatSession {
  id: string;
  userId?: number;
  title: string;
  name: string;
  assistant: string;
  favorite: number;
  createTime: string;
  updateTime: string;
}
