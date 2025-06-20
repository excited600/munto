import { Injectable, BadRequestException } from '@nestjs/common';
import { IamportService } from '@/service/iamport.service';
import { CreateSocialGatheringRequest } from '@/model/create-social-gathering.request';
import { ParticipateSocialGatheringRequest } from '@/model/participate-social-gathering.request';
import { UserRepository } from '@/repository/user.repository';
import { SocialGatheringRepository } from '@/repository/social-gathering.repository';
import { ParticipantRepository } from '@/repository/participant.repository';
import { SocialGatheringResponse } from '@/model/social-gathering.response';
import { S3Service } from './s3.service';
import { PrismaService } from '@/repository/prisma.service';
import { Inject } from '@nestjs/common';
import { SocialGathering } from '@prisma/client';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { Cron } from '@nestjs/schedule';
import { SocialGatheringDetailResponse } from '@/model/social-gathering-detail.response';
import Redlock, { Lock } from 'redlock';



@Injectable()
export class SocialGatheringsService {
  constructor(
    private iamportService: IamportService,
    private userRepository: UserRepository,
    private socialGatheringRepository: SocialGatheringRepository,
    private participantRepository: ParticipantRepository,
    private prisma: PrismaService,
    private s3Service: S3Service,
    @Inject('REDIS_CACHE') private readonly redisCache: Cache,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    @Inject('REDLOCK') private readonly redlock: Redlock,
  ) { }

  async create(sessionEmail: string, createSocialGatheringDto: CreateSocialGatheringRequest, thumbnail: Express.Multer.File) {
    const sessionUser = await this.userRepository.getByEmail(sessionEmail);
    if (!sessionUser.is_host) {
      throw new BadRequestException('호스트가 아닙니다.');
    }

    const thumnailUrl = await this.s3Service.uploadImageToS3(thumbnail.buffer, thumbnail.mimetype, 'social-gatherings');
    return await this.prisma.$transaction(async (tx) => {
      const socialGathering = await this.socialGatheringRepository.create(tx, sessionUser.uuid, createSocialGatheringDto, thumnailUrl, sessionUser.uuid, sessionUser.uuid);
      await this.participantRepository.create(tx, socialGathering.id, sessionUser.uuid);
      return SocialGatheringResponse.from(socialGathering)
    });

  }

  async getById(id: number, sessionEmail?: string): Promise<SocialGatheringDetailResponse> {
    const socialGathering = await this.socialGatheringRepository.getById(id)
    await this.redisClient.incr(`view-count:social-gathering:${id}`)
    const response = SocialGatheringResponse.from(socialGathering)

    let requestorIsHost = false;
    if (sessionEmail) {
      const sessionUser = await this.userRepository.getByEmail(sessionEmail);
      requestorIsHost = sessionUser.uuid === socialGathering.host_uuid;
    }

    return {
      ...response,
      requestorIsHost
    }
  }

  async findRecommendations(count?: number) {
    let recommendedGatherings = await this.redisCache.get<SocialGathering[]>('recommended-social-gatherings');
    if (recommendedGatherings) {
      return recommendedGatherings.map(gathering => SocialGatheringResponse.from(gathering));
    }

    if (count == undefined || count == null || isNaN(count) || count <= 0) {
      count = DEFAULT_COUNT;
    }

    recommendedGatherings = await this.socialGatheringRepository.findGatheringsOrderByViewCountWithLimit(count);

    await this.redisCache.set('recommended-social-gatherings', recommendedGatherings);
    return recommendedGatherings.map(gathering => SocialGatheringResponse.from(gathering));
  }

  async findWithCursor(cursor?: number) {
    const socialGatherings = await this.socialGatheringRepository.findLatestSocialGatheringsWithCursor(cursor)
    return socialGatherings.map(gathering => SocialGatheringResponse.from(gathering));
  }

  async participate(id: number, sessionEmail: string, participateRequest: ParticipateSocialGatheringRequest) {
    const socialGathering = await this.socialGatheringRepository.getById(id);

    const paymentResult = await this.iamportService.getPaymentResult(participateRequest.imp_uid);
    if (paymentResult.status !== 'paid') {
      throw new BadRequestException('결제가 완료되지 않았습니다.');
    }
    if (paymentResult.amount !== socialGathering.price) {
      throw new BadRequestException('결제 금액이 일치하지 않습니다.');
    }

    const sessionUser = await this.userRepository.getByEmail(sessionEmail);

    return await this.prisma.$transaction(async (tx) => {
      await this.participantRepository.create(tx, id, sessionUser.uuid);
      return { message: '성공적으로 참가했습니다.' };
    })
  }

  async getParticipants(socialGatheringId: number) {
    return this.participantRepository.findParticipantsBySocialGatheringId(socialGatheringId)
  }

  @Cron('*/1 * * * *')
  async syncViewCountsToDatabase() {
    let lock: Lock;

    try {
      lock = await this.redlock.acquire(['lock:view-count'], 5000)
    } catch (error) {
      console.log('Failed to acquire lock:', error);
      return;
    }

    try {
      const keys = await this.redisClient.keys('view-count:social-gathering:*');
      for (const key of keys) {
        const id = parseInt(key.split(':')[2], 10);
        const count = parseInt(await this.redisClient.get(key) || '0', 10);

        if (isNaN(id) || isNaN(count) || count <= 0) {
          await this.redisClient.del(key);
          continue;
        }
        await this.socialGatheringRepository.increaseViewCount(id, count)
        await this.redisClient.del(key);
      }
    } finally {
      try {
        await lock.release();
      } catch (error) {
        console.log('Failed to release lock:', error);
      }
    }
  }
}


const DEFAULT_COUNT = 10;