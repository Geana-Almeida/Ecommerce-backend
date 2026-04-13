import {
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto): Promise<Category> {
    try {
      return await this.prisma.category.create({
        data,
      });
    } catch (error) {
      throw new HttpException('Erro ao criar categoria', 500);
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      return await this.prisma.category.findMany();
    } catch (error) {
      throw new HttpException('Erro ao buscar categorias', 500);
    }
  }

  async findOne(id: string): Promise<Category> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException('Categoria não encontrada');
      }

      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro ao buscar categoria', 500);
    }
  }

  async update(
    id: string,
    data: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      await this.findOne(id);

      return await this.prisma.category.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro ao atualizar categoria', 500);
    }
  }

  async remove(id: string): Promise<Category> {
    try {
      await this.findOne(id);

      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro ao remover categoria', 500);
    }
  }
}