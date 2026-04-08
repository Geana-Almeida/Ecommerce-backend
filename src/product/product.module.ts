import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from '../prisma/prisma.service';
import { StripeModule } from '../stripe/stripe.module';
import { UploadModule } from '../upload/upload.module';


@Module({
  imports: [StripeModule, UploadModule],
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
})
export class ProductModule {}