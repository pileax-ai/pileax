import type { Request, RequestHandler, Response } from 'express';

import { chatService as service } from '@/api/ai/service/chat.service';
import { sendOk } from '@/core/api/httpHandlers';
import { ServerException } from '@/core/api/exceptions';
import { Chat, ChatCompletion } from '@/api/ai/model/chat.model'
import { BaseController } from '@/core/api/base.controller'

class ChatController extends BaseController<Chat>{
  constructor() {
    super(service);
  }

  public findBySession: RequestHandler = async (req: Request, res: Response) => {
    const id = req.query.id as string;
    const doc = await service.findBySession(id);
    sendOk(res, doc);
  };

  public chatCompletion: RequestHandler = async (req: Request, res: Response) => {
    const data = req.body as ChatCompletion;
    try {
      if (data.stream) {
        // Get stream
        const stream = await service.chatCompletion(data);

        // Set SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        // Send content chunk
        let reasoningResponse = '';
        let response = '';
        for await (const chunk of stream) {
          const reasoningContent = chunk.choices[0]?.delta?.reasoning_content || '';
          const content = chunk.choices[0]?.delta?.content || '';
          const type = reasoningContent ? 'reasoning' : 'content';
          reasoningResponse += reasoningContent;
          response += content;
          res.write(`data: ${JSON.stringify({
            type: type,
            content: reasoningContent || content
          })}\n\n`);
        }

        // Save message to database
        const { id, sessionId, message, model } = data;
        const chat = {
          ...{ id, sessionId, message, model },
          content: response,
          reasoning: data.reasoning ? 1 : 0,
          reasoningContent: reasoningResponse,
          provider: 'deepseek',
          result: 1,
          like: 0,
          status: 1
        }
        await service.create(chat);

        // Send done
        res.write('data: [DONE]\n\n');
        res.end();
      } else {
        const result = await service.chatCompletion(data);
        const choice = result.choices[0] || {};

        // Save message to database
        const message = choice.message;

        // Send to client
        sendOk(res, choice);
      }
    } catch (err: any) {
      console.error(err);
      throw new ServerException('ChatCompletion', err.message);
    }
  };
}

export const chatController = new ChatController();
