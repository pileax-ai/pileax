import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { noteRegistry } from '@/api/note/api/noteApi';
import { systemRegistry } from '@/api/system/api/systemApi';
import { userRegistry } from "@/api/user/api/userApi";

export function generateOpenAPIDocument() {
	const registry = new OpenAPIRegistry([
    noteRegistry,
		systemRegistry,
		userRegistry,
	]);
	const generator = new OpenApiGeneratorV3(registry.definitions);

	return generator.generateDocument({
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
}
