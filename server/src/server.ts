import 'express-async-errors';
  import cors from 'cors';
import express, { type Express, NextFunction } from 'express';
import helmet from "helmet";

import { registerApi } from '@/api'
import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { apiBase, apiRouter, logger } from "@/common";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import { corsOptions } from "@/common/utils/corsConfig";


import { db } from '@/drizzle';

const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));
// app.use(helmet());
// app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// API Routes
app.use(apiBase, apiRouter);
registerApi();

app.set('db', db);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
