import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/core/api/commonValidation';

extendZodWithOpenApi(z);

export type Note = z.infer<typeof NoteSchema>;
export type NoteUpdate = z.infer<typeof NoteUpdateSchema>;
export type NoteQuery = z.infer<typeof NoteQuerySchema>;

// POST /note
export const NoteSchema = z.object({
	id: z.string(),
	parent: z.string().optional(),
	title: z.string().optional(),
	content: z.string().optional(),
	icon: z.string().optional(),
	cover: z.string().optional(),
});

export const NoteBodySchema = {
  description: 'Save Note',
  content: {
    'application/json': {
      schema: NoteSchema.openapi('note')
    }
  }
}

export const NoteUpdateSchema = NoteSchema.partial();

// GET /note/:id
export const NoteGetSchema = z.object({
  query: z.object({ id: commonValidations.stringId }),
});

export const NoteEmptySchema = z.object({
});

// POST /note/query
export const NoteQuerySchema = z.object({
  pageIndex: z.number().default(1),
  pageSize: z.number().default(20),
  condition: z.object({
  }).optional(),
  orderBy: z.object({
  }).default({ updateTime: 'desc' })
});


export const NoteQueryBodySchema = {
  description: 'Query Note',
  content: {
    'application/json': {
      schema: NoteQuerySchema.openapi('noteQuery')
    }
  }
}
