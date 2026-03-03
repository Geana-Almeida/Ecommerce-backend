import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TokenExpiredError } from '@nestjs/jwt';
import { TokenPayLoadParam } from 'src/auth/param/token-payload-param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto,
    @TokenPayLoadParam() tokenPayLoad: PayloadTokenDto
  ) {
    return this.usersService.update(id, updateUserDto, tokenPayLoad);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
