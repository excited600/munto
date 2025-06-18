import { ParticipantRepository } from '@/repository/participant.repository';
import { PrismaService } from '@/repository/prisma.service';
import { SocialGatheringRepository } from '@/repository/social-gathering.repository';
import { UserRepository } from '@/repository/user.repository';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [PrismaService, UserRepository, SocialGatheringRepository, ParticipantRepository],
  exports: [PrismaService, UserRepository, SocialGatheringRepository, ParticipantRepository],
})
export class RepositoryModule {} 