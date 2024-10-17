/* c8 ignore start */
import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";

export async function bootstrap(opts?: { port?: number }) {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: 1024 * 1024 * 1024 }), // 1GiB limit
    { logger: ["fatal", "error", "warn"] },
  );
  app.enableVersioning({ type: VersioningType.URI });
  app.useBodyParser("application/octet-stream");
  await app.listen(opts?.port ?? 3000, "0.0.0.0");
  return {
    close: () => app.close(),
  };
}
