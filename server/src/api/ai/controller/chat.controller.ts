import type { Request, RequestHandler, Response } from 'express';

import { chatService } from '@/api/ai/service/chat.service';
import { sendOk } from '@/core/api/httpHandlers';
import { ServerException } from '@/core/api/exceptions'
import { an } from 'vitest/dist/chunks/reporters.d.CqBhtcTq'

class ChatController {
  public chatCompletion: RequestHandler = async (req: Request, res: Response) => {
    const data = req.body;
    try {
      // Get stream
      const stream = await chatService.chatCompletion();

      // Set SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();


      // Send chunk
      // 流式返回数据
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }

      res.write('data: [DONE]\n\n'); // 结束标记
      res.end();
      sendOk(res, { });
    } catch (err: any) {
      throw new ServerException('ChatCompletion', err.message);
    }
  };
}

export const chatController = new ChatController();
