import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UploadService } from '../upload/upload.service';

import type { Express, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthTokenGuard } from '../auth/guard/auth.token.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Role, Users } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';

// 🔥 tipo custom
type AuthRequest = Request & {
  user: Users;
};

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly uploadService: UploadService,
  ) {}

  // 🔥 CREATE (ADMIN)
  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthRequest,
  ) {
    let imageUrl: string | undefined;

    if (file) {
      imageUrl = await this.uploadService.uploadFile(
        file,
        '/ecommerce/products',
      );
    }

    return this.productService.create({
      ...createProductDto,
      imageUrl,
    });
  }

  // 🔓 PUBLIC
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  // 🔓 PUBLIC
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  // 🔥 UPDATE (ADMIN)
  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  // 🔥 DELETE (ADMIN → soft delete)
  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}