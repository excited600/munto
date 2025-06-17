import { IsString } from 'class-validator';

export class ParticipateSocialGatheringDto {
  @IsString()
  imp_uid: string;
} 