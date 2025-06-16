import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, UseInterceptors, UploadedFile, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SocialGatheringsService } from './social-gatherings.service';
import { CreateSocialGatheringDto } from './dto/create-social-gathering.dto';
import { ParticipateSocialGatheringDto } from './dto/participate-social-gathering.dto';
import { ParticipantInfo } from './interfaces/participant-info.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { User } from 'src/decorators/user-decorator';

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