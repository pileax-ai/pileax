import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { ServiceResponse } from "@/common/models/serviceResponse";
import { apiBase } from "@/common/router";
import { app } from "@/server";

describe("Health Check API endpoints", () => {
	it("GET / - success", async () => {
		const response = await request(app).get(`${apiBase}/system/health-check`);
		const result: ServiceResponse = response.body;

		expect(response.statusCode).toEqual(StatusCodes.OK);
		expect(result.success).toBeTruthy();
		expect(result.data).toBeNull();
		expect(result.message).toEqual("Service is healthy");
	});
});
