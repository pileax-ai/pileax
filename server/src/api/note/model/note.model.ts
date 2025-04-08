import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type Note = z.infer<typeof NoteSchema>;
export type NoteUpdate = z.infer<typeof NoteUpdateSchema>;

export const NoteSchema = z.object({
	id: z.string(),
  userId: z.string().optional(),
	parent: z.string().optional(),
	title: z.string(),
	content: z.string(),
	icon: z.string().optional(),
	cover: z.string().optional(),
  chatId: z.string().optional(),
});

export const NoteBodySchema = {
  description: 'Save Note',
  content: {
    'application/json': {
      schema: NoteSchema.openapi('NoteBody')
    }
  }
}

export const NoteUpdateSchema = NoteSchema.partial();

