import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from '@/core/api/commonValidation'

extendZodWithOpenApi(z);

export type Signin = z.infer<typeof SigninSchema>;

export const SigninSchema = z.object({
  diallingCode: z.string().default('86'),
  phone: z.string(),
	password: z.string(),
});

export const SigninResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    diallingCode: z.string().default('86'),
    phone: z.string(),
    name: z.string(),
    bio: z.string(),
    avatar: z.string(),
    cover: z.string(),
  }),
  token: z.string(),
});

