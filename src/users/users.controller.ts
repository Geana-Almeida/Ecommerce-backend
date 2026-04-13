import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PayloadTokenDto } from '../auth/dto/payload-token.dto';
import { TokenPayLoadParam } from '../auth/param/token-payload-param';
import { AuthTokenGuard } from '../auth/guard/auth.token.guard';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import type { Request } from 'express';
import { Users } from '@prisma/client';

type AuthRequest = Request & {
  user: Users;
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll(
    @Req() req: Request,
  ) {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  
  @Patch(':id')
  @UseGuards(AuthTokenGuard)
  update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto,
    @TokenPayLoadParam() tokenPayLoad: PayloadTokenDto
  ) {
    return this.usersService.update(id, updateUserDto, tokenPayLoad);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('status/:id')
  updateStatus(
  @Param('id') id: string,
  @Body() body: UpdateUserStatusDto,
  @Req() req: Request,
) {
  const adminId = req.user!.id;

  return this.usersService.updateStatus(
    id,
    body.status,
    adminId,
  );
}

}
