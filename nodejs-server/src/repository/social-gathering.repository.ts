import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { CreateSocialGatheringRequest } from "@/model/create-social-gathering.request";
import { Prisma, SocialGathering } from "@prisma/client";

@Injectable()
export class SocialGatheringRepository {
    constructor(private prisma: PrismaService) { }

    async create(tx: Prisma.TransactionClient, hostUuid: string, dto: CreateSocialGatheringRequest, thumbnailUrl: string, createdByUuid: string, updatedByUuid: string): Promise<SocialGathering> {
        return await tx.socialGathering.create({
            data: {
                host_uuid: hostUuid,
                name: dto.name,
                location: dto.location,
                price: parseInt(dto.price, 10),
                start_datetime: dto.start_datetime,
                end_datetime: dto.end_datetime,
                thumbnail_url: thumbnailUrl,
                created_by: createdByUuid,
                updated_by: updatedByUuid,
                created_at: new Date(),
                updated_at: new Date()
            }
        });
    }

    async getById(id: number): Promise<SocialGathering> {
        const socialGathering =await this.prisma.socialGathering.findUnique({
            where: { id }
        });

        if (!socialGathering) {
            throw new NotFoundException(`Social gathering not found by id: ${id}`);
        }

        return socialGathering;
    }

    async findLatestSocialGatherings(count: number): Promise<SocialGathering[]> {
        return await this.prisma.$queryRaw<SocialGathering[]>`
            SELECT * FROM "SocialGathering"
            ORDER BY "start_datetime" DESC
            LIMIT ${count}
        `;
    }

    async findLatestSocialGatheringsWithCursor(cursor?: number): Promise<SocialGathering[]> {
        return await this.prisma.$queryRaw<SocialGathering[]>`
            SELECT * FROM "SocialGathering"
            ${cursor ? Prisma.sql`WHERE id < ${cursor}` : Prisma.empty}
            ORDER BY id DESC
            LIMIT ${DEFAULT_LIMIT}
        `;
    }
}

const DEFAULT_LIMIT = 50;