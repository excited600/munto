import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { SocialGatheringsController } from '@/controller/social-gatherings.controller';
import { SocialGatheringsService } from '@/service/social-gatherings.service';
import { IamportService } from '@/service/iamport.service';

@Module({
  imports: [PrismaModule],
  controllers: [SocialGatheringsController],
  providers: [SocialGatheringsService, IamportService],
})
export class SocialGatheringsModule {} 