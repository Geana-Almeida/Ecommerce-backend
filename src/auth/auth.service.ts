import { HttpException, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { HashingServiceProtocol } from './hash/hashing.service';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService
  ) {
  }

  async authenticate(signInDto: SignInDto) {
    try {
      const user = await this.prisma.users.findFirst({
        where: {
          email: signInDto.email,
        }
      })

      if (!user) {
        throw new HttpException('Credenciais inválidas', 401);
      }

      const passwordIsValid = await this.hashingService.compare(signInDto.password, user.passwordHash);

      if (!passwordIsValid) {
        throw new HttpException('Credenciais inválidas', 401);
      }

      const token = await this.jwtService.signAsync(
        {
          sub: user.id,
          name: user.name,
          email: user.email
        },
        {
          secret: this.jwtConfiguration.secret,
          expiresIn: this.jwtConfiguration.jwtTtl,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer
        }
      )

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        token: token
      }
    } catch (error) {
      console.log(error);
      // instanceof verifica se o erro é uma instância dessa classe (ou herda dela)
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Erro ao atualizar usuário", 500)
    }

  }
}
