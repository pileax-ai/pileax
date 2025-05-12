import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

import { authRegistry } from '@/api/user/api/auth.api';
import { bookRegistry } from '@/api/reading/api/book.api';
import { bookAnnotationRegistry } from '@/api/reading/api/book-annotation.api';
import { chatRegistry } from '@/api/ai/api/chat.api';
import { chatSessionRegistry } from '@/api/ai/api/chat-session.api';
import { fileRegistry } from '@/api/file/api/file.api';
import { knowledgeRegistry } from '@/api/knowledge/api/knowledge.api';
import { noteRegistry } from '@/api/note/api/note.api';
import { providerRegistry } from '@/api/ai/api/provider.api';
import { systemRegistry } from '@/api/system/api/system.api';
import { systemConfigRegistry } from '@/api/system/api/config.api';
import { userRegistry } from '@/api/user/api/user.api';
import { userBookRegistry } from '@/api/reading/api/user-book.api';

export function generateOpenAPIDocument() {
	const registry = new OpenAPIRegistry([
    authRegistry,
    bookRegistry,
    bookAnnotationRegistry,
    chatRegistry,
    chatSessionRegistry,
    fileRegistry,
    noteRegistry,
    knowledgeRegistry,
    providerRegistry,
		systemRegistry,
		systemConfigRegistry,
		userRegistry,
    userBookRegistry,
	]);
	const generator = new OpenApiGeneratorV3(registry.definitions);

	const document = generator.generateDocument({
		openapi: '3.0.0',
		info: {
			version: '1.0.0',
			title: 'Swagger API',
		},
		externalDocs: {
			description: 'View the raw OpenAPI Specification in JSON format',
			url: '/swagger.json',
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
      bearerAuth: [
        'abc'
      ],
    }
  ];

  return document;
}

export const swaggerOptions = {
  swaggerOptions: {
    persistAuthorization: true, // ✅ Persist
    authAction: {
      bearerAuth: {
        name: 'bearerAuth',
        schema: {
          type: 'http',
          in: 'header',
          name: 'Authorization',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        value: `${process.env.API_JWT_DEFAULT_TOKEN}`, // ✅ Default JWT Token
      },
    },
  },
}
