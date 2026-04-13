import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthTokenGuard } from '../auth/guard/auth.token.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import type { Request } from 'express';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) {}

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: Request,
  ) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: Request,
  ){
    return this.categoryService.update(id, updateCategoryDto);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: Request,
  ){
    return this.categoryService.remove(id);
  }
}