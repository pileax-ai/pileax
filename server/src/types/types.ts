import { type Application, Request, Response } from 'express';

export interface ServerInstance {
  start: () => Promise<{ server: ReturnType<Application['listen']>; port: number }>
  stop: (server: ReturnType<Application['listen']>) => void
}

export interface ServerInfo {
  port: number
  hostname: string
  baseURL: string
}
