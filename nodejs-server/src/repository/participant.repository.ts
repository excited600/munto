import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Participant, Prisma } from '@prisma/client';
import { ParticipantResponse } from "@/model/participant.response";

@Injectable()
export class ParticipantRepository {
  constructor(private prisma: PrismaService) {}

  async create(tx: Prisma.TransactionClient, socialGatheringId: number, userUuid: string): Promise<Participant> {
    return await tx.participant.create({
      data: { social_gathering_id: socialGatheringId, user_uuid: userUuid },
    });
  }

  async findParticipantsBySocialGatheringId(socialGatheringId: number): Promise<ParticipantResponse[]> {
    return await this.prisma.$queryRaw<ParticipantResponse[]>`
      SELECT 
        u.uuid::text as user_uuid,
        u.name,
        u.profile_picture_url,
        u.temperature,
        u.introduction
      FROM "Participant" p
      INNER JOIN "User" u ON p.user_uuid::text = u.uuid::text
      WHERE p.social_gathering_id = ${socialGatheringId}
    `;
  }
}