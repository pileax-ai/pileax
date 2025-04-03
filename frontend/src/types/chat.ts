export interface ChatInput {
  message: string;
  reasoning: boolean;
}

export interface ChatSession {
  id: string;
  userId?: number;
  title: string;
  name: string;
  createTime: string;
  updateTime: string;
}
