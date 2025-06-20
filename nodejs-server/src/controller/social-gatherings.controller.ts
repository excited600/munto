import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, UseInterceptors, UploadedFile, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@/controller/user-decorator';
import { ParticipantResponse } from '@/model/participant.response';
import { ParticipateSocialGatheringRequest } from '@/model/participate-social-gathering.request';
import { CreateSocialGatheringRequest } from '@/model/create-social-gathering.request';
import { SocialGatheringsService } from '@/service/social-gatherings.service';
import { JwtAuthGuard } from '@/controller/jwt-auth.guard';
import { OptionalJwtGuard } from './optional-jwt.guard';

@Controller('social-gatherings')
export class SocialGatheringsController {
  constructor(private readonly socialGatheringsService: SocialGatheringsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @User('email') sessionEmail: string,
    @Body() createSocialGatheringDto: CreateSocialGatheringRequest,
    @UploadedFile() thumbnail: Express.Multer.File,
  ) {
    return this.socialGatheringsService.create(sessionEmail, createSocialGatheringDto, thumbnail);
  }

  @Get('recommendations')
  findLatest(@Query('count') count?: string) {
    const countNumber = count ? parseInt(count, 10) : undefined;
    return this.socialGatheringsService.findRecommendations(countNumber);
  }

  @Get('scroll')
  findWithCursor(@Query('cursor') cursor?: string) {
    const cursorNumber = cursor ? parseInt(cursor, 10) : undefined;
    return this.socialGatheringsService.findWithCursor(cursorNumber);
  }

  @Get(':id/participants')
  getParticipants(@Param('id', ParseIntPipe) id: number): Promise<ParticipantResponse[]> {
    return this.socialGatheringsService.getParticipants(id);
  }

  @UseGuards(OptionalJwtGuard)
  @Get(':id')
  findById(
    @Param('id', ParseIntPipe) id: number,
    @User('email') sessionEmail?: string) {
      console.log(sessionEmail)
    return this.socialGatheringsService.getById(id, sessionEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/participate')
  participate(
    @User('email') sessionEmail: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() participateSocialGatheringDto: ParticipateSocialGatheringRequest
  ) {
    return this.socialGatheringsService.participate(id, sessionEmail, participateSocialGatheringDto);
  }
}