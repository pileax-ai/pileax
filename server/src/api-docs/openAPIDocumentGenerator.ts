import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { authRegistry } from '@/api/user/api/auth.api';
import { bookRegistry } from '@/api/reading/api/book.api';
import { bookAnnotationRegistry } from '@/api/reading/api/book-annotation.api';
import { chatRegistry } from '@/api/ai/api/chat.api';
import { chatSessionRegistry } from '@/api/ai/api/chat-session.api';
import { fileRegistry } from '@/api/file/api/file.api';
import { noteRegistry } from '@/api/note/api/note.api';
import { systemRegistry } from '@/api/system/api/system.api';
import { userRegistry } from "@/api/user/api/user.api";

export function generateOpenAPIDocument() {
	const registry = new OpenAPIRegistry([
    authRegistry,
    bookRegistry,
    bookAnnotationRegistry,
    chatRegistry,
    chatSessionRegistry,
    fileRegistry,
    noteRegistry,
		systemRegistry,
		userRegistry,
	]);
	const generator = new OpenApiGeneratorV3(registry.definitions);

	const document = generator.generateDocument({
		openapi: "3.0.0",
		info: {
			version: "1.0.0",
			title: "Swagger API",
		},
		externalDocs: {
			description: "View the raw OpenAPI Specification in JSON format",
			url: "/swagger.json",
		},
	});

  document.components = {
    ...document.components,
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    }
  };

  document.security = [
    {
      bearerAuth: [],
    }
  ];

  return document;
}
