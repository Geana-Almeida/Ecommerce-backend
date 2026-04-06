import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import jwtConfig from "../config/jwt.config";
import type { ConfigType } from "@nestjs/config";
import { REQUEST_TOKEN_PAYLOAD_NAME } from "../common/auth.constants";
import { PrismaService } from "../../prisma/prisma.service";


@Injectable()
export class AuthTokenGuard implements CanActivate{

  constructor(
    private readonly jwtService: JwtService,
    private prismaService: PrismaService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) { }

async canActivate(context: ExecutionContext): Promise<boolean> {
  const request: Request = context.switchToHttp().getRequest();
  const token = this.extractTokenHeader(request);

  if (!token) {
    throw new UnauthorizedException('Token não encontrado');
  }

  try {
    const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);

    const user = await this.prismaService.users.findUnique({
      where: {
        id: payload.sub
      }
    });

    if (!user) {
      throw new UnauthorizedException("Usuário não encontrado.");
    }

    if (!user.status) {
      throw new UnauthorizedException("Usuário inativo.");
    }

    request[REQUEST_TOKEN_PAYLOAD_NAME] = payload;

    return true;

  } catch (error) {
    console.log(error);
    throw new UnauthorizedException("Acesso não autorizado");
  }
}

  extractTokenHeader(request: Request) {
    const authorization = request.headers?.authorization;

    if(!authorization || typeof authorization !== 'string') {
      return null;
    }

    return authorization.split(' ')[1];
  }
}