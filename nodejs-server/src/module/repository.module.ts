import { ParticipantRepository } from '@/repository/participant.repository';
import { PrismaService } from '@/repository/prisma.service';
import { SocialGatheringRepository } from '@/repository/social-gathering.repository';
import { UserRepository } from '@/repository/user.repository';
import { Module } from '@nestjs/common';

@Module({
  providers: [PrismaService, UserRepository, SocialGatheringRepository, ParticipantRepository],
  exports: [PrismaService, UserRepository, SocialGatheringRepository, ParticipantRepository],
})
export class RepositoryModule {} 