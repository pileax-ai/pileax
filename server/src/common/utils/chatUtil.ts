import type { Request, Response } from 'express';
import OpenAI from 'openai';
import { ChatMessage } from '@/types/chat'

interface OllamaStreamChunk {
  done: boolean;
  message: ChatMessage;
  model: string;
}

export class ChatUtil {
  static stream = async (provider: string, res: Response, stream: any) => {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    switch (provider) {
      case 'ollama':
        return await ChatUtil.ollamaStream(res, stream as
          AsyncIterable<OllamaStreamChunk>);
      default:
        return await ChatUtil.openAiStream(res, stream as
          AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>);
    }
  }

  static openAiStream = async (res: Response,
                               stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>) => {
    // Send content chunk
    let model = '';
    let reasoningResponse = '';
    let response = '';
    for await (const chunk of stream) {
      console.log('chunk', chunk);
      // @ts-ignore
      const reasoningContent = chunk.choices[0]?.delta?.reasoning_content || '';
      const content = chunk.choices[0]?.delta?.content || '';
      const type = reasoningContent ? 'reasoning' : 'content';
      reasoningResponse += reasoningContent;
      response += content;
      res.write(`data: ${JSON.stringify({
        type: type,
        content: reasoningContent || content
      })}\n\n`);

      if (chunk.usage) {
        model = chunk.model;
      }
    }

    return {
      model,
      reasoningResponse,
      response
    }
  }


  static ollamaStream = async (res: Response,
                               stream: AsyncIterable<OllamaStreamChunk>) => {
    // Send content chunk
    let model = '';
    let reasoningResponse = '';
    let response = '';
    let think = false;
    for await (const chunk of stream) {
      console.log('chunk', chunk);
      if (chunk.done) {
        model = chunk.model;
        break;
      }
      if (chunk.message) {
        if (chunk.message.content === '<think>') {
          think = true;
          continue;
        } else if (chunk.message.content === '</think>') {
          think = false;
          continue;
        }
        const reasoningContent = think ? chunk.message.content : '';
        const content = !think ? chunk.message.content : '';
        const type = think ? 'reasoning' : 'content';
        reasoningResponse += reasoningContent;
        response += content;
        res.write(`data: ${JSON.stringify({
          type: type,
          content: reasoningContent || content
        })}\n\n`);
      }
    }

    return {
      model,
      reasoningResponse,
      response
    }
  }
}
