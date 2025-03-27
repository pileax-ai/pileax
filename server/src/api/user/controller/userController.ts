import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/service/userService";
import { handleServiceResponse } from "@/core/api/httpHandlers";

class UserController {
	public getUsers: RequestHandler = async (_req: Request, res: Response) => {
		const serviceResponse = await userService.findAll();
		handleServiceResponse(serviceResponse, res);
	};

	public getUser: RequestHandler = async (req: Request, res: Response) => {
		const id = Number.parseInt(req.params.id as string, 10);
		const serviceResponse = await userService.findById(id);
		handleServiceResponse(serviceResponse, res);
	};
}

export const userController = new UserController();
