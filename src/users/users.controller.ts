import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TokenExpiredError } from '@nestjs/jwt';
import { PayloadTokenDto } from '../auth/dto/payload-token.dto';
import { TokenPayLoadParam } from '../auth/param/token-payload-param';
import { AuthTokenGuard } from '../auth/guard/auth.token.guard';


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
  @UseGuards(AuthTokenGuard)
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
