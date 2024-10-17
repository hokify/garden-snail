/* c8 ignore start */
import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

export async function bootstrap(opts?: { port?: number }) {
  const app = await NestFactory.create(AppModule, {
    rawBody: false,
    bodyParser: false,
    logger: ["fatal", "error", "warn"],
  });
  app.enableVersioning({ type: VersioningType.URI });
  await app.listen(opts?.port ?? 3000, "0.0.0.0");
  return {
    close: () => app.close(),
  };
}
