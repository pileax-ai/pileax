import type { Request, RequestHandler, Response } from 'express';

import { chatService } from '@/api/ai/service/chat.service';
import { sendOk } from '@/core/api/httpHandlers';
import { ServerException } from '@/core/api/exceptions'
import { ChatCompletion } from '@/api/ai/model/chat.model'

class ChatController {
  public chatCompletion: RequestHandler = async (req: Request, res: Response) => {
    const data = req.body as ChatCompletion;
    try {
      if (data.stream) {
        // Get stream
        const stream = await chatService.chatCompletion(data);

        // Set SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        // Send content chunk
        let fullContent = '';
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          fullContent += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }

        // Save message to database
        const message = {
          role: 'assistant',
          content: fullContent
        }

        // Send done
        res.write('data: [DONE]\n\n');
        res.end();
      } else {
        const result = await chatService.chatCompletion(data);
        const choice = result.choices[0] || {};

        // Save message to database
        const message = choice.message;

        // Send to client
        sendOk(res, choice);
      }
    } catch (err: any) {
      throw new ServerException('ChatCompletion', err.message);
    }
  };
}

export const chatController = new ChatController();
