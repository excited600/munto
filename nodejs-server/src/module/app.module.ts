import { Module } from '@nestjs/common';
import { SocialGatheringsModule } from './social-gatherings.module';
import { UsersModule } from './users.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule, UsersModule, SocialGatheringsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
