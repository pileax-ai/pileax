import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly } from "envalid";
import * as process from 'node:process';

const environment = process.env.NODE_ENV || 'development';
// dotenv.config({ path: `.env.${environment}` });
dotenv.config();

export const env = cleanEnv(process.env, {
	NODE_ENV: str({ devDefault: testOnly("test"), choices: ["development", "production", "test"] }),
	HOST: host({ devDefault: testOnly("localhost") }),
	PORT: port({ devDefault: testOnly(3000) }),
	CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
	COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
	COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  DATABASE_URL: str({ devDefault: testOnly('src/storage/metadata.db') }),
  PUBLIC_ROOT: str({ devDefault: testOnly('.') }),
  SERVER_ROOT: str({ devDefault: testOnly('.') }),
});

export const getEnvVariable = (key: string, value: any) => {
  return process.env[key];
}

export const setEnvVariable = (key: string, value: any) => {
  console.log('setEnvVariable', key, value);
  process.env[key] = value;
}
