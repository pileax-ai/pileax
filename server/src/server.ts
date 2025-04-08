import 'express-async-errors';
  import cors from 'cors';
import express, { type Express, NextFunction } from 'express';
import helmet from "helmet";

import { registerApi } from '@/api'
import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { apiBase, apiRouter, logger } from "@/common";
import { jwtVerifier, attachUserId } from "@/common/middleware/jwtVerifier";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import { corsOptions } from "@/common/utils/corsConfig";


import { db } from '@/drizzle';
import path from 'path'

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

// JWT
app.use(jwtVerifier);
app.use(attachUserId);

// API Routes
app.use(apiBase, apiRouter);
registerApi();

// Swagger UI
app.use(openAPIRouter);

// Serving static files
app.use('/files', express.static(env.PUBLIC_ROOT));

app.set('db', db);


// Error handlers
app.use(errorHandler());

export { app, logger };
