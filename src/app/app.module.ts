import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';
import { CategoryModule } from '../category/category.module';


@Module({
  imports: [ConfigModule.forRoot(), UsersModule , AuthModule, ProductModule, CategoryModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
