import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;

export const UserSchema = z.object({
	id: z.string(),
  diallingCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
	name: z.string(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  cover: z.string().optional(),
  remarks: z.string().optional(),
  status: z.number().optional(),
});

export const UserBodySchema = {
  description: 'Save User',
  content: {
    'application/json': {
      schema: UserSchema.openapi('UserBody')
    }
  }
}

export const UserUpdateSchema = UserSchema.partial()
