import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export class ServiceResponse<T = null> {
	readonly success: boolean;
	readonly message: string;
	readonly data: T;
	readonly code: number;

	private constructor(success: boolean, message: string, data: T, code: number) {
		this.success = success;
		this.message = message;
		this.data = data;
		this.code = code;
	}

	static success<T>(message: string, data: T, code: number = StatusCodes.OK) {
		return new ServiceResponse(true, message, data, code);
	}

	static failure<T>(message: string, data: T, code: number = StatusCodes.BAD_REQUEST) {
		return new ServiceResponse(false, message, data, code);
	}
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		success: z.boolean(),
		message: z.string(),
		data: dataSchema.optional(),
		code: z.number(),
	});
