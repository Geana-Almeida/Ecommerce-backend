import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HashingServiceProtocol } from '../auth/hash/hashing.service';
import { PayloadTokenDto } from '../auth/dto/payload-token.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,
  ){}


  async create(createUserDto: CreateUserDto) {
    try{
      const user = await this.prisma.users.findFirst({
        where: {
          email: createUserDto.email
        }
      })

      if(user){
        throw new HttpException("Usuário já existente", 401)
      }

      const passwordHash = await this.hashingService.hash(createUserDto.password)

      const createUser = await this.prisma.users.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash: passwordHash
        },
        select: {
          email: true,
          name: true,
          status: true
        }
      })

      return createUser;
    }catch(error){
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Erro ao atualizar usuário", 500)
    }
  }

  async findAll() {
    try{
      const user = await this.prisma.users.findMany({
        where:{
          status: true
        }
      })

      return user
    }catch(error){
      if(error instanceof HttpException){
        throw error;
      }

      throw new HttpException("Erro ao atuazar usuário", 500)
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          id: id
        },
        select:{
          id: true,
          name: true,
          email: true,
          status: true
        }
      })

      if(!user){
        throw new HttpException("Usuário não encontrado", 404)
      }


      return user
    } catch (error) {
      if(error instanceof HttpException){
        throw error
      }

      throw new HttpException("Erro interno servidor", 500)
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto, tokenPayLoad: PayloadTokenDto) {
    try{
      const user = await this.prisma.users.findFirst({
        where: {
          id: id
        }
      })


      if(!user){
        throw new HttpException("Usuário não encontrado", 404)
      }

      if(id !== tokenPayLoad.sub){
        throw new HttpException("Usuário não autorizado", 401)
      }

      const data: any = {
        name: updateUserDto.name,
        email: updateUserDto.email,
      }

      if(updateUserDto.password){
        data.passwordHash = await this.hashingService.hash(updateUserDto.password)
      }

      const updateUser = await this.prisma.users.update({
        where: {
          id: id
        },
        data: data,
        select: {
          email: true,
          name: true,
          status: true
        }
      })

      return updateUser
    }catch(error){
      if(error instanceof HttpException){
        throw error;
      }

      throw new HttpException("Erro ao atuazar usuário", 500)
    }
  }

  async updateStatus(
  userId: string,
  status: boolean,
  adminId: string,
) {
  const user = await this.prisma.users.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException('Usuário não encontrado');
  }

  return this.prisma.users.update({
    where: { id: userId },
    data: {
      status,
      deactivatedAt: status ? null : new Date(),
      deactivatedBy: status ? null : adminId,
    },
  });
}
}
