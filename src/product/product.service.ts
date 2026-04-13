import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  async create(data: CreateProductDto): Promise<Product> {
    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const stripeProduct = await this.stripeService.createProduct(
      data.name,
    );

    const stripePrice = await this.stripeService.createPrice(
      stripeProduct.id,
      data.price,
    );

    return this.prisma.product.create({
      data: {
        ...data,
        stripeProductId: stripeProduct.id,
        stripePriceId: stripePrice.id,
      },
    });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { active: true },
      include: { category: true },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product || !product.active) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async update(
    id: string,
    data: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product || !product.active) {
      throw new NotFoundException('Produto não encontrado');
    }

    // 🔥 validar categoria se vier no update
    if (data.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Categoria não encontrada');
      }
    }

    // 🔥 se alterar preço → cria novo price no Stripe
    if (data.price !== undefined) {
      if (!product.stripeProductId) {
        throw new BadRequestException('Produto sem vínculo com Stripe');
      }

      const newPrice = await this.stripeService.createPrice(
        product.stripeProductId,
        data.price,
      );

      return this.prisma.product.update({
        where: { id },
        data: {
          ...data,
          stripePriceId: newPrice.id,
        },
      });
    }

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product || !product.active) {
      throw new NotFoundException('Produto não encontrado');
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        active: false,
      },
    });
  }
}