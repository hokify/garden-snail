import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { ConfigurationSchema } from "../config/configuration";

@Injectable()
export class ArtifactsGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService<ConfigurationSchema, true>,
  ) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.get("authorization");

    if (!authHeader) return false;

    // eg. "Bearer token123"
    const token = authHeader.split(" ")[1];
    const authConfig = this.configService.get("auth", { infer: true });

    return authConfig.tokens.includes(token);
  }
}
