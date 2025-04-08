import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { apiBase, apiRouter } from "@/common/router";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetUserSchema, UserSchema } from "@/api/user/model/user.model";
import { validateRequest } from "@/core/api/httpHandlers";
import { userController } from "../controller/user.controller";

export const userRegistry = new OpenAPIRegistry();
export const userApi = () => {}

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
	method: "get",
	path: `${apiBase}/user/users`,
	tags: ["User"],
	responses: createApiResponse(z.array(UserSchema), "Success"),
});

apiRouter.get("/user/users", userController.getUsers);

userRegistry.registerPath({
	method: "get",
	path: `${apiBase}/user/{id}`,
	tags: ["User"],
	request: { params: GetUserSchema.shape.params },
	responses: createApiResponse(UserSchema, "Success"),
});

apiRouter.get("/user/:id", validateRequest(GetUserSchema), userController.getUser);
