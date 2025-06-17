import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, UseInterceptors, UploadedFile, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@/controller/user-decorator';
import { ParticipantInfo } from '@/model/participant-info.interface';
import { ParticipateSocialGatheringDto } from '@/model/participate-social-gathering.dto';
import { CreateSocialGatheringDto } from '@/model/create-social-gathering.dto';
import { SocialGatheringsService } from '@/service/social-gatherings.service';
import { JwtAuthGuard } from '@/service/jwt-auth.guard';

@Controller('social-gatherings')
export class SocialGatheringsController {
  constructor(private readonly socialGatheringsService: SocialGatheringsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @User('email') sessionEmail: string,
    @Body() createSocialGatheringDto: CreateSocialGatheringDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ) {
    return this.socialGatheringsService.create(sessionEmail, createSocialGatheringDto, thumbnail);
  }

  @Get('latest')
  findLatest(@Query('count') count?: string) {
    const countNumber = count ? parseInt(count, 10) : undefined;
    return this.socialGatheringsService.findLatest(countNumber);
  }

  @Get('scroll')
  findWithCursor(@Query('cursor') cursor?: string) {
    const cursorNumber = cursor ? parseInt(cursor, 10) : undefined;
    return this.socialGatheringsService.findWithCursor(cursorNumber);
  }

  @Get(':id/participants')
  getParticipants(@Param('id', ParseIntPipe) id: number): Promise<ParticipantInfo[]> {
    return this.socialGatheringsService.getParticipants(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.socialGatheringsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/participate')
  participate(
    @User('email') sessionEmail: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() participateSocialGatheringDto: ParticipateSocialGatheringDto
  ) {
    return this.socialGatheringsService.participate(id, sessionEmail, participateSocialGatheringDto);
  }
}