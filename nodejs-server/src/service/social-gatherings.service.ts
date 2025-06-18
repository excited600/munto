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

@Injectable()
export class SocialGatheringsService {
  constructor(
    private iamportService: IamportService,
    private userRepository: UserRepository,
    private socialGatheringRepository: SocialGatheringRepository,
    private participantRepository: ParticipantRepository,
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) { }

  async create(sessionEmail: string, createSocialGatheringDto: CreateSocialGatheringRequest, thumbnail: Express.Multer.File) {
    const sessionUser = await this.userRepository.getByEmail(sessionEmail);
    const thumnailUrl = await this.s3Service.uploadImageToS3(thumbnail.buffer, thumbnail.mimetype, 'social-gatherings');
    return await this.prisma.$transaction(async (tx) => {
      const socialGathering = await this.socialGatheringRepository.create(tx, sessionUser.uuid, createSocialGatheringDto, thumnailUrl, sessionUser.uuid, sessionUser.uuid);
      await this.participantRepository.create(tx, socialGathering.id, sessionUser.uuid);
      return SocialGatheringResponse.from(socialGathering)
    });
    
  }

  async getById(id: number) {
    const socialGathering = await this.socialGatheringRepository.getById(id)
    return SocialGatheringResponse.from(socialGathering)
  }

  async findLatest(count?: number) {
    if (count == undefined || count == null || isNaN(count) || count <= 0) {
      count = DEFAULT_COUNT;
    }

    const socialGatherings = await this.socialGatheringRepository.findLatestSocialGatherings(count)

    return socialGatherings.map(gathering => SocialGatheringResponse.from(gathering));
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
}


const DEFAULT_COUNT = 10;