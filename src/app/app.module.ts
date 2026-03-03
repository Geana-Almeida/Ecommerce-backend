import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule , AuthModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
