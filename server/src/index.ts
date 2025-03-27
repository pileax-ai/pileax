import { env } from "@/common/utils/envConfig";
import { app, logger } from "@/server";
import type { Server } from 'node:http';
import type { ServerInstance } from '@/types/types';

export const createServer = (): ServerInstance => {
	let server: Server | null = null

	const onCloseSignal = () => {
		logger.info("Sigint received, shutting down");
		server?.close(() => {
			logger.info("Server closed");
			process.exit();
		});
		setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
	};

	process.on("SIGINT", onCloseSignal);
	process.on("SIGTERM", onCloseSignal);

	return {
		start: async () => {
			const port = env.PORT;
			server = app.listen(port, () => {
				const { NODE_ENV, HOST, PORT } = env;
				logger.info(`Server (${NODE_ENV}) running on port: http://${HOST}:${PORT}/api/docs`);
			});
			return { server, port }
		},
		stop: () => {
			server?.close()
			logger.info('🔌 Server stopped')
		}
	}
}

// Standalone mode
if (require.main === module) {
	const { start } = createServer()
	start().then(res => {
		logger.info(`Server starts in standalone mode: ${res.port}`)
	}).catch(err => {
		console.error('❌ Failed to start server:', err)
		process.exit(1)
	})
}
