import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from '../prisma/prisma.service';
import { StripeModule } from '../stripe/stripe.module';


@Module({
  imports: [StripeModule],
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
})
export class ProductModule {}