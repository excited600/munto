import { Module } from '@nestjs/common';
import { SocialGatheringsService } from './social-gatherings.service';
import { SocialGatheringsController } from './social-gatherings.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { IamportService } from './iamport.service';

@Module({
  imports: [PrismaModule],
  controllers: [SocialGatheringsController],
  providers: [SocialGatheringsService, IamportService],
})
export class SocialGatheringsModule {} 