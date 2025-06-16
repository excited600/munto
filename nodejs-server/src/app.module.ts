import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { SocialGatheringsModule } from './social-gatherings/social-gatherings.module';

@Module({
  imports: [PrismaModule, UsersModule, SocialGatheringsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
